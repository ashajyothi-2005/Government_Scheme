import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { api } from '../services/api';
import { GovernmentScheme, EligibilityResult } from '../../shared/types';
import { SchemeCard } from './SchemeCard';
import {
  Sparkles,
  UserCheck,
  RotateCcw,
  SlidersHorizontal,
  CheckCircle2,
  HelpCircle,
  XCircle,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface RecommendationsViewProps {
  onOpenDetails: (scheme: GovernmentScheme) => void;
  onCheckEligibility: (scheme: GovernmentScheme) => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  onOpenDetails,
  onCheckEligibility,
}) => {
  const { userProfile, setIsProfileWizardOpen } = useApp();
  const { t } = useLanguage();

  const [recommendations, setRecommendations] = useState<{ scheme: GovernmentScheme; result: EligibilityResult }[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'eligible' | 'info_needed'>('all');

  useEffect(() => {
    async function fetchRecs() {
      setLoading(true);
      try {
        const res = await api.getRecommendations(userProfile);
        setRecommendations(res.recommendations);
      } catch (e) {
        console.error('Failed to load recommendations:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchRecs();
  }, [userProfile]);

  const isProfileEmpty = !userProfile.age && !userProfile.occupation;

  const filteredRecs = recommendations.filter((item) => {
    if (statusFilter === 'eligible') return item.result.overallStatus === 'LIKELY_ELIGIBLE';
    if (statusFilter === 'info_needed') return item.result.overallStatus === 'MORE_INFO_NEEDED';
    return true;
  });

  const eligibleCount = recommendations.filter((r) => r.result.overallStatus === 'LIKELY_ELIGIBLE').length;
  const moreInfoCount = recommendations.filter((r) => r.result.overallStatus === 'MORE_INFO_NEEDED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Rule Matching Engine</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('recommended_for_you')}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
            {isProfileEmpty
              ? 'Complete your citizen profile to unlock personalized scheme recommendations and instant eligibility evaluations.'
              : `Evaluated ${recommendations.length} central & state schemes against your citizen profile (${userProfile.name || 'Citizen'}, ${userProfile.state}, ${userProfile.occupation || 'Unspecified'}).`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setIsProfileWizardOpen(true)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>{isProfileEmpty ? 'Build Profile' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      {!isProfileEmpty && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => setStatusFilter('all')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-400'
                : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Total Evaluated
            </div>
            <div className="text-2xl font-black mt-0.5">{recommendations.length} Schemes</div>
            <div className="text-[11px] text-slate-400 mt-1">Full Central + State Catalog</div>
          </button>

          <button
            onClick={() => setStatusFilter('eligible')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              statusFilter === 'eligible'
                ? 'bg-emerald-950 text-white border-emerald-800 shadow-md ring-2 ring-emerald-400'
                : 'bg-emerald-50/50 text-emerald-950 border-emerald-200 hover:border-emerald-300'
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Likely Eligible</span>
            </div>
            <div className="text-2xl font-black mt-0.5 text-emerald-600">{eligibleCount} Schemes</div>
            <div className="text-[11px] text-emerald-700 mt-1">All criteria satisfied</div>
          </button>

          <button
            onClick={() => setStatusFilter('info_needed')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              statusFilter === 'info_needed'
                ? 'bg-amber-950 text-white border-amber-800 shadow-md ring-2 ring-amber-400'
                : 'bg-amber-50/50 text-amber-950 border-amber-200 hover:border-amber-300'
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-amber-600 tracking-wider flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>More Info Needed</span>
            </div>
            <div className="text-2xl font-black mt-0.5 text-amber-600">{moreInfoCount} Schemes</div>
            <div className="text-[11px] text-amber-700 mt-1">Provide missing fields to confirm</div>
          </button>
        </div>
      )}

      {/* Scheme Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center">
          <Sparkles className="w-8 h-8 text-amber-500 animate-spin mb-3" />
          <p className="text-sm font-semibold">Running rule evaluation engine...</p>
        </div>
      ) : filteredRecs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs max-w-lg mx-auto">
          <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No schemes match this filter</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try switching the filter to "All Evaluated" or update your profile.
          </p>
          <button
            onClick={() => setStatusFilter('all')}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
          >
            View All Schemes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecs.map(({ scheme, result }) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              eligibilityResult={result}
              onOpenDetails={onOpenDetails}
              onCheckEligibility={onCheckEligibility}
            />
          ))}
        </div>
      )}
    </div>
  );
};
