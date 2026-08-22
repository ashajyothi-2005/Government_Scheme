import React from 'react';
import { GovernmentScheme, EligibilityResult } from '../../shared/types';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import {
  X,
  CheckCircle,
  HelpCircle,
  XCircle,
  Sparkles,
  Bot,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  ArrowRight,
} from 'lucide-react';

interface EligibilityCheckerModalProps {
  scheme: GovernmentScheme;
  result: EligibilityResult;
  onClose: () => void;
  onOpenProfile: () => void;
}

export const EligibilityCheckerModal: React.FC<EligibilityCheckerModalProps> = ({
  scheme,
  result,
  onClose,
  onOpenProfile,
}) => {
  const { setIsAssistantOpen } = useApp();
  const { language, t } = useLanguage();

  const localizedName = scheme.nameTranslations?.[language] || scheme.name;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2 pr-10">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-amber-400 px-2.5 py-1 rounded-md border border-slate-700">
              Rule-Based Civic Evaluation
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
            Eligibility Summary
          </h2>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">{localizedName}</p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-sm">
          {/* Status Result Card */}
          <div
            className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              result.overallStatus === 'LIKELY_ELIGIBLE'
                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                : result.overallStatus === 'MORE_INFO_NEEDED'
                ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                : 'bg-rose-50/80 border-rose-300 text-rose-950'
            }`}
          >
            <div className="flex items-start gap-3">
              {result.overallStatus === 'LIKELY_ELIGIBLE' ? (
                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : result.overallStatus === 'MORE_INFO_NEEDED' ? (
                <HelpCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="text-sm font-extrabold tracking-tight">
                  {result.overallStatus === 'LIKELY_ELIGIBLE'
                    ? '🟢 ' + t('likely_eligible')
                    : result.overallStatus === 'MORE_INFO_NEEDED'
                    ? '🟡 ' + t('more_info_needed')
                    : '🔴 ' + t('likely_not_eligible')}
                </div>
                <p className="text-xs mt-1 leading-relaxed">{result.summaryMessage}</p>
              </div>
            </div>

            <div className="bg-white px-4 py-2 rounded-xl shadow-xs border border-slate-200/80 text-center shrink-0 self-end sm:self-center">
              <div className="text-[10px] uppercase font-bold text-slate-500">Estimate Match</div>
              <div className="text-xl font-black text-slate-900">{result.matchScore}%</div>
            </div>
          </div>

          {/* Legal Civic Disclaimer */}
          <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              <strong>Civic Disclaimer:</strong> {t('disclaimer_match')} Final verification rests with the administering Ministry and competent state authorities.
            </span>
          </div>

          {/* Itemized Criteria List */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">Itemized Guideline Evaluation</h3>
            <div className="space-y-3">
              {result.evaluations.map((evalItem) => (
                <div
                  key={evalItem.criterionId}
                  className={`p-4 rounded-xl border transition-all ${
                    evalItem.status === 'PASS'
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : evalItem.status === 'UNKNOWN'
                      ? 'bg-amber-50/40 border-amber-200'
                      : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      {evalItem.status === 'PASS' ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : evalItem.status === 'UNKNOWN' ? (
                        <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          {evalItem.label}
                        </h4>
                        <p className="text-xs text-slate-700 mt-1 leading-relaxed">{evalItem.reason}</p>
                      </div>
                    </div>

                    <div className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 whitespace-nowrap bg-white border border-slate-200 shadow-2xs">
                      {evalItem.status}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      Source: <strong className="text-slate-700">{evalItem.sourceDocTitle}</strong> (Page {evalItem.sourcePageNumber})
                    </span>
                    <span className="text-slate-400">Verified Rule</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Missing fields notice */}
          {result.missingFields.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
              <div>
                <strong className="block font-semibold">Incomplete Information in Profile:</strong>
                <span>We need details on {result.missingFields.join(', ')} to provide a 100% complete evaluation.</span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenProfile();
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs shrink-0 transition-colors ml-3"
              >
                Update Profile
              </button>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              setIsAssistantOpen(true);
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-amber-600 bg-white px-3.5 py-2 rounded-xl border border-slate-300 shadow-xs transition-colors"
          >
            <Bot className="w-4 h-4 text-amber-500" />
            <span>Ask the AI Assistant Why I Qualify</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 border border-slate-300 transition-colors"
            >
              Close
            </button>
            <a
              href={scheme.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>{t('apply_official')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
