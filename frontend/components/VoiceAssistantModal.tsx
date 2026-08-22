import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { api } from '../services/api';
import {
  X,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Bot,
  CheckCircle,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface VoiceAssistantModalProps {
  onClose: () => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ onClose }) => {
  const { userProfile } = useApp();
  const { language, t } = useLanguage();

  const [state, setState] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [citations, setCitations] = useState<any[]>([]);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;

        const langMap: Record<string, string> = {
          en: 'en-IN',
          hi: 'hi-IN',
          te: 'te-IN',
          ta: 'ta-IN',
          kn: 'kn-IN',
          ml: 'ml-IN',
          mr: 'mr-IN',
          bn: 'bn-IN',
        };
        recognition.lang = langMap[language] || 'en-IN';

        recognition.onresult = (event: any) => {
          const current = event.results[0][0].transcript;
          setTranscript(current);
        };

        recognition.onerror = (err: any) => {
          console.warn('Speech error:', err);
          setState('idle');
        };

        recognition.onend = () => {
          if (state === 'listening') {
            setState('idle');
          }
        };

        recognitionRef.current = recognition;
      }
    }
  }, [language, state]);

  const startListening = () => {
    setTranscript('');
    setResponse(null);
    setCitations([]);
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    try {
      recognitionRef.current.start();
      setState('listening');
    } catch (e) {
      console.error(e);
    }
  };

  const stopListeningAndAsk = async () => {
    if (recognitionRef.current && state === 'listening') {
      recognitionRef.current.stop();
    }

    if (!transcript.trim()) {
      setState('idle');
      return;
    }

    setState('processing');
    try {
      const res = await api.askAsha(transcript, userProfile, language);
      setResponse(res.text);
      setCitations(res.citations || []);
      setState('speaking');

      // Speak response aloud
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const clean = res.text.replace(/[*#_`[\]]/g, '');
        const utterance = new SpeechSynthesisUtterance(clean);
        const langMap: Record<string, string> = {
          en: 'en-IN',
          hi: 'hi-IN',
          te: 'te-IN',
          ta: 'ta-IN',
          kn: 'kn-IN',
          ml: 'ml-IN',
          mr: 'mr-IN',
          bn: 'bn-IN',
        };
        utterance.lang = langMap[language] || 'en-IN';
        utterance.rate = 0.95;
        utterance.onend = () => setState('idle');
        window.speechSynthesis.speak(utterance);
      } else {
        setState('idle');
      }
    } catch (e) {
      setResponse('Namaste. I could not connect to the voice assistant service right now. Please try typing your question.');
      setState('idle');
    }
  };

  const handleClose = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 text-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-800 shadow-2xl relative text-center flex flex-col items-center">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Asha Voice Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-amber-400 font-semibold mb-4">
          <Bot className="w-3.5 h-3.5" />
          <span>Asha Multilingual Voice Companion</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
          {state === 'listening'
            ? 'Listening to you...'
            : state === 'processing'
            ? 'Consulting official guidelines...'
            : state === 'speaking'
            ? 'Asha is speaking...'
            : 'Tap to Speak with Asha'}
        </h3>

        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          Speak in Hindi, Telugu, Tamil, Bengali, Marathi, or English. Asha will answer with verified scheme information.
        </p>

        {/* Animated Central Mic Stage */}
        <div className="my-8 relative flex items-center justify-center">
          {state === 'listening' && (
            <div className="absolute w-36 h-36 rounded-full bg-amber-500/20 animate-ping" />
          )}
          {state === 'speaking' && (
            <div className="absolute w-36 h-36 rounded-full bg-emerald-500/20 animate-pulse" />
          )}

          <button
            onClick={state === 'listening' ? stopListeningAndAsk : startListening}
            className={`w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-300 shadow-2xl relative z-10 ${
              state === 'listening'
                ? 'bg-rose-600 text-white scale-110'
                : state === 'speaking'
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-tr from-amber-500 to-orange-600 text-slate-950 hover:scale-105 active:scale-95'
            }`}
          >
            {state === 'listening' ? (
              <MicOff className="w-10 h-10" />
            ) : state === 'speaking' ? (
              <Volume2 className="w-10 h-10 animate-bounce" />
            ) : (
              <Mic className="w-10 h-10 font-bold" />
            )}
          </button>
        </div>

        {/* Spoken Transcript Box */}
        {transcript && (
          <div className="w-full bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-left mb-4">
            <div className="text-[10px] uppercase font-bold text-amber-400 mb-1">Your Spoken Question:</div>
            <p className="text-sm text-slate-200 italic">"{transcript}"</p>
            {state === 'listening' && (
              <button
                onClick={stopListeningAndAsk}
                className="mt-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-1.5 rounded-xl flex items-center gap-1 transition-colors ml-auto"
              >
                <span>Ask Asha Now</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Asha Voice Answer Box */}
        {response && (
          <div className="w-full bg-slate-800/90 p-4 rounded-2xl border border-slate-700 text-left max-h-60 overflow-y-auto mb-4 text-xs sm:text-sm prose prose-invert prose-sm">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        )}

        {/* Source Citations */}
        {citations.length > 0 && (
          <div className="w-full text-left text-[11px] text-slate-400 border-t border-slate-800 pt-3">
            <div className="flex items-center gap-1 text-emerald-400 font-semibold mb-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Grounded in Official Guidelines</span>
            </div>
            <div className="line-clamp-1">{citations[0]?.sourceTitle} (Page {citations[0]?.pageNumber})</div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={startListening}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ask Another Question</span>
          </button>
          <button
            onClick={handleClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
