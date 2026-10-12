import React from 'react';
import {
  Volume2,
  Square,
  Play,
  Pause,
  Gauge,
  Sparkles,
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { speechManager } from '../utils/audio';

interface AudioControlsProps {
  language: Language;
  isQueuePlaying: boolean;
  queueProgress: { current: number; total: number };
  onStop: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  language,
  isQueuePlaying,
  queueProgress,
  onStop,
  speed,
  onSpeedChange,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.uz;

  if (!isQueuePlaying) return null;

  return (
    <div className="fixed bottom-6 inset-x-4 max-w-lg mx-auto z-40 animate-in slide-in-from-bottom-5">
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-indigo-500/40 bg-slate-900/95 p-3.5 shadow-2xl shadow-indigo-950/80 backdrop-blur-2xl text-white">
        {/* Playing animation badge */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white animate-pulse">
            <Volume2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{t.listenAll}</span>
              <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] text-indigo-300 font-mono">
                {queueProgress.current} / {queueProgress.total}
              </span>
            </p>
            <p className="text-[10px] text-slate-400">
              Savol va javoblar ketma-ket o‘qilmoqda
            </p>
          </div>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1.5 bg-white/5 rounded-xl p-1 border border-white/5">
          {[0.8, 1.0, 1.25].map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`rounded-lg px-2 py-1 text-[11px] font-bold transition cursor-pointer ${
                speed === s
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Stop Action */}
        <button
          onClick={onStop}
          className="flex items-center gap-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-300 transition cursor-pointer"
        >
          <Square className="h-3.5 w-3.5 fill-current" />
          <span className="hidden sm:inline">{t.stopAudio}</span>
        </button>
      </div>
    </div>
  );
};
