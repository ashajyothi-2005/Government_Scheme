import React from 'react';
import { GovernmentScheme, EligibilityResult } from '../../shared/types';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import {
  ShieldCheck,
  Bookmark,
  ExternalLink,
  CheckCircle,
  HelpCircle,
  XCircle,
  ChevronRight,
  Sparkles,
  Building2,
} from 'lucide-react';

interface SchemeCardProps {
  scheme: GovernmentScheme;
  eligibilityResult?: EligibilityResult;
  onOpenDetails: (scheme: GovernmentScheme) => void;
  onCheckEligibility: (scheme: GovernmentScheme) => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  scheme,
  eligibilityResult,
  onOpenDetails,
  onCheckEligibility,
}) => {
  const { savedSchemeIds, toggleSaveScheme } = useApp();
  const { language, t } = useLanguage();

  const isSaved = savedSchemeIds.includes(scheme.id);
  const localizedName = scheme.nameTranslations?.[language] || scheme.name;
  const primaryBenefit = scheme.benefits[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      {/* Top Header Card */}
      <div className="p-5">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
              {scheme.level === 'CENTRAL' ? 'Central Scheme' : `${scheme.applicableStates[0]} State`}
            </span>

            <span className="text-[10px] font-semibold flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>v{scheme.activeVersion} • Verified</span>
            </span>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => toggleSaveScheme(scheme.id)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isSaved
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'text-slate-400 hover:text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save scheme'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-emerald-600' : ''}`} />
          </button>
        </div>

        {/* Scheme Title */}
        <h3
          onClick={() => onOpenDetails(scheme)}
          className="text-base sm:text-lg font-bold text-slate-900 leading-snug cursor-pointer group-hover:text-amber-700 transition-colors"
        >
          {localizedName}
        </h3>

        {/* Ministry Authority */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5 font-medium">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="line-clamp-1">{scheme.ministry}</span>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
          {scheme.shortDescription}
        </p>

        {/* Key Highlighted Benefit */}
        {primaryBenefit && (
          <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Key Official Benefit
            </div>
            <div className="text-xs font-semibold text-slate-900 mt-0.5 flex items-center justify-between">
              <span className="line-clamp-1">{primaryBenefit.title}</span>
              {primaryBenefit.amount && (
                <span className="text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.5 rounded text-[11px] ml-2 shrink-0">
                  {primaryBenefit.amount}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Eligibility Result Banner (if evaluated) */}
        {eligibilityResult && (
          <div
            className={`mt-3 p-2.5 rounded-xl border flex items-center justify-between text-xs ${
              eligibilityResult.overallStatus === 'LIKELY_ELIGIBLE'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : eligibilityResult.overallStatus === 'MORE_INFO_NEEDED'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-2">
              {eligibilityResult.overallStatus === 'LIKELY_ELIGIBLE' ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : eligibilityResult.overallStatus === 'MORE_INFO_NEEDED' ? (
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span className="font-semibold text-xs">
                {eligibilityResult.overallStatus === 'LIKELY_ELIGIBLE'
                  ? t('likely_eligible')
                  : eligibilityResult.overallStatus === 'MORE_INFO_NEEDED'
                  ? t('more_info_needed')
                  : t('likely_not_eligible')}
              </span>
            </div>

            <span className="font-bold text-xs bg-white/80 px-2 py-0.5 rounded-full shadow-xs">
              {eligibilityResult.matchScore}% Match
            </span>
          </div>
        )}
      </div>

      {/* Bottom Footer Actions */}
      <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onCheckEligibility(scheme)}
          className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg transition-colors shadow-xs flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>{t('check_eligibility')}</span>
        </button>

        <button
          onClick={() => onOpenDetails(scheme)}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          <span>{t('view_details')}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
