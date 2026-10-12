import { Language } from '../types';

export interface TTSState {
  isPlaying: boolean;
  isPaused: boolean;
  currentText: string;
  speed: number;
}

type SpeechCallback = (status: 'start' | 'end' | 'error' | 'pause' | 'resume') => void;

class AudioSpeechManager {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private speed: number = 1.0;
  private isSupported: boolean = false;
  private queue: string[] = [];
  private onQueueProgress?: (index: number, total: number) => void;
  private queueIndex: number = 0;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.isSupported = true;
    }
  }

  public checkSupport(): boolean {
    return this.isSupported;
  }

  public setSpeed(newSpeed: number) {
    this.speed = newSpeed;
    if (this.currentUtterance && this.synth?.speaking) {
      // restart current with new rate
      const text = this.currentUtterance.text;
      const lang = this.currentUtterance.lang;
      this.stop();
      this.speak(text, lang as any);
    }
  }

  public getSpeed(): number {
    return this.speed;
  }

  private findBestVoice(lang: string): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return null;

    const langPrefix = lang.toLowerCase().split('-')[0];

    // Priority 1: Exact match
    const exact = voices.find((v) => v.lang.toLowerCase() === lang.toLowerCase());
    if (exact) return exact;

    // Priority 2: Prefix match
    const prefixMatch = voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix));
    if (prefixMatch) return prefixMatch;

    // If Uzbek and no Uzbek voice available, Turkish (tr) provides natural Turkic phonology pronunciation
    if (langPrefix === 'uz') {
      const turkishVoice = voices.find((v) => v.lang.toLowerCase().startsWith('tr'));
      if (turkishVoice) return turkishVoice;
    }

    // Default fallback
    return voices[0] || null;
  }

  public speak(
    text: string,
    language: Language = 'uz',
    onEvent?: SpeechCallback
  ): boolean {
    if (!this.isSupported || !this.synth) {
      onEvent?.('error');
      return false;
    }

    this.stop();

    // Clean math symbols for natural verbalization
    const cleanedText = this.prepareTextForSpeech(text, language);

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.rate = this.speed;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const langCodeMap: Record<Language, string> = {
      uz: 'uz-UZ',
      en: 'en-US',
      ru: 'ru-RU',
      tr: 'tr-TR',
      ar: 'ar-SA',
      fr: 'fr-FR',
      de: 'de-DE',
      es: 'es-ES',
    };

    const targetLangCode = langCodeMap[language] || 'uz-UZ';
    utterance.lang = targetLangCode;

    const voice = this.findBestVoice(targetLangCode);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      onEvent?.('start');
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      onEvent?.('end');
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      this.currentUtterance = null;
      onEvent?.('error');
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
    return true;
  }

  public playQueue(
    texts: string[],
    language: Language = 'uz',
    onProgress?: (index: number, total: number) => void,
    onComplete?: () => void
  ) {
    this.stop();
    this.queue = texts;
    this.queueIndex = 0;
    this.onQueueProgress = onProgress;

    const playNext = () => {
      if (this.queueIndex >= this.queue.length) {
        this.queue = [];
        this.queueIndex = 0;
        onComplete?.();
        return;
      }

      this.onQueueProgress?.(this.queueIndex + 1, this.queue.length);
      const textToPlay = this.queue[this.queueIndex];

      this.speak(textToPlay, language, (status) => {
        if (status === 'end') {
          this.queueIndex += 1;
          // Short natural breathing pause between questions
          setTimeout(playNext, 600);
        } else if (status === 'error') {
          this.queueIndex += 1;
          setTimeout(playNext, 300);
        }
      });
    };

    playNext();
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
    this.queue = [];
  }

  public pause() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public isSpeaking(): boolean {
    return !!this.synth && this.synth.speaking;
  }

  private prepareTextForSpeech(text: string, lang: Language): string {
    let t = text;
    // Replace common math signs with words if in Uzbek
    if (lang === 'uz') {
      t = t
        .replace(/\+/g, ' qo‘shuv ')
        .replace(/-/g, ' ayiruv ')
        .replace(/[×*]/g, ' ko‘paytiruv ')
        .replace(/[:÷]/g, ' bo‘luv ')
        .replace(/=/g, ' teng ')
        .replace(/\^2/g, ' kvadrat ')
        .replace(/\^3/g, ' kub ')
        .replace(/%/g, ' foiz ')
        .replace(/\?/g, ' nechaga teng?')
        .replace(/√(\d+)/g, 'ildiz ostida $1');
    } else if (lang === 'en') {
      t = t
        .replace(/\+/g, ' plus ')
        .replace(/-/g, ' minus ')
        .replace(/[×*]/g, ' multiplied by ')
        .replace(/[:÷]/g, ' divided by ')
        .replace(/=/g, ' equals ')
        .replace(/%/g, ' percent ')
        .replace(/\^2/g, ' squared ')
        .replace(/\^3/g, ' cubed ');
    } else if (lang === 'ru') {
      t = t
        .replace(/\+/g, ' плюс ')
        .replace(/-/g, ' минус ')
        .replace(/[×*]/g, ' умножить на ')
        .replace(/[:÷]/g, ' разделить на ')
        .replace(/=/g, ' равно ')
        .replace(/%/g, ' процентов ')
        .replace(/\^2/g, ' в квадрате ')
        .replace(/\^3/g, ' в кубе ');
    }
    return t;
  }
}

export const speechManager = new AudioSpeechManager();
