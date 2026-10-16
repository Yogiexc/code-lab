// =============================================================================
// Nokia 3310 Monophonic Audio Synthesizer (Pure Web Audio API Oscillator)
// Generates authentic 8-bit square-wave sound effects without external audio files
// =============================================================================

class NokiaSoundEngine {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = true;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
  }

  playTone(freq, durationMs, type = 'square') {
    if (!this.soundEnabled) return;
    try {
      this.init();
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + (durationMs / 1000));

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + (durationMs / 1000));
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  // Sound FX
  beep() { this.playTone(880, 50); }
  eatFood() { this.playTone(1320, 80); }
  laser() { this.playTone(550, 60); }
  bounce() { this.playTone(440, 70); }
  hit() { this.playTone(180, 120); }

  // Legendary Nokia Tune (Gran Vals by Francisco Tárrega)
  playNokiaTune() {
    const melody = [
      { f: 1318.51, d: 140 }, // E6
      { f: 1174.66, d: 140 }, // D6
      { f: 739.99,  d: 280 }, // F#5
      { f: 830.61,  d: 280 }, // G#5
      { f: 1108.73, d: 140 }, // C#6
      { f: 987.77,  d: 140 }, // B5
      { f: 587.33,  d: 280 }, // D5
      { f: 659.25,  d: 280 }, // E5
      { f: 987.77,  d: 140 }, // B5
      { f: 880.00,  d: 140 }, // A5
      { f: 554.37,  d: 280 }, // C#5
      { f: 659.25,  d: 280 }, // E5
      { f: 880.00,  d: 560 }  // A5
    ];

    let timeOffset = 0;
    melody.forEach((note) => {
      setTimeout(() => {
        this.playTone(note.f, note.d * 0.9, 'square');
      }, timeOffset);
      timeOffset += note.d * 1.15;
    });
  }
}

window.nokiaAudio = new NokiaSoundEngine();
