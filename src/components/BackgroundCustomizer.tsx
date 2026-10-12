import React, { useRef } from 'react';
import {
  Image,
  Upload,
  Trash2,
  Sliders,
  Sparkles,
  Eye,
  X,
  RotateCcw,
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface BackgroundCustomizerProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  customImage: string | null;
  onImageChange: (image: string | null) => void;
  dimLevel: number;
  onDimChange: (val: number) => void;
  blurLevel: number;
  onBlurChange: (val: number) => void;
  enableStars: boolean;
  onToggleStars: (val: boolean) => void;
}

export const BackgroundCustomizer: React.FC<BackgroundCustomizerProps> = ({
  language,
  isOpen,
  onClose,
  customImage,
  onImageChange,
  dimLevel,
  onDimChange,
  blurLevel,
  onBlurChange,
  enableStars,
  onToggleStars,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.uz;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Iltimos, rasm formatidagi fayl tanlang (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onImageChange(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    onImageChange(null);
    onDimChange(0.5);
    onBlurChange(0);
    onToggleStars(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-slate-900/95 shadow-2xl p-6 text-slate-100">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
              <Sliders className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-white text-base">
              {t.bgCustomizer}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 text-sm">
          {/* File Upload Section */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {t.uploadCustomBg}
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:brightness-110 transition cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                <span>Rasm tanlash</span>
              </button>

              {customImage && (
                <button
                  type="button"
                  onClick={() => onImageChange(null)}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-red-500/20 border border-red-500/30 px-3.5 py-2.5 text-xs font-semibold text-red-300 hover:bg-red-500/30 transition cursor-pointer"
                  title="Rasmni olib tashlash"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Preview Thumbnail if custom image present */}
          {customImage && (
            <div className="relative h-28 w-full overflow-hidden rounded-2xl border border-white/20">
              <img
                src={customImage}
                alt="Custom background preview"
                className="h-full w-full object-cover"
                style={{ filter: `blur(${blurLevel}px)` }}
              />
              <div
                className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: `rgba(7, 11, 28, ${dimLevel})` }}
              >
                <span>Matnning o‘qilishi ko‘rinishi</span>
              </div>
            </div>
          )}

          {/* Dim Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>{t.dimOverlay}</span>
              <span className="font-mono text-indigo-400">{Math.round(dimLevel * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="0.9"
              step="0.05"
              value={dimLevel}
              onChange={(e) => onDimChange(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Matn har qanday rasm ustida aniq va chiroyli ko‘rinishi uchun qoraytirish darajasi.
            </p>
          </div>

          {/* Blur Slider */}
          {customImage && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>{t.blurOverlay}</span>
                <span className="font-mono text-indigo-400">{blurLevel}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="16"
                step="1"
                value={blurLevel}
                onChange={(e) => onBlurChange(parseInt(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          )}

          {/* Stars over image toggle */}
          <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <div>
                <p className="text-xs font-semibold text-white">Yulduzlar va kometalar</p>
                <p className="text-[11px] text-slate-400">Yaltiroq yulduzlar animatsiyasi</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={enableStars}
              onChange={(e) => onToggleStars(e.target.checked)}
              className="h-4 w-4 rounded accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Reset button */}
          <div className="pt-2 flex justify-between items-center border-t border-white/10">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Standart tungi osmonga qaytish</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-semibold text-white transition cursor-pointer"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
