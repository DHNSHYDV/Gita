// Authentic Audio Engine for Gita Shlokas:
// 1. Pristine Sanskrit Chanting (Authentic recorded Vedic Temple Audio for all 701 verses)
// 2. Regional Accent Speech Engine (Native Telugu, Hindi, Tamil, Kannada, and Indian English enunciation)

class SacredAudioPlayer {
  private isPlaying: boolean = false;
  private currentMode: 'chant' | 'speech' | null = null;
  private audioEl: HTMLAudioElement | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private onStateChange: ((playing: boolean, mode: 'chant' | 'speech' | null) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioEl = new Audio();
      this.audioEl.preload = 'auto';

      this.audioEl.onplay = () => {
        this.isPlaying = true;
        this.currentMode = 'chant';
        this.notifyState();
      };

      this.audioEl.onended = () => {
        this.stop();
      };

      this.audioEl.onerror = () => {
        // If MP3 fails (e.g. offline), stop gracefully
        this.stop();
      };

      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
          // Voices preloaded
        };
      }
    }
  }

  public setListener(listener: (playing: boolean, mode: 'chant' | 'speech' | null) => void) {
    this.onStateChange = listener;
  }

  private notifyState() {
    if (this.onStateChange) {
      this.onStateChange(this.isPlaying, this.currentMode);
    }
  }

  // Tactile page turn audio (soothing paper rustle, no electronic beep)
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
  public playAuthenticChant(chapterNumber: number, verseNumber: number): void {
    this.stop();

    const audioUrl = `https://raw.githubusercontent.com/nikhilsi/gitavani/main/android/GitaVani/app/src/main/assets/audio/BG${chapterNumber}.${verseNumber}.mp3`;

    if (!this.audioEl) {
      this.audioEl = new Audio();
    }

    this.audioEl.src = audioUrl;
    this.audioEl
      .play()
      .then(() => {
        this.isPlaying = true;
        this.currentMode = 'chant';
        this.notifyState();
      })
      .catch(() => {
        this.stop();
      });
  }

  // 2. Play Regional Accent Speech for Translations & Meanings
  public playRegionalSpeech(text: string, language: string): void {
    this.stop();

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    // Clean text of verse numbers and special symbols
    const cleanText = text
      .replace(/[0-9]+\.[0-9]+/g, '')
      .replace(/[|।॥✦🕉️]/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.88; // Reverent, clear, contemplative tempo
    utterance.pitch = 1.0;

    // Map language to regional BCP-47 locale
    const localeMap: Record<string, string> = {
      te: 'te-IN', // Telugu (India)
      hi: 'hi-IN', // Hindi (India)
      ta: 'ta-IN', // Tamil (India)
      kn: 'kn-IN', // Kannada (India)
      en: 'en-IN', // Indian English
    };

    const targetLocale = localeMap[language] || 'hi-IN';
    utterance.lang = targetLocale;

    // Pick best regional voice if available
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
  }

  // Stop any currently playing chant or speech
  public stop(): void {
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isPlaying = false;
    this.currentMode = null;
    this.notifyState();
  }

  // Smart Toggle: Plays authentic chant or stops
  public toggleChant(chapterNumber: number, verseNumber: number): void {
    if (this.isPlaying && this.currentMode === 'chant') {
      this.stop();
    } else {
      this.playAuthenticChant(chapterNumber, verseNumber);
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

  public getMode(): 'chant' | 'speech' | null {
    return this.currentMode;
  }
}

export const audioPlayer = new SacredAudioPlayer();
