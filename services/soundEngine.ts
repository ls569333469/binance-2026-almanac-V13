
/**
 * BINANCE ALMANAC - PROCEDURAL SOUND ENGINE
 * Uses Web Audio API to synthesize UI sounds in real-time.
 * No external assets required.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazy initialization handled in init()
  }

  public init() {
    if (this.ctx) return;
    
    try {
      // @ts-ignore
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.25; // Keep volume subtle
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.error("Web Audio API not supported", e);
    }
  }

  public resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Sound 1: The Trigger (Low frequency swoosh)
   * Represents energy gathering.
   */
  public playTrigger() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    // Low sine wave sweep
    osc.type = 'sine';
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.3);

    // Envelope
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(1, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.5);
  }

  /**
   * Sound 2: The Shimmer (Filtered Noise)
   * Represents the void light scanning.
   */
  public playShimmer() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    // Create noise buffer
    const bufferSize = this.ctx.sampleRate * 0.8; // 0.8 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter to make it sound like "light" or "glass"
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 5;
    filter.frequency.setValueAtTime(1000, t);
    filter.frequency.linearRampToValueAtTime(4000, t + 0.6);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.15, t + 0.2); // Low volume for texture
    gain.gain.linearRampToValueAtTime(0, t + 0.8);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
  }

  /**
   * Sound 3: The Lock (Metallic Click)
   * Represents the date locking into place.
   */
  public playLock() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    // Sharp attack
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.1);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.1);
  }
}

export const soundEngine = new SoundEngine();
