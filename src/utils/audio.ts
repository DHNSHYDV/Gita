// Audio Player for Gita Shlokas using Web Speech API + Sacred Temple Bell Chime
class SacredAudioPlayer {
  private isPlaying: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private audioCtx: AudioContext | null = null;
  private onStateChange: ((playing: boolean) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        // Voices loaded
      };
    }
  }

  public setListener(listener: (playing: boolean) => void) {
    this.onStateChange = listener;
  }

  private playBellChime() {
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;
      
      const ctx = new AudioCtxClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // Soothing bell resonant frequency (C# 554 Hz)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(554.37, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(277.18, ctx.currentTime + 1.2);
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch {
      // Audio context may be restricted before user gesture
    }
  }

  public playPageTurn(): void {
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;
      const ctx = new AudioCtxClass();
      const bufferSize = Math.floor(ctx.sampleRate * 0.07);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1400;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.07);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch {
      // Ignore
    }
  }

  public playShloka(text: string, langCode: string = 'sa-IN'): void {
    this.stop();
    this.playBellChime();

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    // Short delay after sacred chime to start recitation
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85; // Slow, respectful chanting cadence
      utterance.pitch = 0.95; // Warm, resonant tone

      // Pick best matching voice
      const voices = window.speechSynthesis.getVoices();
      let voice = voices.find(v => v.lang.startsWith(langCode) || v.lang.startsWith('hi') || v.lang.startsWith('te'));
      if (!voice) {
        voice = voices.find(v => v.lang.includes('IN') || v.lang.startsWith('en'));
      }
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => {
        this.isPlaying = true;
        if (this.onStateChange) this.onStateChange(true);
      };

      utterance.onend = () => {
        this.isPlaying = false;
        if (this.onStateChange) this.onStateChange(false);
      };

      utterance.onerror = () => {
        this.isPlaying = false;
        if (this.onStateChange) this.onStateChange(false);
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    }, 400);
  }

  public stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isPlaying = false;
    if (this.onStateChange) this.onStateChange(false);
  }

  public toggle(text: string, langCode?: string): void {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.playShloka(text, langCode);
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const audioPlayer = new SacredAudioPlayer();
