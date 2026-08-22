import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">🇮🇳</span>
              <span className="text-lg font-bold text-white tracking-tight">
                Scheme<span className="text-amber-400">Sahay</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-Powered Indian Government Scheme Discovery, Rule-Based Eligibility Engine & Multilingual Voice Companion.
            </p>
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Grounded in Official Guidelines</span>
            </div>
          </div>

          {/* Quick Platform Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('explore')} className="hover:text-white transition-colors">
                  {t('explore_schemes')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('recommendations')} className="hover:text-white transition-colors">
                  {t('recommended_for_you')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('how-it-works')} className="hover:text-white transition-colors">
                  {t('how_it_works')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('sources')} className="hover:text-white transition-colors">
                  {t('data_sources')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-white transition-colors">
                  {t('about_project')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('admin')} className="text-amber-400 hover:text-amber-300 transition-colors">
                  {t('admin_portal')}
                </button>
              </li>
            </ul>
          </div>

          {/* Official National Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Official Portals</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://myscheme.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  <span>MyScheme National Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://scholarships.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  <span>National Scholarship Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmkisan.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  <span>PM-KISAN Samman Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://nha.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  <span>Ayushman Bharat PM-JAY</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmaymis.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  <span>Pradhan Mantri Awas Yojana</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* National Civic Helplines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Toll-Free Helplines</h4>
            <div className="space-y-2 text-xs">
              <div>
                <span className="block text-slate-500">Citizen Welfare National Helpline:</span>
                <strong className="text-slate-200">1800-11-0031</strong>
              </div>
              <div>
                <span className="block text-slate-500">PM-KISAN Farmer Helpline:</span>
                <strong className="text-slate-200">155261 / 011-24300606</strong>
              </div>
              <div>
                <span className="block text-slate-500">Ayushman Bharat Health Helpline:</span>
                <strong className="text-slate-200">14555</strong>
              </div>
              <div>
                <span className="block text-slate-500">Senior Citizen National Helpline:</span>
                <strong className="text-slate-200">14567</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Civic Disclaimer */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © 2026 SchemeSahay • An independent civic-tech initiative grounded in official government gazettes.
          </p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Powered by Gemini & Verified Civic RAG</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;