import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { APP_CONFIG } from '../config';
import {
  GraduationCap,
  Wheat,
  Home,
  Briefcase,
  Users,
  HeartPulse,
  Coins,
  UserCheck,
  Accessibility,
  Baby,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  GraduationCap,
  Wheat,
  Home,
  Briefcase,
  Users,
  HeartPulse,
  Coins,
  UserCheck,
  Accessibility,
  Baby,
};

export const CategoryGrid: React.FC<{ schemeCounts?: Record<string, number> }> = ({ schemeCounts = {} }) => {
  const { selectedCategory, setSelectedCategory } = useApp();
  const { t } = useLanguage();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {t('categories_title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explore government welfare initiatives by domain
          </p>
        </div>

        {selectedCategory !== 'all' && (
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
          >
            Show All Categories
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
        {APP_CONFIG.categories.map((cat) => {
          const IconComponent = ICON_MAP[cat.icon] || GraduationCap;
          const isSelected = selectedCategory === cat.id;
          const count = schemeCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
              className={`p-4 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between group ${
                isSelected
                  ? 'bg-slate-900 border-slate-900 text-white shadow-lg ring-2 ring-amber-400'
                  : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-slate-800 text-amber-400'
                      : 'bg-slate-100 text-slate-700 group-hover:bg-amber-50 group-hover:text-amber-600'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>

                {count > 0 && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count} {count === 1 ? 'Scheme' : 'Schemes'}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-semibold line-clamp-1">
                  {t(cat.labelKey)}
                </h3>
                <p
                  className={`text-[11px] mt-0.5 line-clamp-1 ${
                    isSelected ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Official Benefits
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
