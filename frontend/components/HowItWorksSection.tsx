import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { viewT } from '../i18n/viewTranslations';
import {
  UserCheck,
  FileCheck2,
  Cpu,
  Bot,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Search,
  Languages,
} from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const { language } = useLanguage();

  const steps = [
    {
      step: '01',
      title: 'Citizen Profile & Discovery',
      description: 'Citizens provide minimal demographic details (age, state, income, student/farmer status) or search in any of 8 Indian languages.',
      icon: UserCheck,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      step: '02',
      title: 'Official Gazette Ingestion',
      description: 'SchemeSahay ingests verified Ministry operational guidelines and gazette notifications, parsed with version numbers and page tracking.',
      icon: FileCheck2,
      color: 'from-amber-500 to-orange-600',
    },
    {
      step: '03',
      title: 'Deterministic Rule Engine',
      description: 'Our eligibility algorithm evaluates each official criterion separately. Missing data returns UNKNOWN rather than guessing or hallucinating.',
      icon: Cpu,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      step: '04',
      title: 'AI Assistant: Empathetic Voice & Chat',
      description: 'Asha explains complex bureaucratic guidelines in simple, warm, and comforting language with direct source citations and page numbers.',
      icon: Bot,
      color: 'from-purple-500 to-pink-600',
    },
    {
      step: '05',
      title: 'Direct Official Portal Redirection',
      description: 'Clear step-by-step document checklists and direct redirection to verified government portals (NSP, PM-KISAN, Jnanabhumi) for actual submission.',
      icon: ExternalLink,
      color: 'from-emerald-600 to-green-700',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{viewT(language, 'transparent')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {viewT(language, 'howTitle')}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
          {viewT(language, 'howSub')}
        </p>
      </div>

      {/* 5-Step Process Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-md`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black text-slate-300 group-hover:text-amber-500 transition-colors">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                <span>{viewT(language, 'verifiedStep')}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Architecture Comparison Card: Traditional vs SchemeSahay */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl">
        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white mb-6 text-center">
          {viewT(language, 'compareTitle')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional Way */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs sm:text-sm space-y-3">
            <div className="text-rose-400 font-bold text-sm uppercase tracking-wider flex items-center gap-1.5">
              <span>✕</span> {viewT(language, 'traditional')}
            </div>
            <ul className="space-y-2.5 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>Scattered across 50+ central & state ministry websites with broken links.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>100-page bureaucratic PDF circulars filled with complex legal jargon.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>No automated checking of family income ceilings or category exclusions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>Language barriers prevent rural citizens from accessing central schemes.</span>
              </li>
            </ul>
          </div>

          {/* SchemeSahay Way */}
          <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-800 text-xs sm:text-sm space-y-3">
            <div className="text-emerald-400 font-bold text-sm uppercase tracking-wider flex items-center gap-1.5">
              <span>✓</span> {viewT(language, 'schemeWay')}
            </div>
            <ul className="space-y-2.5 text-slate-200">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Unified repository with source documents, versioning, and verified timestamps.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Deterministic rule engine verifies age, state, and income with clear citations.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>The AI Assistant speaks in 8 Indian languages with warmth and empathetic clarity.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Pre-filled document checklists and direct redirection to official application portals.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
