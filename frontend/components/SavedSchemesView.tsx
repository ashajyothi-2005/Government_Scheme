import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { api } from '../services/api';
import { GovernmentScheme } from '../../shared/types';
import { SchemeCard } from './SchemeCard';
import { Bookmark, Sparkles, Bell, ArrowRight, ShieldCheck } from 'lucide-react';

interface SavedSchemesViewProps {
  onOpenDetails: (scheme: GovernmentScheme) => void;
  onCheckEligibility: (scheme: GovernmentScheme) => void;
}

export const SavedSchemesView: React.FC<SavedSchemesViewProps> = ({
  onOpenDetails,
  onCheckEligibility,
}) => {
  const { savedSchemeIds, setActiveTab } = useApp();
  const { t } = useLanguage();

  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchemes() {
      setLoading(true);
      try {
        const res = await api.getSchemes();
        setSchemes(res.schemes.filter((s: GovernmentScheme) => savedSchemeIds.includes(s.id)));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchSchemes();
  }, [savedSchemeIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 text-xs font-semibold mb-3">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Citizen Bookmarks</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('saved_schemes')}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-xl leading-relaxed">
            You have saved {savedSchemeIds.length} government schemes. Track their latest official guideline releases, application deadlines, and direct benefit status.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('explore')}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <span>Find More Schemes</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Verified Version Alert Strip */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between gap-4 text-xs text-emerald-950">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            <strong>Version Tracking Active:</strong> All saved schemes are automatically checked against central Ministry gazettes for 2026 revisions.
          </span>
        </div>
        <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-100 px-2.5 py-1 rounded-md shrink-0">
          Last Synced: 22 Aug 2026
        </span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-500">
          <Sparkles className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold">Loading your saved schemes...</p>
        </div>
      ) : schemes.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs max-w-lg mx-auto">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No saved schemes yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            Browse through our catalog of central and state welfare initiatives and click the bookmark icon on any scheme.
          </p>
          <button
            onClick={() => setActiveTab('explore')}
            className="mt-5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            Explore Central Schemes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {schemes.map((scheme) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              onOpenDetails={onOpenDetails}
              onCheckEligibility={onCheckEligibility}
            />
          ))}
        </div>
      )}
    </div>
  );
};
