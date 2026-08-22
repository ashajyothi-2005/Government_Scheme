import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { viewT } from '../i18n/viewTranslations';
import {
  ShieldCheck,
  Heart,
  Globe2,
  Lock,
  Sparkles,
  Bot,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { APP_CONFIG } from '../config';

export const AboutView: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero Intro */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
          <span className="text-sm">🇮🇳</span>
          <span>{viewT(language, 'aboutBadge')}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {viewT(language, 'aboutTitle')}
        </h1>

        <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {viewT(language, 'aboutIntro')}
        </p>
      </div>

      {/* 4 Pillars of SchemeSahay */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">{viewT(language, 'groundingPillar')}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every statement made by the AI Assistant or evaluated in our eligibility algorithms is traceable back to an official government PDF circular, complete with page number, document ID, and active verified timestamp.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">{viewT(language, 'aiPillar')}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Named in honour of India's grassroots healthcare and welfare workers (ASHA), our AI assistant communicates in 8 Indian languages (Hindi, Telugu, Tamil, Marathi, Kannada, Malayalam, Bengali, English) via text and voice.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">{viewT(language, 'privacyPillar')}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Citizens can discover schemes anonymously without sharing sensitive Aadhaar numbers or government credentials. We only collect the minimal parameters necessary to evaluate eligibility rules.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Globe2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">{viewT(language, 'redirectPillar')}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We never charge intermediary fees or impersonate official agencies. Citizens are given clear checklists and redirected directly to official government portals (myscheme.gov.in, scholarships.gov.in, pmkisan.gov.in).
          </p>
        </div>
      </div>

      {/* Civic Disclaimer Card */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-3">
        <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider">{viewT(language, 'disclaimer')}</h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          {viewT(language, 'disclaimerText')}
        </p>
      </div>
    </div>
  );
};
