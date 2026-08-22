import React, { useState } from 'react';
import { GovernmentScheme, SchemeSource } from '../../shared/types';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import {
  X,
  ShieldCheck,
  Building2,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  FileText,
  Clock,
  PhoneCall,
  Bot,
  HelpCircle,
  FileCheck,
  Bookmark,
} from 'lucide-react';

interface SchemeDetailModalProps {
  scheme: GovernmentScheme;
  sources?: SchemeSource[];
  onClose: () => void;
  onCheckEligibility: (scheme: GovernmentScheme) => void;
}

export const SchemeDetailModal: React.FC<SchemeDetailModalProps> = ({
  scheme,
  sources = [],
  onClose,
  onCheckEligibility,
}) => {
  const { savedSchemeIds, toggleSaveScheme, setIsAssistantOpen } = useApp();
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'benefits' | 'eligibility' | 'documents' | 'process' | 'sources'>('benefits');

  const isSaved = savedSchemeIds.includes(scheme.id);
  const localizedName = scheme.nameTranslations?.[language] || scheme.name;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 flex-wrap mb-2.5 pr-10">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
              {scheme.level === 'CENTRAL' ? 'Central Government' : `${scheme.applicableStates.join(', ')} State`}
            </span>
            <span className="text-[10px] font-semibold bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Version {scheme.activeVersion} • Verified on {scheme.lastVerified}</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
            {localizedName}
          </h2>

          <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
            <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{scheme.ministry} ({scheme.department})</span>
          </div>

          {/* Quick Action CTAs inside Header */}
          <div className="mt-5 flex flex-wrap items-center gap-2.5 pt-4 border-t border-slate-800">
            <button
              onClick={() => onCheckEligibility(scheme)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{t('check_eligibility')}</span>
            </button>

            <a
              href={scheme.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold px-4 py-2 rounded-xl text-xs border border-slate-700 transition-colors"
            >
              <span>{t('apply_official')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => {
                setIsAssistantOpen(true);
                onClose();
              }}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-3.5 py-2 rounded-xl text-xs border border-slate-700 transition-colors"
            >
              <Bot className="w-3.5 h-3.5 text-amber-400" />
              <span>Ask Asha About This</span>
            </button>

            <button
              onClick={() => toggleSaveScheme(scheme.id)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isSaved
                  ? 'bg-emerald-900/50 border-emerald-700 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-emerald-400 text-emerald-400' : ''}`} />
              <span>{isSaved ? t('saved') : t('save_scheme')}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 px-6 bg-slate-50 flex overflow-x-auto gap-2">
          {[
            { id: 'benefits', label: t('benefits') },
            { id: 'eligibility', label: t('eligibility_criteria') },
            { id: 'documents', label: t('required_docs') },
            { id: 'process', label: t('application_process') },
            { id: 'sources', label: t('official_sources') },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-amber-600 text-amber-700'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-sm leading-relaxed">
          {/* Overview Statement */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Overview</h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{scheme.fullDescription}</p>
          </div>

          {/* TAB 1: Benefits */}
          {activeTab === 'benefits' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">Official Entitlements & Benefits</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {scheme.benefits.map((b, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                        {b.type.replace(/_/g, ' ')}
                      </span>
                      {b.frequency && (
                        <span className="text-[11px] text-slate-500 font-medium">{b.frequency}</span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{b.title}</h4>
                    <p className="text-xs text-slate-600 mt-1">{b.description}</p>
                    {b.amount && (
                      <div className="mt-3 text-xs font-extrabold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                        Entitlement: {b.amount}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Eligibility Criteria */}
          {activeTab === 'eligibility' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Structured Eligibility Criteria</h3>
                <span className="text-xs text-slate-500">Grounded in official gazette guidelines</span>
              </div>

              <div className="space-y-3">
                {scheme.criteria.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{c.label}</h4>
                          <p className="text-xs text-slate-600 mt-1">{c.description}</p>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 whitespace-nowrap shrink-0">
                        Rule: Page {c.sourcePageNumber}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Source: <strong className="text-slate-700">{c.sourceDocTitle}</strong></span>
                      <span className="text-emerald-700 font-semibold">Verified Criterion</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Required Documents */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">Checklist of Required Documents</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {scheme.documentsRequired.map((doc, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-3">
                    <FileCheck className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">{doc.name}</h4>
                        {doc.mandatory ? (
                          <span className="text-[9px] uppercase font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                            Mandatory
                          </span>
                        ) : (
                          <span className="text-[9px] uppercase font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                            Optional
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">{doc.description}</p>
                      <div className="mt-1.5 text-[10px] text-slate-400">
                        Accepted: {doc.acceptableFormats.join(', ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Application Procedure */}
          {activeTab === 'process' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">How to Apply Step-by-Step</h3>
              <div className="space-y-3">
                {scheme.applicationProcess.map((step) => (
                  <div key={step.stepNumber} className="p-4 rounded-xl border border-slate-200 bg-white flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                      {step.stepNumber}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{step.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{step.instruction}</p>
                      {step.onlineUrl && (
                        <a
                          href={step.onlineUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 mt-2 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200"
                        >
                          <span>Go to Online Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Official Sources & Grounding */}
          {activeTab === 'sources' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">Supporting Official Government Documents</h3>
              <div className="space-y-3">
                {sources.map((src) => (
                  <div key={src.documentId} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        Status: {src.status}
                      </span>
                      <span className="text-xs text-slate-500">Version {src.version}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{src.title}</h4>
                    <p className="text-xs text-slate-600 mt-1">{src.summary}</p>

                    <div className="mt-3 pt-2 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600">
                      <div>
                        <span className="text-slate-400 block">Authority:</span>
                        <strong>{src.ministry}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Published:</span>
                        <strong>{src.publicationDate}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Last Verified:</span>
                        <strong className="text-emerald-700">{src.lastVerified}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Verification:</span>
                        <strong>{src.verifiedBy}</strong>
                      </div>
                    </div>

                    <div className="mt-3">
                      <a
                        href={src.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Official PDF Document</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Important Helpline Bar */}
          {scheme.helpline && (
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-amber-900 font-medium">
                <PhoneCall className="w-4 h-4 text-amber-700" />
                <span>Official Scheme Toll-Free Helpline: <strong>{scheme.helpline}</strong></span>
              </div>
              <span className="text-[11px] text-amber-800">Gov of India Support</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Official Source: <strong>{scheme.ministry}</strong>
          </span>

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
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center gap-1"
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
