import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Search, Mic, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setSearchQuery, searchQuery, setIsProfileWizardOpen, setIsVoiceModalOpen, setSelectedCategory } = useApp();
  const { t } = useLanguage();
  const [localInput, setLocalInput] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localInput);
  };

  const handleQuickTagClick = (tag: string, catId?: string) => {
    setLocalInput(tag);
    setSearchQuery(tag);
    if (catId) setSelectedCategory(catId);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white border-b border-slate-800/80 pt-10 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background Subtle Geometric Accents */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Civic Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium mb-6 shadow-inner">
          <span className="text-sm">🇮🇳</span>
          <span className="text-amber-400 font-semibold">{t('badge_hero')}</span>
          <span className="text-slate-500">•</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Source Grounded
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
          {t('hero_title')}
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t('hero_subtitle')}
        </p>

        {/* Action CTAs */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
          <button
            onClick={() => setIsProfileWizardOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/30 transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{t('cta_find_for_me')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Search Box with Voice Button */}
        <div className="mt-9 max-w-3xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center shadow-2xl rounded-2xl">
            <div className="absolute left-4.5 text-slate-400 pointer-events-none">
              <Search className="w-5 h-5" />
            </div>

            <input
              type="text"
              value={localInput}
              onChange={(e) => setLocalInput(e.target.value)}
              placeholder={t('search_placeholder')}
              className="w-full bg-slate-800/90 border border-slate-700 text-white placeholder-slate-400 text-sm sm:text-base rounded-2xl py-4 pl-12 pr-28 focus:outline-none focus:ring-2 focus:ring-amber-400/80 focus:border-amber-400 transition-all shadow-inner"
            />

            <div className="absolute right-2.5 flex items-center gap-1.5">
              {/* Voice Search Button */}
              <button
                type="button"
                onClick={() => setIsVoiceModalOpen(true)}
                className="p-2.5 rounded-xl bg-slate-700/80 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition-colors"
                title={t('voice_search')}
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Submit Search Button */}
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-colors"
              >
                {t('search_btn')}
              </button>
            </div>
          </form>

          {/* Quick Filter Tags */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="font-medium text-slate-500">Popular:</span>
            <button
              onClick={() => handleQuickTagClick('Post-Matric Scholarship', 'education')}
              className="bg-slate-800/60 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-lg border border-slate-700 transition-colors"
            >
              🎓 College Scholarship
            </button>
            <button
              onClick={() => handleQuickTagClick('PM-KISAN', 'agriculture')}
              className="bg-slate-800/60 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-lg border border-slate-700 transition-colors"
            >
              🌾 ₹6,000 Farmer DBT
            </button>
            <button
              onClick={() => handleQuickTagClick('Ayushman Card', 'healthcare')}
              className="bg-slate-800/60 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-lg border border-slate-700 transition-colors"
            >
              🏥 ₹5 Lakh Health Cover
            </button>
            <button
              onClick={() => handleQuickTagClick('PMAY Housing', 'housing')}
              className="bg-slate-800/60 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-lg border border-slate-700 transition-colors"
            >
              🏠 Housing Subsidy
            </button>
            <button
              onClick={() => handleQuickTagClick('PMMVY Maternity', 'women')}
              className="bg-slate-800/60 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-lg border border-slate-700 transition-colors"
            >
              👩 Maternity Incentive
            </button>
          </div>
        </div>

        {/* 3 Key Trust Pillars */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="flex items-start gap-2.5 p-2 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-slate-200">Official Portal Verification</div>
              <div className="text-[11px] text-slate-400">Direct links to official .gov.in application portals</div>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-2 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-slate-200">Itemized Eligibility</div>
              <div className="text-[11px] text-slate-400">Know exactly why you qualify with cited guideline rules</div>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-2 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-slate-200">8 Indian Languages</div>
              <div className="text-[11px] text-slate-400">Ask and listen in Hindi, Telugu, Tamil, Marathi & more</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};