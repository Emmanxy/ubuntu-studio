/**
 * Ubuntu Studio Default Procedural Asset Generator & Sound Synthesis Helpers
 * Provides pure JS/Canvas & WebAudio routines embedded into Phaser games
 * so generated games require zero external assets to run smoothly.
 */

export const PROCEDURAL_TEXTURES_CODE = `
// Ubuntu Studio Procedural Texture Utility
export function createGameTextures(scene) {
  // Player Texture (Warrior with shield/spear or runner)
  if (!scene.textures.exists('player')) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    // Body (warm ochre tunic)
    g.fillStyle(0xd97706, 1);
    g.fillRoundedRect(8, 12, 16, 22, 4);
    // Head & Headband
    g.fillStyle(0x78350f, 1);
    g.fillCircle(16, 8, 7);
    g.fillStyle(0xef4444, 1);
    g.fillRect(10, 6, 12, 3);
    // Shield
    g.fillStyle(0xb45309, 1);
    g.fillRoundedRect(22, 14, 6, 16, 3);
    g.lineStyle(1, 0xfef08a, 1);
    g.strokeRoundedRect(22, 14, 6, 16, 3);
    // Staff/Spear
    g.fillStyle(0xfef08a, 1);
    g.fillRect(4, 8, 3, 26);
    g.generateTexture('player', 32, 36);
    g.destroy();
  }

  // Enemy Texture
  if (!scene.textures.exists('enemy')) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xb91c1c, 1);
    g.fillRoundedRect(6, 10, 20, 20, 4);
    g.fillStyle(0x450a0a, 1);
    g.fillCircle(16, 7, 6);
    // Glowing eyes
    g.fillStyle(0xfef08a, 1);
    g.fillCircle(13, 7, 2);
    g.fillCircle(19, 7, 2);
    g.generateTexture('enemy', 32, 32);
    g.destroy();
  }

  // Collectible Artifact / Gold Cowrie Shell
  if (!scene.textures.exists('coin') && !scene.textures.exists('artifact')) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xf59e0b, 1);
    g.fillCircle(12, 12, 10);
    g.fillStyle(0xfef08a, 1);
    g.fillCircle(12, 12, 6);
    g.lineStyle(2, 0xd97706, 1);
    g.strokeCircle(12, 12, 10);
    g.generateTexture('coin', 24, 24);
    g.generateTexture('artifact', 24, 24);
    g.destroy();
  }

  // Platform / Ground Tile
  if (!scene.textures.exists('ground')) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    // Terracotta earth
    g.fillStyle(0x854d0e, 1);
    g.fillRect(0, 0, 64, 32);
    // Grass / savannah top
    g.fillStyle(0x65a30d, 1);
    g.fillRect(0, 0, 64, 6);
    // Texture details
    g.fillStyle(0x713f12, 1);
    g.fillRect(8, 12, 16, 4);
    g.fillRect(40, 20, 14, 4);
    g.generateTexture('ground', 64, 32);
    g.destroy();
  }

  // Particle Star / Sparkle
  if (!scene.textures.exists('sparkle')) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xfef08a, 1);
    g.fillCircle(4, 4, 4);
    g.generateTexture('sparkle', 8, 8);
    g.destroy();
  }
}

// Sound Synthesizer via Web Audio
export const SoundFX = {
  ctx: null,
  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.ctx = new AudioContext();
    }
  },
  play(type = 'jump') {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      if (type === 'jump') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.15);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'coin' || type === 'collect') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'hit' || type === 'hurt') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'attack') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.1);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'win') {
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, i) => {
          const subOsc = this.ctx.createOscillator();
          const subGain = this.ctx.createGain();
          subOsc.type = 'triangle';
          subOsc.frequency.setValueAtTime(freq, now + i * 0.1);
          subGain.gain.setValueAtTime(0.2, now + i * 0.1);
          subGain.gain.exponentialRampToValueAtTime(0.01, now + (i + 1) * 0.15);
          subOsc.connect(subGain);
          subGain.connect(this.ctx.destination);
          subOsc.start(now + i * 0.1);
          subOsc.stop(now + (i + 1) * 0.15);
        });
      }
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }
};
`;
