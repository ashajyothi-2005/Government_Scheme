import React, { useState } from 'react';
import { UserProfile } from '../../shared/types';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { APP_CONFIG } from '../config';
import {
  X,
  User,
  MapPin,
  GraduationCap,
  Briefcase,
  Users,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface ProfileWizardModalProps {
  onClose: () => void;
  onSaved: () => void;
}

export const ProfileWizardModal: React.FC<ProfileWizardModalProps> = ({ onClose, onSaved }) => {
  const { userProfile, setUserProfile, loadDemoProfile, resetProfile } = useApp();
  const { t } = useLanguage();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserProfile>({ ...userProfile });

  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setUserProfile(formData);
    onSaved();
    onClose();
  };

  const handleLoadDemo = () => {
    loadDemoProfile();
    onSaved();
    onClose();
  };

  const handleReset = () => {
    resetProfile();
    setFormData({
      name: '',
      state: 'All India',
      preferredLanguage: 'en',
      interestedCategories: [],
      savedSchemeIds: [],
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 bg-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-between pr-10 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-amber-400 px-2.5 py-0.5 rounded border border-slate-700">
              Step {step} of 4 • Citizen Profile
            </span>

            <button
              onClick={handleLoadDemo}
              className="text-xs text-amber-300 hover:text-amber-200 bg-amber-950/70 border border-amber-800 px-3 py-1 rounded-lg font-semibold flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Demo Profile</span>
            </button>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white">
            {t('profile_builder_title')}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('profile_builder_desc')}
          </p>

          {/* Stepper Progress Bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-800 text-sm">
          {/* STEP 1: Basic Identity & Demographics */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-amber-600" />
                <span>Personal Demographics</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g. Ramesh Kumar / Ananya Sharma"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('age')}</label>
                  <input
                    type="number"
                    min="1"
                    max="110"
                    value={formData.age || ''}
                    onChange={(e) => handleChange('age', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="e.g. 22"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('gender')}</label>
                  <select
                    value={formData.gender || ''}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="transgender">Transgender</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('social_category')}</label>
                <select
                  value={formData.socialCategory || ''}
                  onChange={(e) => handleChange('socialCategory', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                >
                  <option value="">Select Social Category</option>
                  <option value="general">General</option>
                  <option value="obc">OBC (Other Backward Class)</option>
                  <option value="sc">SC (Scheduled Caste)</option>
                  <option value="st">ST (Scheduled Tribe)</option>
                  <option value="ews">EWS (Economically Weaker Section)</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: Location & Residence */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>Location & Domicile</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('state')}</label>
                <select
                  value={formData.state || 'All India'}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                >
                  {APP_CONFIG.indianStates.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Enables state-specific schemes (e.g. AP Jagananna Vidya Deevena, Telangana Rythu Bandhu).
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">District / City</label>
                <input
                  type="text"
                  value={formData.district || ''}
                  onChange={(e) => handleChange('district', e.target.value)}
                  placeholder="e.g. Visakhapatnam, Patna, Pune"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Area of Residence</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'rural', label: 'Rural (Village)' },
                    { id: 'semi_urban', label: 'Semi-Urban (Town)' },
                    { id: 'urban', label: 'Urban (City)' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleChange('ruralUrban', item.id)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-center transition-colors ${
                        formData.ruralUrban === item.id
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Education & Student Status */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-amber-600" />
                <span>Education & Academic Standing</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('education')}</label>
                <select
                  value={formData.educationLevel || ''}
                  onChange={(e) => handleChange('educationLevel', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                >
                  <option value="">Select Highest Education Level</option>
                  <option value="none">No Formal Schooling</option>
                  <option value="primary">Primary School (Class 1-5)</option>
                  <option value="middle">Middle School (Class 6-8)</option>
                  <option value="secondary">Secondary (10th Pass / Matric)</option>
                  <option value="higher_secondary">Higher Secondary (12th Pass)</option>
                  <option value="diploma">Diploma / ITI</option>
                  <option value="undergraduate">Undergraduate (B.Tech, BA, B.Sc, B.Com, MBBS)</option>
                  <option value="postgraduate">Postgraduate (M.Tech, MA, M.Sc, MBA)</option>
                  <option value="doctorate">Doctorate / Ph.D</option>
                </select>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.studentStatus)}
                    onChange={(e) => handleChange('studentStatus', e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Currently Enrolled Full-time / Part-time Student
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Unlocks central and state post-matric scholarships & fee waivers
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* STEP 4: Occupation, Income & Special Status */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-600" />
                <span>Occupation, Income & Special Status</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('occupation')}</label>
                  <select
                    value={formData.occupation || ''}
                    onChange={(e) => handleChange('occupation', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  >
                    <option value="">Select Occupation</option>
                    <option value="student">Student</option>
                    <option value="farmer">Farmer / Agriculturalist</option>
                    <option value="self_employed">Small Business / Self-Employed</option>
                    <option value="artisan">Artisan / Weaver</option>
                    <option value="daily_wage">Daily Wage Laborer</option>
                    <option value="salaried_private">Salaried (Private Sector)</option>
                    <option value="salaried_govt">Salaried (Government / PSU)</option>
                    <option value="homemaker">Homemaker</option>
                    <option value="unemployed">Unemployed / Job Seeker</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('annual_income')} (₹/Year)
                  </label>
                  <input
                    type="number"
                    value={formData.annualIncome || ''}
                    onChange={(e) => handleChange('annualIncome', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="e.g. 200000"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Total annual household income from all sources.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.disabilityStatus)}
                    onChange={(e) => handleChange('disabilityStatus', e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Person with Disability (Divyangjan 40%+)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Unlocks specialized assistive aids, pensions, and reservation quotas
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 border border-slate-300 transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-6 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md hover:scale-105 active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>Save Profile & Match Schemes</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
