// Web Audio API Synthesizer for CrossFit Arena Timer Signals
class TimerAudio {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playBeep(frequency = 440, duration = 0.15, type = 'sine') {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Beep countdown (short 3, 2, 1)
  playCountdownBeep() {
    this.playBeep(520, 0.18, 'sine');
  }

  // Loud GO tone!
  playGoTone() {
    this.playBeep(880, 0.6, 'triangle');
  }

  // Time Cap Horn
  playTimeCapHorn() {
    try {
      this.init();
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';
      osc1.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc2.frequency.setValueAtTime(225, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(this.ctx.currentTime + 1.2);
      osc2.stop(this.ctx.currentTime + 1.2);
    } catch (e) {
      console.warn('Horn error:', e);
    }
  }
}

export const timerAudio = new TimerAudio();
