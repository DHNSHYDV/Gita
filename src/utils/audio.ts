// Authentic Audio Engine for Gita Shlokas:
// 1. Pristine Sanskrit Chanting (Authentic recorded Vedic Temple Audio for all 701 verses)
// 2. Regional Accent Native Android Speech Engine (Native Telugu, Hindi, Tamil, Kannada, and Indian English)

import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Capacitor } from '@capacitor/core';

export type AudioPlayMode = 'chant' | 'speech' | null;

class SacredAudioPlayer {
  private isPlaying: boolean = false;
  private isLoading: boolean = false;
  private currentMode: AudioPlayMode = null;
  private audioEl: HTMLAudioElement | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private onStateChange: ((playing: boolean, mode: AudioPlayMode, loading?: boolean) => void) | null = null;
  private activeAbortController: AbortController | null = null;
  private supportedNativeLangs: string[] | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioElement();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    }
  }

  private initAudioElement(): void {
    if (this.audioEl) {
      try {
        this.audioEl.pause();
        this.audioEl.src = '';
      } catch {
        // Ignore
      }
    }

    this.audioEl = new Audio();
    this.audioEl.preload = 'auto';

    this.audioEl.onplay = () => {
      this.isLoading = false;
      this.isPlaying = true;
      this.currentMode = 'chant';
      this.notifyState();
    };

    this.audioEl.onplaying = () => {
      this.isLoading = false;
      this.isPlaying = true;
      this.notifyState();
    };

    this.audioEl.onwaiting = () => {
      this.isLoading = true;
      this.notifyState();
    };

    this.audioEl.onended = () => {
      this.stop();
    };

    this.audioEl.onerror = () => {
      // Handled in caller
    };
  }

  public setListener(listener: (playing: boolean, mode: AudioPlayMode, loading?: boolean) => void) {
    this.onStateChange = listener;
  }

  private notifyState() {
    if (this.onStateChange) {
      this.onStateChange(this.isPlaying, this.currentMode, this.isLoading);
    }
  }

  // Tactile page turn audio (soothing subtle parchment rustle)
  public playPageTurn(): void {
    try {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;
      const ctx = new AudioCtxClass();
      const bufferSize = Math.floor(ctx.sampleRate * 0.06);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1200;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.025, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch {
      // Ignore
    }
  }

  // 1. Play Authentic Vedic Sanskrit Temple Chanting MP3
  public async playAuthenticChant(chapterNumber: number, verseNumber: number, fallbackSanskritText?: string): Promise<void> {
    this.stop();

    this.isLoading = true;
    this.isPlaying = true;
    this.currentMode = 'chant';
    this.notifyState();

    const cdnUrls = [
      `https://cdn.jsdelivr.net/gh/nikhilsi/gitavani@main/android/GitaVani/app/src/main/assets/audio/BG${chapterNumber}.${verseNumber}.mp3`,
      `https://fastly.jsdelivr.net/gh/nikhilsi/gitavani@main/android/GitaVani/app/src/main/assets/audio/BG${chapterNumber}.${verseNumber}.mp3`,
      `https://gcore.jsdelivr.net/gh/nikhilsi/gitavani@main/android/GitaVani/app/src/main/assets/audio/BG${chapterNumber}.${verseNumber}.mp3`,
    ];

    // Attempt 1: Direct HTML5 streaming from multi-CDN edges
    for (const url of cdnUrls) {
      try {
        if (!this.audioEl) {
          this.initAudioElement();
        }

        if (this.audioEl) {
          this.audioEl.src = url;
          await this.audioEl.play();
          this.isLoading = false;
          this.isPlaying = true;
          this.currentMode = 'chant';
          this.notifyState();
          return;
        }
      } catch (e) {
        console.warn('Direct stream attempt failed for:', url, e);
      }
    }

    // Attempt 2: Fetch as Blob to completely bypass any WebView/browser header restrictions
    for (const url of cdnUrls) {
      try {
        this.activeAbortController = new AbortController();
        const res = await fetch(url, {
          signal: this.activeAbortController.signal,
          cache: 'force-cache',
        });

        if (res.ok) {
          const blob = await res.blob();
          const blobUrl = URL.createObjectURL(blob);
          if (!this.audioEl) this.initAudioElement();

          if (this.audioEl) {
            this.audioEl.src = blobUrl;
            await this.audioEl.play();
            this.isLoading = false;
            this.isPlaying = true;
            this.currentMode = 'chant';
            this.notifyState();
            return;
          }
        }
      } catch (e) {
        console.warn('Blob audio fetch failed for:', url, e);
      }
    }

    // Attempt 3: Offline Sanskrit Recitation using Regional Speech engine
    if (fallbackSanskritText) {
      this.isLoading = false;
      await this.playRegionalSpeech(fallbackSanskritText, 'sa', 0.82);
      return;
    }

    this.stop();
  }

  // Query and cache supported native Android TTS languages
  private async getBestNativeLanguage(preferredLocale: string): Promise<string> {
    try {
      if (!this.supportedNativeLangs) {
        const res = await TextToSpeech.getSupportedLanguages();
        if (res && Array.isArray(res.languages)) {
          this.supportedNativeLangs = res.languages;
        }
      }

      if (this.supportedNativeLangs && this.supportedNativeLangs.length > 0) {
        // Exact match (e.g. "te-IN")
        const exact = this.supportedNativeLangs.find(l => l.toLowerCase() === preferredLocale.toLowerCase());
        if (exact) return exact;

        // Prefix match (e.g. "te")
        const prefix = preferredLocale.slice(0, 2).toLowerCase();
        const langMatch = this.supportedNativeLangs.find(l => l.toLowerCase().startsWith(prefix));
        if (langMatch) return langMatch;

        // Hindi fallback
        const hiMatch = this.supportedNativeLangs.find(l => l.toLowerCase().startsWith('hi'));
        if (hiMatch) return hiMatch;

        // English fallback
        const enMatch = this.supportedNativeLangs.find(l => l.toLowerCase().startsWith('en'));
        if (enMatch) return enMatch;

        // First available language
        return this.supportedNativeLangs[0];
      }
    } catch {
      // Ignore
    }
    return preferredLocale;
  }

  // 2. Play Regional Accent Speech for Translations & Meanings
  public async playRegionalSpeech(text: string, language: string, speechRate: number = 0.88): Promise<void> {
    this.stop();

    // Clean text of verse numbers and special symbols
    const cleanText = text
      .replace(/[0-9]+\.[0-9]+/g, '')
      .replace(/[|।॥✦🕉️]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    // Map language to regional BCP-47 locale
    const localeMap: Record<string, string> = {
      te: 'te-IN', // Telugu (India)
      hi: 'hi-IN', // Hindi (India)
      ta: 'ta-IN', // Tamil (India)
      kn: 'kn-IN', // Kannada (India)
      en: 'en-IN', // Indian English
      sa: 'hi-IN', // Sanskrit enunciation via Hindi
    };

    const targetLocale = localeMap[language] || 'hi-IN';

    this.isPlaying = true;
    this.currentMode = 'speech';
    this.isLoading = false;
    this.notifyState();

    // Strategy 1: Native Android (Capacitor) TextToSpeech Java API
    if (Capacitor.isNativePlatform()) {
      const chosenLang = await this.getBestNativeLanguage(targetLocale);
      
      // Retry up to 3 times in case Android TTS engine is still initializing
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          await TextToSpeech.stop();
          await TextToSpeech.speak({
            text: cleanText,
            lang: chosenLang,
            rate: speechRate,
            pitch: 1.0,
            volume: 1.0,
            category: 'playback',
          });
          this.stop();
          return;
        } catch (nativeErr) {
          console.warn(`Native TTS attempt ${attempt + 1} failed:`, nativeErr);
          await new Promise(r => setTimeout(r, 350));
        }
      }

      // If chosenLang failed, try en-US/default as safe fallback
      try {
        await TextToSpeech.speak({
          text: cleanText,
          lang: 'en-US',
          rate: speechRate,
          pitch: 1.0,
          volume: 1.0,
          category: 'playback',
        });
        this.stop();
        return;
      } catch (fallbackErr) {
        console.warn('Native TTS default fallback failed:', fallbackErr);
      }
    }

    // Strategy 2: Web Speech API (for Browser / Desktop / PWA)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = speechRate;
        utterance.pitch = 1.0;

        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          let bestVoice = voices.find(
            (v) => v.lang === targetLocale || v.lang.replace('_', '-').startsWith(targetLocale)
          );

          if (!bestVoice) {
            bestVoice = voices.find((v) => v.lang.startsWith(targetLocale.slice(0, 2)));
          }
          if (!bestVoice) {
            bestVoice = voices.find((v) => v.lang.includes('IN'));
          }
          if (!bestVoice) {
            bestVoice = voices.find((v) => v.lang.startsWith('en'));
          }
          if (!bestVoice) {
            bestVoice = voices[0];
          }

          if (bestVoice) {
            utterance.voice = bestVoice;
            utterance.lang = bestVoice.lang;
          }
        } else {
          utterance.lang = 'en-US';
        }

        utterance.onstart = () => {
          this.isPlaying = true;
          this.currentMode = 'speech';
          this.notifyState();
        };

        utterance.onend = () => {
          this.stop();
        };

        utterance.onerror = () => {
          this.stop();
        };

        this.currentUtterance = utterance;
        window.speechSynthesis.speak(utterance);
        return;
      } catch (webErr) {
        console.warn('Web Speech API error:', webErr);
      }
    }

    this.stop();
  }

  // Stop any currently playing chant or speech
  public stop(): void {
    if (this.activeAbortController) {
      try {
        this.activeAbortController.abort();
      } catch {
        // Ignore
      }
      this.activeAbortController = null;
    }

    if (this.audioEl) {
      try {
        this.audioEl.pause();
        this.audioEl.currentTime = 0;
      } catch {
        // Ignore
      }
    }

    if (Capacitor.isNativePlatform()) {
      TextToSpeech.stop().catch(() => {});
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }

    this.isPlaying = false;
    this.isLoading = false;
    this.currentMode = null;
    this.notifyState();
  }

  // Smart Toggle: Plays authentic chant or stops
  public toggleChant(chapterNumber: number, verseNumber: number, fallbackSanskritText?: string): void {
    if (this.isPlaying && this.currentMode === 'chant') {
      this.stop();
    } else {
      this.playAuthenticChant(chapterNumber, verseNumber, fallbackSanskritText);
    }
  }

  // Toggle Regional Speech
  public toggleRegionalSpeech(text: string, language: string): void {
    if (this.isPlaying && this.currentMode === 'speech') {
      this.stop();
    } else {
      this.playRegionalSpeech(text, language);
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }

  public isLoadingAudio(): boolean {
    return this.isLoading;
  }

  public getMode(): AudioPlayMode {
    return this.currentMode;
  }
}

export const audioPlayer = new SacredAudioPlayer();
