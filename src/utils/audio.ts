// Authentic Audio Engine for Gita Shlokas:
// 1. Pristine Sanskrit Chanting (Authentic recorded Vedic Temple Audio for all 701 verses)
// 2. Regional Accent Native Android Speech Engine (Native Telugu, Hindi, Tamil, Kannada, and Indian English enunciation)

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

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioElement();
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
    this.audioEl.crossOrigin = 'anonymous';

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
      // Audio element error handled in caller
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

    const cdnUrl = `https://cdn.jsdelivr.net/gh/nikhilsi/gitavani@main/android/GitaVani/app/src/main/assets/audio/BG${chapterNumber}.${verseNumber}.mp3`;

    // Attempt 1: Direct HTML5 streaming from Cloudflare/jsDelivr edge
    try {
      if (!this.audioEl) {
        this.initAudioElement();
      }

      if (this.audioEl) {
        this.audioEl.src = cdnUrl;
        await this.audioEl.play();
        this.isLoading = false;
        this.isPlaying = true;
        this.currentMode = 'chant';
        this.notifyState();
        return;
      }
    } catch (e) {
      console.warn('Direct audio stream attempt failed, trying blob stream...', e);
    }

    // Attempt 2: Fetch as Blob to completely bypass any WebView header/CORS restrictions
    try {
      this.activeAbortController = new AbortController();
      const res = await fetch(cdnUrl, {
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
      console.warn('Blob audio fetch failed:', e);
    }

    // Attempt 3: Offline Sanskrit Recitation using Native TTS
    if (fallbackSanskritText) {
      this.isLoading = false;
      await this.playRegionalSpeech(fallbackSanskritText, 'sa', 0.82);
      return;
    }

    this.stop();
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
      sa: 'hi-IN', // Sanskrit enunciation via high-quality Hindi/Sanskrit TTS
    };

    const targetLocale = localeMap[language] || 'hi-IN';

    this.isPlaying = true;
    this.currentMode = 'speech';
    this.isLoading = false;
    this.notifyState();

    // 1. If Native Android (Capacitor), use Native TextToSpeech Java API
    if (Capacitor.isNativePlatform()) {
      try {
        await TextToSpeech.stop();
        await TextToSpeech.speak({
          text: cleanText,
          lang: targetLocale,
          rate: speechRate,
          pitch: 1.0,
          volume: 1.0,
          category: 'playback',
        });
        this.stop();
        return;
      } catch (nativeErr) {
        console.warn('Native TTS error, trying fallback locale:', nativeErr);
        try {
          // If specific locale failed on user's device, try fallback to Hindi/English
          await TextToSpeech.speak({
            text: cleanText,
            lang: 'hi-IN',
            rate: speechRate,
            pitch: 1.0,
            volume: 1.0,
            category: 'playback',
          });
          this.stop();
          return;
        } catch (fallbackErr) {
          console.error('All native TTS attempts failed:', fallbackErr);
        }
      }
    }

    // 2. Fallback to Web Speech API (for Browser / Desktop / PWA)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = speechRate;
        utterance.pitch = 1.0;
        utterance.lang = targetLocale;

        const voices = window.speechSynthesis.getVoices();
        let bestVoice = voices.find(
          (v) => v.lang === targetLocale || v.lang.replace('_', '-').startsWith(targetLocale)
        );

        if (!bestVoice) {
          bestVoice = voices.find((v) => v.lang.startsWith(targetLocale.slice(0, 2)));
        }
        if (!bestVoice) {
          bestVoice = voices.find((v) => v.lang.includes('IN'));
        }

        if (bestVoice) {
          utterance.voice = bestVoice;
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
        console.error('Web Speech API error:', webErr);
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
