import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import { useLanguage } from './i18n/LanguageContext';
import { api } from './services/api';
import { GovernmentScheme, EligibilityResult } from '../shared/types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryGrid } from './components/CategoryGrid';
import { SchemeCard } from './components/SchemeCard';
import { SchemeDetailModal } from './components/SchemeDetailModal';
import { EligibilityCheckerModal } from './components/EligibilityCheckerModal';
import { ProfileWizardModal } from './components/ProfileWizardModal';
import { AshaAssistantPanel } from './components/AshaAssistantPanel';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { RecommendationsView } from './components/RecommendationsView';
import { SavedSchemesView } from './components/SavedSchemesView';
import { HowItWorksSection } from './components/HowItWorksSection';
import { DataSourcesView } from './components/DataSourcesView';
import { AdminPortalView } from './components/AdminPortalView';
import { AboutView } from './components/AboutView';
import { Footer } from './components/Footer';
import { AuthGate } from './components/AuthGate';
import { HistorySidebar } from './components/HistorySidebar';
import { APP_CONFIG } from './config';
import {
  Sparkles,
  Bot,
  MapPin,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';

export function AppContent() {
  const {
    activeTab,
    setActiveTab,
    selectedCategory,
    setSelectedCategory,
    selectedState,
    setSelectedState,
    searchQuery,
    setSearchQuery,
    selectedScheme,
    setSelectedScheme,
    isEligibilityModalOpen,
    setIsEligibilityModalOpen,
    isProfileWizardOpen,
    setIsProfileWizardOpen,
    isVoiceModalOpen,
    setIsVoiceModalOpen,
    isAssistantOpen,
    setIsAssistantOpen,
    userProfile,
    authUser,
  } = useApp();

  const { t } = useLanguage();

  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [levelFilter, setLevelFilter] = useState<'all' | 'CENTRAL' | 'STATE'>('all');
  const [activeSources, setActiveSources] = useState<any[]>([]);
  const [evaluatedResult, setEvaluatedResult] = useState<EligibilityResult | null>(null);
  const [eligibilityError, setEligibilityError] = useState('');

  // Fetch schemes based on current filters
  useEffect(() => {
    async function loadSchemes() {
      setLoading(true);
      try {
        const res: any = await api.getSchemes({
          category: selectedCategory,
          state: selectedState,
          search: searchQuery,
        });

        let list: GovernmentScheme[] = res.schemes || [];
        if (levelFilter !== 'all') {
          list = list.filter((s: GovernmentScheme) => s.level === levelFilter);
        }
        setSchemes(list);
      } catch (err) {
        console.error('Failed to load schemes:', err);
      } finally {
        setLoading(false);
      }
    }

    if (activeTab === 'explore') {
      loadSchemes();
    }
  }, [selectedCategory, selectedState, searchQuery, levelFilter, activeTab]);

  // Compute scheme counts per category
  const schemeCounts: Record<string, number> = {};
  schemes.forEach((s: GovernmentScheme) => {
    schemeCounts[s.category] = (schemeCounts[s.category] || 0) + 1;
  });

  const handleOpenDetails = async (scheme: GovernmentScheme) => {
    setSelectedScheme(scheme);
    try {
      const res: any = await api.getSchemeById(scheme.id);
      setActiveSources(res.sources || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCheckEligibility = async (scheme: GovernmentScheme) => {
    setEligibilityError('');
    try {
      const res: any = await api.checkEligibility(scheme.id, userProfile);
      setEvaluatedResult(res.result);
      setSelectedScheme(scheme);
      setIsEligibilityModalOpen(true);
    } catch (e) {
      console.error(e);
      setEligibilityError('Eligibility could not be checked right now. Please try again.');
    }
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedState('All India');
    setSearchQuery('');
    setLevelFilter('all');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedState !== 'All India' ||
    Boolean(searchQuery) ||
    levelFilter !== 'all';

  if (!authUser) return <AuthGate />;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      <Navbar />

      <div className="flex flex-1 min-h-0">
        <HistorySidebar />
        <main className="flex-1 min-w-0">
        {activeTab === 'explore' && (
          <div>
            {/* Hero & Search Banner */}
            <Hero />

            {/* Category Selector Grid */}
            <CategoryGrid schemeCounts={schemeCounts} />

            {/* Schemes Explorer Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {/* Filter Controls Toolbar */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  {/* State Domicile Selector */}
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs">
                    <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="text-slate-500 font-semibold">{t('state')}:</span>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
                    >
                      {APP_CONFIG.indianStates.map((st: string) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Scheme Jurisdiction Filter: Central vs State */}
                  <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
                    <button
                      onClick={() => setLevelFilter('all')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                        levelFilter === 'all'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      All Schemes
                    </button>
                    <button
                      onClick={() => setLevelFilter('CENTRAL')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                        levelFilter === 'CENTRAL'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Central Gov
                    </button>
                    <button
                      onClick={() => setLevelFilter('STATE')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                        levelFilter === 'STATE'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      State Gov
                    </button>
                  </div>
                </div>

                {/* Right Counts & Clear Trigger */}
                <div className="flex items-center justify-between lg:justify-end gap-3 text-xs">
                  <span className="font-bold text-slate-700">
                    Showing <strong className="text-amber-700">{schemes.length}</strong> verified schemes
                  </span>

                  {hasActiveFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="flex items-center gap-1 text-slate-500 hover:text-rose-600 font-semibold transition-colors ml-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{t('clear_all')}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Active Filters Chips */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
                  <span className="text-slate-500 font-semibold">Active filters:</span>
                  {selectedCategory !== 'all' && (
                    <span className="bg-amber-100 text-amber-900 font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
                      <span>Category: {selectedCategory}</span>
                      <button onClick={() => setSelectedCategory('all')}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedState !== 'All India' && (
                    <span className="bg-emerald-100 text-emerald-900 font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
                      <span>State: {selectedState}</span>
                      <button onClick={() => setSelectedState('All India')}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="bg-blue-100 text-blue-900 font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
                      <span>Search: "{searchQuery}"</span>
                      <button onClick={() => setSearchQuery('')}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Schemes Grid */}
              {eligibilityError && (
                <div role="alert" className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800">
                  <span>{eligibilityError}</span>
                  <button onClick={() => setEligibilityError('')} className="font-bold hover:text-rose-950">Dismiss</button>
                </div>
              )}
              {loading ? (
                <div className="py-20 text-center text-slate-500 flex flex-col items-center justify-center">
                  <Sparkles className="w-8 h-8 text-amber-500 animate-spin mb-3" />
                  <p className="text-sm font-semibold">Loading verified government schemes...</p>
                </div>
              ) : schemes.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs max-w-lg mx-auto">
                  <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-800">No matching schemes found</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Try broadening your search query or clear state and category filters.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="mt-5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {schemes.map((scheme: GovernmentScheme) => (
                    <SchemeCard
                      key={scheme.id}
                      scheme={scheme}
                      onOpenDetails={handleOpenDetails}
                      onCheckEligibility={handleCheckEligibility}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <RecommendationsView
            onOpenDetails={handleOpenDetails}
            onCheckEligibility={handleCheckEligibility}
          />
        )}

        {activeTab === 'saved' && (
          <SavedSchemesView
            onOpenDetails={handleOpenDetails}
            onCheckEligibility={handleCheckEligibility}
          />
        )}

        {activeTab === 'how-it-works' && <HowItWorksSection />}

        {activeTab === 'sources' && <DataSourcesView />}

        {activeTab === 'admin' && <AdminPortalView />}

        {activeTab === 'about' && <AboutView />}
        </main>
      </div>

      {/* Floating Bottom-Right Asha AI Trigger */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="group flex items-center gap-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black px-5 py-3.5 rounded-2xl shadow-2xl shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-amber-300/60"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="text-xs uppercase tracking-wider font-extrabold leading-none">AI Assistant</div>
            <div className="text-[11px] font-semibold text-slate-900 mt-0.5">Empathetic Guide • Ask me</div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-950 animate-ping ml-1" />
        </button>
      </div>

      {/* Sliding Asha AI Chat Panel */}
      <AshaAssistantPanel />

      {/* Voice Assistant Modal */}
      {isVoiceModalOpen && (
        <VoiceAssistantModal onClose={() => setIsVoiceModalOpen(false)} />
      )}

      {/* Citizen Profile Builder Wizard Modal */}
      {isProfileWizardOpen && (
        <ProfileWizardModal
          onClose={() => setIsProfileWizardOpen(false)}
          onSaved={() => {
            if (activeTab === 'explore') setActiveTab('recommendations');
          }}
        />
      )}

      {/* Scheme Full Details Modal */}
      {selectedScheme && !isEligibilityModalOpen && (
        <SchemeDetailModal
          scheme={selectedScheme}
          sources={activeSources}
          onClose={() => setSelectedScheme(null)}
          onCheckEligibility={handleCheckEligibility}
        />
      )}

      {/* Interactive Eligibility Checker Modal */}
      {selectedScheme && isEligibilityModalOpen && evaluatedResult && (
        <EligibilityCheckerModal
          scheme={selectedScheme}
          result={evaluatedResult}
          onClose={() => {
            setIsEligibilityModalOpen(false);
            setSelectedScheme(null);
          }}
          onOpenProfile={() => {
            setIsEligibilityModalOpen(false);
            setIsProfileWizardOpen(true);
          }}
        />
      )}

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}