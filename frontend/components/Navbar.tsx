import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageCode } from '../i18n/translations';
import {
  Globe,
  User,
  Bookmark,
  Sparkles,
  ShieldCheck,
  Menu,
  X,
  Bell,
  CheckCircle,
} from 'lucide-react';
import { APP_CONFIG } from '../config';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsProfileWizardOpen,
    savedSchemeIds,
    userProfile,
    notifications,
    markNotificationsRead,
  } = useApp();
  const { language, setLanguage, t, languages } = useLanguage();
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const isProfileConfigured = Boolean(userProfile.age || userProfile.occupation);

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      {/* Top Civic Utility Bar */}
      <div className="bg-slate-950 px-4 py-1 border-b border-slate-800/80 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-300 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Official Civic Information Portal
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400">
              National Helpline: <strong className="text-slate-200">{APP_CONFIG.contactHelpline}</strong>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('sources')}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Grounded in Official Sources</span>
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => setActiveTab('admin')}
              className="text-slate-400 hover:text-amber-400 transition-colors"
            >
              {t('admin_portal')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('explore')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-emerald-600 p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <span className="text-xl">🇮🇳</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white">
                  Scheme<span className="text-amber-400">Sahay</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-800">
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block leading-none">
                {t('tagline')}
              </p>
            </div>
          </div>

          {/* Nav Links Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'explore'
                  ? 'bg-slate-800 text-amber-400 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {t('explore_schemes')}
            </button>

            <button
              onClick={() => setActiveTab('recommendations')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'recommendations'
                  ? 'bg-slate-800 text-amber-400 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t('recommended_for_you')}</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'saved'
                  ? 'bg-slate-800 text-amber-400 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Bookmark className="w-4 h-4 text-emerald-400" />
              <span>{t('saved_schemes')}</span>
              {savedSchemeIds.length > 0 && (
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {savedSchemeIds.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('how-it-works')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'how-it-works'
                  ? 'bg-slate-800 text-amber-400 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {t('how_it_works')}
            </button>

            <button
              onClick={() => setActiveTab('sources')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'sources'
                  ? 'bg-slate-800 text-amber-400 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {t('data_sources')}
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'about'
                  ? 'bg-slate-800 text-amber-400 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {t('about_project')}
            </button>
          </nav>

          {/* Right Action Group */}
          <div className="flex items-center gap-2.5">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
                title="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>{languages.find((l) => l.code === language)?.nativeName || 'English'}</span>
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Language / भाषा
                  </div>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code as LanguageCode);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                        language === l.code ? 'text-amber-400 font-bold bg-slate-800/50' : 'text-slate-300'
                      }`}
                    >
                      <span>{l.nativeName}</span>
                      <span className="text-[10px] text-slate-400">{l.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  if (!isNotifOpen) markNotificationsRead();
                }}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors relative"
                title="System Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500"></span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-semibold text-slate-300">
                    <span>Government Updates</span>
                    <span className="text-[10px] text-emerald-400 font-normal">Real-time Verified</span>
                  </div>
                  <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                        <div className="font-medium text-amber-300">{n.title}</div>
                        <p className="text-slate-300 text-[11px] mt-0.5">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Wizard Trigger */}
            <button
              onClick={() => setIsProfileWizardOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isProfileConfigured
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700 hover:bg-emerald-900'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
              title="Citizen Profile"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">
                {isProfileConfigured ? userProfile.name || 'My Profile' : 'Profile'}
              </span>
              {isProfileConfigured && <CheckCircle className="w-3 h-3 text-emerald-400" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 lg:hidden"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-5 space-y-2 text-sm">
          <button
            onClick={() => {
              setActiveTab('explore');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-200"
          >
            {t('explore_schemes')}
          </button>
          <button
            onClick={() => {
              setActiveTab('recommendations');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{t('recommended_for_you')}</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('saved');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-2"
          >
            <Bookmark className="w-4 h-4 text-emerald-400" />
            <span>{t('saved_schemes')}</span>
            <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full ml-auto">
              {savedSchemeIds.length}
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab('how-it-works');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-200"
          >
            {t('how_it_works')}
          </button>
          <button
            onClick={() => {
              setActiveTab('sources');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-200"
          >
            {t('data_sources')}
          </button>
          <button
            onClick={() => {
              setActiveTab('about');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-200"
          >
            {t('about_project')}
          </button>
          <button
            onClick={() => {
              setActiveTab('admin');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-800 text-amber-400 font-semibold"
          >
            {t('admin_portal')}
          </button>
        </div>
      )}
    </header>
  );
};