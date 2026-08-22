import React, { FormEvent, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Chrome, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, Sparkles, UserRound, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthGate: React.FC = () => {
  const { signIn } = useApp();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [googleStep, setGoogleStep] = useState<'closed' | 'account' | 'consent' | 'success'>('closed');
  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState('');
  const [anotherAccount, setAnotherAccount] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const completeAuth = (provider: 'google' | 'email', address = email) => {
    signIn({
      name: provider === 'google' ? 'SchemeSahay citizen' : address.split('@')[0] || 'SchemeSahay citizen',
      email: address || 'citizen@schemesahay.local',
      provider,
    });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setAuthError('');
    if (mode === 'forgot') {
      setResetSent(true);
      return;
    }
    if (mode === 'signup') {
      setAccountCreated(true);
      setMode('signin');
      setPassword('');
      return;
    }
    completeAuth('email');
  };

  const switchMode = (nextMode: 'signin' | 'signup' | 'forgot') => {
    setMode(nextMode);
    setAccountCreated(false);
    setResetSent(false);
    setAuthError('');
    setPassword('');
  };

  const handleGoogleContinue = () => {
    setAuthError('');
    setGoogleStep('account');
  };

  const handleGoogleAccount = () => {
    if (!selectedGoogleAccount || !selectedGoogleAccount.includes('@')) return;
    setGoogleStep('consent');
  };

  const handleGoogleConsent = () => {
    setAuthLoading(true);
    window.setTimeout(() => {
      setAuthLoading(false);
      setGoogleStep('success');
      window.setTimeout(() => completeAuth('google', selectedGoogleAccount), 650);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-slate-950 flex items-center justify-center p-5 relative overflow-hidden">
      <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'linear-gradient(#dce7df 1px, transparent 1px), linear-gradient(90deg, #dce7df 1px, transparent 1px)', backgroundSize: '42px 42px' }} />
      <div className="relative w-full max-w-5xl grid lg:grid-cols-[1fr_0.85fr] bg-white border border-slate-200 shadow-[0_24px_80px_rgba(15,23,42,0.14)] rounded-[28px] overflow-hidden">
        <section className="p-8 sm:p-12 bg-[#12352d] text-white relative">
          <div className="absolute right-[-55px] bottom-[-65px] w-64 h-64 rounded-full border-[36px] border-amber-400/20" />
          <div className="flex items-center gap-3 mb-16">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 grid place-items-center text-xl">🇮🇳</div>
            <div><p className="font-black text-lg">Scheme<span className="text-amber-400">Sahay</span></p><p className="text-[10px] uppercase tracking-[0.22em] text-emerald-200">Civic access, made clear</p></div>
          </div>
          <p className="text-amber-300 text-xs font-bold uppercase tracking-[0.18em] mb-4">Your benefits desk</p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.05] max-w-md">Find the support meant for you.</h1>
          <p className="mt-5 text-emerald-100/80 max-w-sm leading-7">Save your profile, return to your AI conversations, and keep verified scheme guidance in one calm place.</p>
          <div className="mt-10 space-y-4 text-sm text-emerald-50">
            {['Personalized scheme recommendations', 'Conversation history across visits', 'Official sources behind every answer'].map((item) => <div key={item} className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-emerald-400/20 grid place-items-center"><Check className="w-3.5 h-3.5 text-amber-300" /></span>{item}</div>)}
          </div>
        </section>

        <section className="p-7 sm:p-12 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-[0.16em] mb-5"><ShieldCheck className="w-4 h-4" /> Secure citizen access</div>
          <h2 className="text-3xl font-black tracking-tight">{mode === 'signin' ? 'Welcome back' : mode === 'signup' ? 'Create your account' : 'Reset your password'}</h2>
          <p className="text-slate-500 text-sm mt-2 mb-7">{mode === 'signin' ? 'Sign in to continue with your saved guidance.' : mode === 'signup' ? 'Register once to use every SchemeSahay AI tool.' : 'Enter your email and we will send reset instructions.'}</p>
          {accountCreated && <div role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-800"><div className="flex items-start gap-3"><span className="w-8 h-8 rounded-full bg-emerald-100 grid place-items-center shrink-0"><Check className="w-4 h-4 text-emerald-700" /></span><div><strong className="block">Account created successfully</strong><span className="block text-xs mt-1">Your account is ready. Sign in with your email and password to continue.</span></div></div><button type="button" onClick={() => document.getElementById('auth-email')?.focus()} className="mt-4 w-full h-10 rounded-lg bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800">Go to sign in</button></div>}
          {resetSent ? <div role="status" className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-4 text-sm text-blue-800"><strong>Reset email requested.</strong><span className="block text-xs mt-1">Check {email || 'your inbox'} for the next step.</span><button onClick={() => switchMode('signin')} className="mt-4 font-bold underline">Return to sign in</button></div> : <>
          {mode !== 'forgot' && <><button onClick={handleGoogleContinue} disabled={authLoading} className="w-full h-12 rounded-xl border border-slate-300 flex items-center justify-center gap-3 font-bold text-sm hover:bg-slate-50 disabled:opacity-60 disabled:cursor-wait transition-colors"><Chrome className="w-4 h-4 text-blue-600" /> {authLoading ? 'Connecting securely...' : 'Continue with Google'} {!authLoading && <ArrowRight className="w-4 h-4 ml-auto mr-3 text-slate-400" />}</button>
          <div className="flex items-center gap-3 my-6 text-[11px] text-slate-400 uppercase tracking-widest"><span className="h-px bg-slate-200 flex-1" /> or use email <span className="h-px bg-slate-200 flex-1" /></div></>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-xs font-bold text-slate-700">Email address<div className="relative mt-1.5"><Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" /><input id="auth-email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="w-full h-11 rounded-xl border border-slate-300 pl-10 pr-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /></div></label>
            {mode !== 'forgot' && <label className="block text-xs font-bold text-slate-700">Password<div className="relative mt-1.5"><LockKeyhole className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" /><input required minLength={6} type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" className="w-full h-11 rounded-xl border border-slate-300 pl-10 pr-10 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-400" title="Show password">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div></label>}
            <button className="w-full h-12 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm transition-colors">{mode === 'signin' ? 'Continue' : mode === 'signup' ? 'Create account' : 'Send reset link'} <ArrowRight className="inline w-4 h-4 ml-1" /></button>
          </form>
          {mode === 'signin' && <button type="button" onClick={() => switchMode('forgot')} className="mt-4 text-xs font-bold text-slate-500 hover:text-emerald-700">Forgot password?</button>}
          {authError && <p role="alert" className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">{authError}</p>}
          <button onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')} className="mt-6 text-sm text-slate-500 hover:text-emerald-700">{mode === 'signin' ? 'New to SchemeSahay? ' : 'Already registered? '}<span className="font-bold text-emerald-700">{mode === 'signin' ? 'Create an account' : 'Sign in'}</span></button>
          </>}
          <p className="mt-8 text-[11px] text-slate-400 flex items-start gap-2"><Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" /> Your account keeps your profile, saved schemes, and assistant history together.</p>
        </section>
      </div>
      {googleStep !== 'closed' && <div className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm flex items-center justify-center p-4"><div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6"><div className="flex items-center gap-2 font-bold text-slate-800"><Chrome className="w-5 h-5 text-blue-600" /> Google</div>{googleStep !== 'success' && <button onClick={() => setGoogleStep('closed')} className="p-2 rounded-lg hover:bg-slate-100" title="Close Google sign in"><X className="w-4 h-4 text-slate-500" /></button>}</div>
        <div className="p-7">
          {googleStep === 'account' && <><p className="text-xs font-bold uppercase tracking-widest text-blue-600">Step 1 of 2</p><h3 className="text-2xl font-black mt-3">Choose an account</h3><p className="text-sm text-slate-500 mt-2">to continue to <strong className="text-slate-700">SchemeSahay</strong></p><div className="mt-6 space-y-2"><button onClick={() => { setSelectedGoogleAccount('citizen@gmail.com'); setAnotherAccount(false); }} className={`w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-colors ${selectedGoogleAccount === 'citizen@gmail.com' && !anotherAccount ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}><span className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 grid place-items-center font-black">C</span><span><span className="block text-sm font-bold">Citizen account</span><span className="block text-xs text-slate-500">citizen@gmail.com</span></span><Check className={`w-4 h-4 ml-auto ${selectedGoogleAccount === 'citizen@gmail.com' && !anotherAccount ? 'text-blue-600' : 'text-transparent'}`} /></button><button onClick={() => { setAnotherAccount(true); setSelectedGoogleAccount(''); }} className={`w-full p-3 rounded-xl border border-dashed text-left flex items-center gap-3 text-sm font-bold text-slate-600 hover:bg-slate-50 ${anotherAccount ? 'border-blue-600 bg-blue-50' : 'border-slate-300'}`}><UserRound className="w-5 h-5 text-slate-400" /> Use another account</button>{anotherAccount && <input autoFocus type="email" value={selectedGoogleAccount} onChange={(event) => setSelectedGoogleAccount(event.target.value)} placeholder="Enter Google account email" className="w-full h-11 rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />}</div><button disabled={!selectedGoogleAccount.includes('@')} onClick={handleGoogleAccount} className="mt-7 w-full h-11 rounded-xl bg-blue-600 text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700">Next <ArrowRight className="inline w-4 h-4 ml-1" /></button></>}
          {googleStep === 'consent' && <><button onClick={() => setGoogleStep('account')} className="text-slate-500 hover:text-slate-900" title="Back"><ArrowLeft className="w-5 h-5" /></button><p className="text-xs font-bold uppercase tracking-widest text-blue-600 mt-5">Step 2 of 2</p><h3 className="text-2xl font-black mt-3">Allow SchemeSahay to continue?</h3><p className="text-sm text-slate-500 mt-2">You are signing in as <strong className="text-slate-700">{selectedGoogleAccount}</strong>.</p><div className="mt-6 rounded-xl bg-slate-50 p-4 space-y-3 text-sm text-slate-700"><div className="flex gap-3"><Check className="w-4 h-4 text-emerald-600 mt-0.5" />Create or access your SchemeSahay profile</div><div className="flex gap-3"><Check className="w-4 h-4 text-emerald-600 mt-0.5" />Save your schemes and AI conversation history</div></div><button onClick={handleGoogleConsent} disabled={authLoading} className="mt-7 w-full h-11 rounded-xl bg-blue-600 text-white font-bold text-sm disabled:opacity-60">{authLoading ? 'Signing you in securely...' : 'Allow and continue'} {!authLoading && <ArrowRight className="inline w-4 h-4 ml-1" />}</button><button onClick={() => setGoogleStep('account')} disabled={authLoading} className="mt-3 w-full h-10 text-sm font-bold text-slate-500 hover:text-slate-900">Cancel</button></>}
          {googleStep === 'success' && <div className="text-center py-6"><div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 grid place-items-center"><Check className="w-8 h-8 text-emerald-600" /></div><h3 className="text-2xl font-black mt-5">You are signed in</h3><p className="text-sm text-slate-500 mt-2">Taking you to your SchemeSahay dashboard...</p><div className="mt-6 h-1.5 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-emerald-500 rounded-full animate-[progress_0.65s_ease-in-out_forwards]" /></div></div>}
        </div>
      </div></div>}
    </div>
  );
};
