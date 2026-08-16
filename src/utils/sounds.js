// Web Audio API Synthesized Audio Engine for Kahotbek
// No external mp3 files required - works seamlessly and instantly on any device & browser!

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  // 1. Crisp tactile button click
  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {
      console.warn(e);
    }
  }

  // 2. Select Option Button Tap (Satisfying pop & dynamic feel)
  playSelectAnswer() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      
      // Pop tone 1
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(520, now);
      osc1.frequency.exponentialRampToValueAtTime(980, now + 0.08);

      gain1.gain.setValueAtTime(0.22, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.09);

      // Bubble harmonic
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(800, now + 0.02);
      osc2.frequency.exponentialRampToValueAtTime(1400, now + 0.08);

      gain2.gain.setValueAtTime(0.12, now + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.02);
      osc2.stop(now + 0.09);
    } catch (e) {
      console.warn(e);
    }
  }

  // 3. CORRECT ANSWER - Glorious sparkling celebratory multi-tone chime
  playCorrect() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // C5, E5, G5, C6, E6 (Major uplifting arpeggio with shimmer)
      const chord = [
        { freq: 523.25, time: 0.00, dur: 0.35, gain: 0.22 }, // C5
        { freq: 659.25, time: 0.07, dur: 0.35, gain: 0.24 }, // E5
        { freq: 783.99, time: 0.14, dur: 0.40, gain: 0.26 }, // G5
        { freq: 1046.50, time: 0.21, dur: 0.55, gain: 0.28 }, // C6
        { freq: 1318.51, time: 0.28, dur: 0.70, gain: 0.25 }  // E6
      ];

      chord.forEach(({ freq, time, dur, gain: maxGain }) => {
        const start = now + time;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(maxGain, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + dur);

        // Harmonic shimmer overtone
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.type = 'triangle';
        subOsc.frequency.setValueAtTime(freq * 2, start);

        subGain.gain.setValueAtTime(0.001, start);
        subGain.gain.linearRampToValueAtTime(maxGain * 0.3, start + 0.02);
        subGain.gain.exponentialRampToValueAtTime(0.0001, start + dur * 0.6);

        subOsc.connect(subGain);
        subGain.connect(this.ctx.destination);

        subOsc.start(start);
        subOsc.stop(start + dur * 0.6);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  // 4. WRONG ANSWER - "TU TUT TUUUUUUTTTTTTT" Real Fail Buzzer Synthesizer
  playWrong() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1st burst: "TU" (Short sharp buzzer)
      this._createBuzz(now + 0.00, 0.09, 195, 175, 0.28);

      // 2nd burst: "TUT" (Short sharp buzzer)
      this._createBuzz(now + 0.14, 0.09, 195, 165, 0.28);

      // 3rd burst: "TUUUUUUTTTTTTT" (Longer descending distorted fail sweep with vibrato)
      const start3 = now + 0.28;
      const dur3 = 0.55;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const distortionOsc = this.ctx.createOscillator();
      const distGain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, start3);
      osc.frequency.exponentialRampToValueAtTime(80, start3 + dur3);

      // Vibrato wobble
      distortionOsc.type = 'sawtooth';
      distortionOsc.frequency.setValueAtTime(14, start3);
      distGain.gain.setValueAtTime(15, start3);
      distortionOsc.connect(distGain);
      distGain.connect(osc.frequency);
      distortionOsc.start(start3);
      distortionOsc.stop(start3 + dur3);

      gain.gain.setValueAtTime(0.01, start3);
      gain.gain.linearRampToValueAtTime(0.32, start3 + 0.03);
      gain.gain.setValueAtTime(0.30, start3 + dur3 - 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, start3 + dur3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(start3);
      osc.stop(start3 + dur3);

      // Add low-frequency sub-rumble for impact
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'square';
      subOsc.frequency.setValueAtTime(110, start3);
      subOsc.frequency.exponentialRampToValueAtTime(55, start3 + dur3);

      subGain.gain.setValueAtTime(0.18, start3);
      subGain.gain.exponentialRampToValueAtTime(0.001, start3 + dur3);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);

      subOsc.start(start3);
      subOsc.stop(start3 + dur3);
    } catch (e) {
      console.warn(e);
    }
  }

  // Helper for short buzz
  _createBuzz(start, dur, startFreq, endFreq, vol) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(startFreq, start);
    osc.frequency.exponentialRampToValueAtTime(endFreq, start + dur);

    gain.gain.setValueAtTime(0.01, start);
    gain.gain.linearRampToValueAtTime(vol, start + 0.01);
    gain.gain.setValueAtTime(vol, start + dur - 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(start);
    osc.stop(start + dur);
  }

  // 5. Timer Tick
  playTick(isUrgent = false) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = isUrgent ? 'sawtooth' : 'sine';
      const freq = isUrgent ? 950 : 480;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq / 2, now + 0.035);

      gain.gain.setValueAtTime(isUrgent ? 0.20 : 0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch (e) {
      console.warn(e);
    }
  }

  // 6. Streak / Combo powerup sound
  playStreak() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      notes.forEach((freq, idx) => {
        const start = now + idx * 0.045;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.16, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.25);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  // 7. Floating Emoji Reaction Pop
  playReaction() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.09);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {
      console.warn(e);
    }
  }

  // 8. Start Game Countdown Chime
  playStartGame() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const chords = [392, 523.25, 659.25, 783.99, 1046.5];
      chords.forEach((freq, idx) => {
        const start = now + idx * 0.07;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.22, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.45);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  // 9. Grand Victory Fanfare for Podium
  playFanfare() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const melody = [
        { f: 523.25, t: 0.00, d: 0.14 },
        { f: 523.25, t: 0.15, d: 0.14 },
        { f: 523.25, t: 0.30, d: 0.14 },
        { f: 659.25, t: 0.46, d: 0.32 },
        { f: 783.99, t: 0.80, d: 0.20 },
        { f: 1046.5, t: 1.02, d: 0.70 }
      ];

      melody.forEach(item => {
        const start = now + item.t;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, start);

        gain.gain.setValueAtTime(0.25, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + item.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + item.d);
      });
    } catch (e) {
      console.warn(e);
    }
  }
}

export const soundManager = new SoundEngine();
