import React, { useState } from 'react';
import {
  Sparkles,
  Globe,
  Sliders,
  LogOut,
  User,
  Shield,
  ChevronDown,
  Moon,
  Sun,
} from 'lucide-react';
import { Language, UserSession } from '../types';
import { LANGUAGE_LABELS, TRANSLATIONS } from '../i18n/translations';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  user: UserSession | null;
  onLogout: () => void;
  onOpenBgSettings: () => void;
  onOpenAdmin: () => void;
  isLightMode: boolean;
  onToggleLightMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  user,
  onLogout,
  onOpenBgSettings,
  onOpenAdmin,
  isLightMode,
  onToggleLightMode,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.uz;
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/60 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/30 text-white">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white drop-shadow-sm">
                Savollarni javobi bilan
              </h1>
              <span className="hidden sm:inline-flex rounded-full bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                Ta’lim
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-400">
              Matematika va Algebra platformasi
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Background Customizer Button */}
          <button
            onClick={onOpenBgSettings}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 sm:px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
            title="Orqa fonni sozlash"
          >
            <Sliders className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Orqa fon</span>
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleLightMode}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
            title={isLightMode ? 'Qorong‘i tungi rejim' : 'Yorug‘ rejim'}
          >
            {isLightMode ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-400" />
            )}
          </button>

          {/* Multilingual Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 sm:px-3 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 transition cursor-pointer"
            >
              <span className="text-sm">{LANGUAGE_LABELS[language].flag}</span>
              <span className="hidden sm:inline">{LANGUAGE_LABELS[language].label}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-44 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur-2xl py-1 z-50 animate-in fade-in slide-in-from-top-1"
                onMouseLeave={() => setLangDropdownOpen(false)}
              >
                {(Object.keys(LANGUAGE_LABELS) as Language[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      onLanguageChange(key);
                      setLangDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium transition cursor-pointer ${
                      language === key
                        ? 'bg-indigo-600/30 text-indigo-300 font-bold'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="text-sm">{LANGUAGE_LABELS[key].flag}</span>
                    <span>{LANGUAGE_LABELS[key].label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Badge / Logout */}
          {user ? (
            <div className="flex items-center gap-2 pl-1 border-l border-white/10">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                  {user.name}
                </span>
                <span className="text-[10px] text-emerald-400">
                  {user.isDemo ? 'Demo litsenziya' : 'Tasdiqlangan kirish'}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-300 transition cursor-pointer"
                title={t.logout}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAdmin}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
              title="Admin boshqaruvi"
            >
              <Shield className="h-4 w-4 text-indigo-400" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
