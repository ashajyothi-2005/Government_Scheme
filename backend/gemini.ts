import { GoogleGenAI } from '@google/genai';
import Groq from 'groq-sdk';
import type { RetrievalResult } from '../rag/retriever.ts';
import { UserProfile } from '../shared/types.ts';

let aiClient: GoogleGenAI | null = null;
let groqClient: Groq | null = null;

function getGroqClient(): Groq | null {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  if (!groqClient) {
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY environment variable is not set. Running in fallback mode.');
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  hi: 'Hindi (हिन्दी)',
  te: 'Telugu (తెలుగు)',
  ta: 'Tamil (தமிழ்)',
  kn: 'Kannada (ಕನ್ನಡ)',
  ml: 'Malayalam (മലയാളം)',
  mr: 'Marathi (मराठी)',
  bn: 'Bengali (বাংলা)',
};

export async function generateGroundedAshaResponse(
  question: string,
  retrieval: RetrievalResult,
  userProfile?: Partial<UserProfile>,
  targetLanguage: string = 'en'
): Promise<{ text: string; citations: any[] }> {
  const groq = getGroqClient();
  const ai = groq ? null : getGeminiClient();
  const langName = LANGUAGE_NAMES[targetLanguage] || 'English';
  const additionalLanguageInstruction = targetLanguage !== 'en' && targetLanguage !== 'te'
    ? ` Also include a third complete section in ${langName}, labeled "${langName} Explanation".`
    : '';

  // Format retrieved official chunks into clean context
  const contextSnippet = retrieval.chunks
    .slice(0, 4)
    .map(
      (c, idx) => `[Source Document ${idx + 1}]
Scheme: ${c.schemeName}
Ministry: ${c.ministry}
Section: ${c.section} (Page ${c.pageNumber})
Version: ${c.version} (Last Verified: ${c.lastVerified})
Official URL: ${c.sourceUrl}
Excerpt: "${c.content}"`
    )
    .join('\n\n');

  // Format citations array for frontend UI cards
  const citations = retrieval.chunks.map((c) => ({
    sourceTitle: `${c.schemeName} - ${c.section}`,
    ministry: c.ministry,
    pageNumber: c.pageNumber,
    version: c.version,
    lastVerified: c.lastVerified,
    sourceUrl: c.sourceUrl,
    snippet: c.content.slice(0, 180) + '...',
  }));

  const userProfileSnippet = userProfile
    ? `User Profile Context (Provided by citizen):
- Age: ${userProfile.age || 'Not provided'}
- Gender: ${userProfile.gender || 'Not provided'}
- State: ${userProfile.state || 'Not provided'}
- Occupation: ${userProfile.occupation || 'Not provided'}
- Education: ${userProfile.educationLevel || 'Not provided'}
- Student Status: ${userProfile.studentStatus ? 'Yes' : 'No'}
- Annual Income: ${userProfile.annualIncome ? '₹' + userProfile.annualIncome.toLocaleString('en-IN') : 'Not provided'}
- Social Category: ${userProfile.socialCategory || 'Not provided'}`
    : 'No specific citizen profile provided.';

  const systemInstruction = `You are "Asha AI Assistant" inside SchemeSahay, an empathetic, supportive, and trustworthy civic guide for Indian citizens seeking government schemes, scholarships, and welfare benefits.

YOUR CORE PRINCIPLES:
1. Speak with warmth, respect, patience, and civic empathy ("Namaste", clear guidance, no bureaucratic jargon).
2. Primary Source Rule: Ground your factual statements (eligibility limits, benefits, documents, deadlines) strictly on the provided [Official Government Context]. Do NOT invent fake schemes, numbers, or rules.
3. If information is insufficient or unverified in the context, clearly explain: "I could not find official verification for this detail in current guidelines."
4. Distinguish clearly between Official Government Criteria, User Provided Profile, and AI Guidance.
5. Multilingual Directive: Always answer in two clearly labeled sections: "English Explanation" followed by "తెలుగు వివరణ". Translate the complete answer into natural Telugu, while preserving exact numbers (e.g. ₹2,50,000), scheme names, and official terms accurately.${additionalLanguageInstruction} The selected language is ${langName}, and English and Telugu are always required.
6. Format both sections cleanly with clear markdown headings, bullet points, and actionable next steps. Always include a brief mention of the official source and last verified date.`;

  const userPrompt = `User Question: "${question}"

Target Language for Response: ${langName}

${userProfileSnippet}

[Official Government Context]:
${contextSnippet}

Please provide an empathetic, clear, and source-grounded response with an English Explanation and a complete Telugu explanation (తెలుగు వివరణ)${additionalLanguageInstruction} answering the citizen's query. Do not omit any required section.`;

  if (!groq && !ai) {
    // Graceful offline fallback response if API key is not present in local test
    const firstChunk = retrieval.chunks[0];
    return {
      text: `## English Explanation\n\nNamaste! Based on the official guidelines for **${firstChunk?.schemeName || 'Government Schemes'}** (Version ${firstChunk?.version || '2026'}, Verified: ${firstChunk?.lastVerified || '22 August 2026'}):\n\n` +
        `• **Official Guidance:** ${firstChunk?.content || 'Please refer to the official portal for guidelines.'}\n\n` +
        `• **Next Steps:** You can verify your specific eligibility and submit applications through the official portal: ${firstChunk?.sourceUrl || 'https://myscheme.gov.in'}.\n\n` +
        `## తెలుగు వివరణ\n\nనమస్కారం! పై అధికారిక మార్గదర్శకాల ఆధారంగా, మీ అర్హత మరియు తదుపరి దశలను అధికారిక పోర్టల్‌లో ధృవీకరించండి. పథకం పేరు, ఆదాయ పరిమితులు, ప్రయోజనాలు మరియు అవసరమైన పత్రాల కోసం పైన ఇచ్చిన అధికారిక సమాచారాన్ని పరిశీలించండి.\n\n` +
        `*Source / మూలం: ${firstChunk?.ministry || 'Government of India'} (Page / పేజీ ${firstChunk?.pageNumber || 1})*`,
      citations,
    };
  }

  try {
    let text: string | undefined;
    if (groq) {
      const response = await groq.chat.completions.create({
        model: 'qwen/qwen3.6-27b',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 4096,
        reasoning_format: 'hidden',
      });
      text = response.choices[0]?.message?.content || undefined;
    } else if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: userPrompt,
        config: { systemInstruction, temperature: 0.3 },
      });
      text = response.text || undefined;
    }

    text = text
      ?.replace(/<think>[\s\S]*?(?:<\/think>|$)/gi, '')
      .trim();
    if (!text) {
      const firstChunk = retrieval.chunks[0];
      text = `## English Explanation\n\n${firstChunk?.content || 'Please check the official scheme source below.'}\n\n` +
        `## తెలుగు వివరణ\n\nఅధికారిక మార్గదర్శకాల ప్రకారం, ఈ పథకానికి సంబంధించిన వివరాలను క్రింది అధికారిక మూలంలో పరిశీలించండి.\n\n` +
        `Source / మూలం: ${firstChunk?.sourceUrl || 'https://myscheme.gov.in'}`;
    }
    return { text, citations };
  } catch (error: any) {
    console.error('Gemini generation error:', error);
    const firstChunk = retrieval.chunks[0];
    return {
      text: `## English Explanation\n\nNamaste! I am currently operating in backup mode. Here is the verified information from official sources:\n\n${firstChunk?.content}\n\nFor more details, visit: ${firstChunk?.sourceUrl}\n\n## తెలుగు వివరణ\n\nనమస్కారం! ప్రస్తుతం సహాయకుడు బ్యాకప్ మోడ్‌లో పనిచేస్తున్నాడు. అధికారిక సమాచారం మరియు మరిన్ని వివరాల కోసం పై వివరాలను పరిశీలించి, అధికారిక పోర్టల్‌ను సందర్శించండి: ${firstChunk?.sourceUrl}`,
      citations,
    };
  }
}
