import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { api } from '../services/api';
import { ChatMessage } from '../../shared/types';
import {
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Bot,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const AshaAssistantPanel: React.FC = () => {
  const {
    isAssistantOpen,
    setIsAssistantOpen,
    userProfile,
    conversations,
    activeConversationId,
    updateConversation,
  } = useApp();
  const { language } = useLanguage();

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-initial',
      role: 'assistant',
      content: `Namaste! I am **Asha**, your civic welfare assistant for SchemeSahay. 🙏\n\nI am here to guide you with empathy, clarity, and official verification on government schemes. How may I help you today? You can ask me in English, Telugu (తెలుగు), Hindi, or your preferred language.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations: [
        {
          sourceTitle: 'SchemeSahay Verified Knowledge Repository (v2026)',
          ministry: 'Government of India Ministries',
          pageNumber: 1,
          version: '3.2',
          lastVerified: '2026-08-22',
          sourceUrl: 'https://myscheme.gov.in',
          snippet: 'Official verified repository of central & state welfare guidelines.',
        },
      ],
    },
  ]);

  const [isListening, setIsListening] = useState(false);
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'positive' | 'negative'>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const savedMessages = conversations.find((conversation) => conversation.id === activeConversationId)?.messages;
    if (savedMessages?.length) setMessages(savedMessages);
    else {
      setMessages([
        {
          id: 'msg-initial',
          role: 'assistant',
          content: `Namaste! I am **Asha**, your civic welfare assistant for SchemeSahay. 🙏\n\nI am here to guide you with empathy, clarity, and official verification on government schemes. How may I help you today? You can ask me in English, Telugu (తెలుగు), Hindi, or your preferred language.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [activeConversationId]);

  useEffect(() => {
    if (isAssistantOpen) updateConversation(messages);
  }, [messages, isAssistantOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Speech Recognition Setup with Telugu (te-IN) mapping
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        const langMap: Record<string, string> = {
          en: 'en-IN',
          hi: 'hi-IN',
          te: 'te-IN', // Telugu locale mapping
          ta: 'ta-IN',
          kn: 'kn-IN',
          ml: 'ml-IN',
          mr: 'mr-IN',
          bn: 'bn-IN',
        };
        recognition.lang = langMap[language] || 'en-IN';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
      }
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Text-To-Speech Playback with Telugu (te-IN) support
  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#_`[\]]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);

      const langMap: Record<string, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        te: 'te-IN', // Telugu Voice Synthesis Locale
        ta: 'ta-IN',
        kn: 'kn-IN',
        ml: 'ml-IN',
      };
      utterance.lang = langMap[language] || 'en-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      // Pass language parameter along with query and user profile
      const res = await api.askAsha(textToSend, userProfile, language);
      const ashaMsg: ChatMessage = {
        id: `asha-${Date.now()}`,
        role: 'assistant',
        content: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: res.citations,
        schemeCard: res.schemeCard,
      };

      setMessages((prev) => [...prev, ashaMsg]);

      if (isSpeakingEnabled) {
        speakText(res.text);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Namaste. I encountered a momentary connection issue. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (msg: ChatMessage, rating: 'positive' | 'negative') => {
    setFeedbackGiven((prev) => ({ ...prev, [msg.id]: rating }));
    try {
      const userQuestion = messages.find((m) => m.role === 'user')?.content || 'User question';
      await api.submitFeedback({
        question: userQuestion,
        answer: msg.content || 'Assistant answer',
        rating,
      });
    } catch (e) {
      console.warn('Feedback submit error:', e);
    }
  };

  if (!isAssistantOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-900 text-white shadow-2xl flex flex-col border-l border-slate-800">
      {/* Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">AI Assistant</h3>
              <span className="text-[10px] uppercase font-bold bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-800">
                {language.toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Voice & Multi-language Enabled</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const newState = !isSpeakingEnabled;
              setIsSpeakingEnabled(newState);
              if (!newState) window.speechSynthesis?.cancel();
            }}
            className={`p-2 rounded-xl border ${
              isSpeakingEnabled ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Toggle Voice Output"
          >
            {isSpeakingEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button onClick={() => setIsAssistantOpen(false)} className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800 overflow-x-auto flex gap-2 no-scrollbar text-xs">
        {[
          'Am I eligible for Post-Matric Scholarship?',
          'How do I apply for PM-KISAN ₹6,000?',
          'పథకాల వివరాలు కావాలి',
        ].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 whitespace-nowrap text-[11px]"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm bg-slate-900">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[90%] rounded-2xl p-4 shadow-sm ${msg.role === 'user' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-100 border border-slate-700'}`}>
              <div className="text-xs leading-relaxed prose prose-invert">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>

              {msg.role === 'assistant' && (
                <button
                  onClick={() => speakText(msg.content || '')}
                  className="mt-2 text-[10px] text-amber-400 flex items-center gap-1 hover:underline font-medium"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>Listen in Voice</span>
                </button>
              )}

              {msg.role === 'assistant' && msg.id !== 'msg-initial' && (
                <div className="mt-3 pt-2 border-t border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Was this helpful?</span>
                  <div className="flex gap-1">
                    <button onClick={() => handleFeedback(msg, 'positive')} className="p-1 hover:text-emerald-400">
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleFeedback(msg, 'negative')} className="p-1 hover:text-rose-400">
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-amber-400 bg-slate-800 p-3 rounded-2xl border border-slate-700 w-max">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>AI Assistant is reviewing guidelines...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer Input */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask AI Assistant (e.g. పథకాల వివరాలు)..."
            className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl py-3 pl-4 pr-20 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <div className="absolute right-2 flex items-center gap-1">
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2 rounded-lg ${isListening ? 'bg-rose-600 text-white animate-pulse' : 'text-slate-400 hover:text-white'}`}
              title="Speak in Telugu/English"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="p-2 rounded-lg bg-amber-500 disabled:opacity-50 text-slate-950 font-bold"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};