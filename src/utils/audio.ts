// 8-bit Retro Web Audio Synthesizer Engine for NEKO.EXE
// Session state only, defaults to OFF (no autoplay)

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = true;

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;

    if (enabled) {
      if (!this.ctx) {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtxClass) {
          this.ctx = new AudioCtxClass();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  public playPurr() {
    this.playMeow();
  }

  private getContext(): AudioContext | null {
    if (!this.isEnabled) return null;
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public playTone(freq: number, duration: number = 0.08, type: OscillatorType = 'square', gainVal: number = 0.1) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // AudioContext fallback
    }
  }

  public playTerminalChirp() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.03);
      osc.frequency.setValueAtTime(2200, now + 0.035);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.07);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // AudioContext fallback
    }
  }

  public playGlitch() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300 + Math.random() * 300, now);
      osc.frequency.setValueAtTime(1800, now + 0.02);
      osc.frequency.setValueAtTime(140, now + 0.04);
      osc.frequency.setValueAtTime(2400, now + 0.06);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // AudioContext fallback
    }
  }

  public playKeyClick() {
    this.playTone(800 + Math.random() * 200, 0.03, 'triangle', 0.05);
  }

  public playSelect() {
    this.playTone(523.25, 0.06, 'square', 0.08); // C5
    setTimeout(() => {
      this.playTone(659.25, 0.08, 'square', 0.08); // E5
    }, 60);
  }

  public playCoin() {
    this.playTone(987.77, 0.08, 'square', 0.1); // B5
    setTimeout(() => {
      this.playTone(1318.51, 0.2, 'square', 0.12); // E6
    }, 80);
  }

  public playPowerUp() {
    const notes = [330, 392, 659, 523, 587, 784];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.07, 'square', 0.09);
      }, idx * 45);
    });
  }

  public playBootChime() {
    const ctx = this.getContext();
    if (!ctx) return;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.12, 'square', 0.08);
      }, idx * 70);
    });
  }

  public playFanfare() {
    const melody = [
      { f: 523.25, d: 0.1 },
      { f: 659.25, d: 0.1 },
      { f: 783.99, d: 0.1 },
      { f: 1046.50, d: 0.25 },
      { f: 880.00, d: 0.15 },
      { f: 1046.50, d: 0.4 }
    ];
    let offset = 0;
    melody.forEach((note) => {
      setTimeout(() => {
        this.playTone(note.f, note.d, 'square', 0.1);
      }, offset);
      offset += note.d * 1000 + 40;
    });
  }

  public playEmergencyAccess() {
    const ctx = this.getContext();
    if (!ctx) return;
    const freqs = [440, 880, 440, 880, 660, 1320, 1760];
    freqs.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.06, 'sawtooth', 0.09);
      }, idx * 50);
    });
  }

  public playMeow() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.35);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Audio error catch
    }
  }
}

export const soundEngine = new SoundEngine();
