import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Lock,
  ArrowRight,
  User,
  Phone,
  KeyRound,
  ExternalLink,
} from 'lucide-react';
import { Language, UserSession } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface LoginModalProps {
  language: Language;
  onLoginSuccess: (session: UserSession) => void;
  onOpenAdmin: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  language,
  onLoginSuccess,
  onOpenAdmin,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.uz;

  // Step 1: Name & Phone -> Step 2: Access code
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [code, setCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedDemo, setCopiedDemo] = useState(false);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      setErrorMsg(t.nameLabel + ': ' + t.validationError);
      return;
    }
    const cleanDigits = phone.replace(/\D/g, '');
    if (cleanDigits.length < 9) {
      setErrorMsg(t.phoneLabel + ': ' + t.validationError);
      return;
    }
    setErrorMsg(null);
    setStep(2);
  };

  const handleVerifyCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!code.trim()) {
      setErrorMsg(t.enterCodePrompt);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          code: code.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onLoginSuccess({
          name: data.user.name,
          phone: data.user.phone,
          token: data.token,
          codeLabel: data.user.codeLabel,
          isDemo: data.user.isDemo,
        });
      } else {
        setErrorMsg(data.message || t.invalidCodeError);
      }
    } catch (err: any) {
      console.error('Verify code network error:', err);
      // Fallback local check if network interrupted
      if (code.trim() === '07080717') {
        onLoginSuccess({
          name: name.trim(),
          phone: phone.trim(),
          token: 'offline_token_' + Date.now(),
          codeLabel: 'Sinov (Demo) kodi',
          isDemo: true,
        });
      } else {
        setErrorMsg(t.invalidCodeError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemoCode = () => {
    setCode('07080717');
    setCopiedDemo(true);
    setTimeout(() => setCopiedDemo(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-slate-900/90 shadow-2xl shadow-indigo-950/50 backdrop-blur-2xl">
        {/* Glow ambient background accents */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />

        {/* Modal Header */}
        <div className="relative p-6 sm:p-8 pb-4 border-b border-white/10 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/30 text-white">
            <Sparkles className="h-7 w-7 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {t.appName}
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {t.appSubtitle}
          </p>

          {/* Progress Steps Indicator */}
          <div className="mt-5 flex items-center justify-center gap-2">
            <span
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === 1 ? 'w-10 bg-indigo-500' : 'w-4 bg-indigo-500/50'
              }`}
            />
            <span
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === 2 ? 'w-10 bg-indigo-500' : 'w-4 bg-white/20'
              }`}
            />
          </div>
        </div>

        {/* Modal Body */}
        <div className="relative p-6 sm:p-8">
          {errorMsg && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-300 animate-in fade-in">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 1 ? (
            /* STEP 1: Name and Phone Number */
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  1. {t.nameLabel}
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className="w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-400 focus:bg-white/10 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  2. {t.phoneLabel}
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.phonePlaceholder}
                    className="w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-400 focus:bg-white/10 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:shadow-indigo-500/40 hover:brightness-110 active:scale-[0.99] cursor-pointer"
                >
                  <span>3. {t.continueBtn}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </form>
          ) : (
            /* STEP 2: Access Code & Telegram Info */
            <div className="space-y-5">
              <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-xs text-indigo-200">
                <div className="flex items-center gap-2 font-semibold text-indigo-300 text-sm">
                  <ShieldCheck className="h-4 w-4 text-indigo-400" />
                  <span>{name} ({phone})</span>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="mt-1 text-xs text-indigo-400 hover:underline cursor-pointer"
                >
                  Ma’lumotlarni o‘zgartirish
                </button>
              </div>

              {/* Access Code Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  {t.enterCodePrompt}
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <KeyRound className="h-5 w-5 text-indigo-400" />
                  </div>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={t.codePlaceholder}
                    maxLength={16}
                    className="w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 py-3 text-sm font-mono tracking-widest text-white placeholder-slate-500 outline-none transition focus:border-indigo-400 focus:bg-white/10 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Price Notice & Telegram Instructions */}
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                    {t.codePriceNotice}
                  </span>
                  <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[11px] font-bold text-amber-300">
                    Litsenziya
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-slate-300">
                  {t.codeInstruction}
                </p>

                {/* Telegram button linking to https://t.me/ergashexsss7o2 */}
                <a
                  href="https://t.me/ergashexsss7o2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center justify-center gap-2 w-full rounded-xl bg-[#229ED9] hover:bg-[#1f8fc4] py-2.5 px-4 text-xs font-semibold text-white shadow-md transition cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span>{t.telegramBtn} (@ergashexsss7o2)</span>
                  <ExternalLink className="h-3 w-3 opacity-70" />
                </a>
              </div>

              {/* Demo Access Code Box */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>{t.demoCodeNotice}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 mt-2">
                  <div className="rounded-lg bg-black/40 px-3 py-1.5 font-mono text-sm font-bold tracking-wider text-emerald-300 border border-emerald-500/20">
                    07080717
                  </div>
                  <button
                    type="button"
                    onClick={handleFillDemoCode}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition cursor-pointer"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>{copiedDemo ? 'Kiritildi!' : t.useDemoCodeBtn}</span>
                  </button>
                </div>
              </div>

              {/* Verify & Enter Button */}
              <button
                type="button"
                onClick={() => handleVerifyCode()}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-indigo-500/40 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Server tekshirmoqda...</span>
                  </div>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>{t.verifyBtn}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer with Discreet Admin Portal Trigger */}
        <div className="flex items-center justify-between border-t border-white/5 bg-slate-950/40 px-6 py-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            Xavfsiz server aloqasi
          </span>
          <button
            type="button"
            onClick={onOpenAdmin}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition cursor-pointer"
            title="Administrator kirishi"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{t.adminLoginBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
