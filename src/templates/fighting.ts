import { GameTemplate, ProjectFile } from '../types';

export const fightingTemplate: GameTemplate = {
  id: 'fighting',
  name: 'Zulu Stick & Shield Duel',
  type: 'fighting',
  iconName: 'Swords',
  badge: '2D Combat Duel',
  description: 'Fast martial duel where two warriors clash with sticks (Induku) and cowhide shields (Isihlangu), featuring attacks, blocks, stamina, and AI battle logic.',
  samplePrompts: [
    'Create a 2D game where two African warriors compete using shields and sticks.',
    'Add a special spinning shield bash attack.',
    'Make the AI warrior block more frequently when low on health.',
    'Add a 2-player local versus mode on the same keyboard.',
  ],
  culturalInspiration: 'Inspired by traditional Nguni martial stick fighting (Nguni stick-fighting / Intonga), celebrating athletic skill and discipline.',
  defaultSettings: {
    canvasWidth: 800,
    canvasHeight: 450,
    orientation: 'landscape',
    gravityY: 600,
    physicsType: 'arcade',
    debug: false,
    soundEnabled: true,
    musicEnabled: true,
    mobileControls: true,
    fpsLimit: 60,
    difficulty: 'normal',
    backgroundColor: '#1c1917',
    scaleMode: 'FIT',
  },
  createFiles: (projectName: string, title: string): ProjectFile[] => [
    {
      id: 'main-js',
      path: 'src/main.js',
      name: 'main.js',
      language: 'javascript',
      content: `// Ubuntu Studio - Warrior Duel Main Entry
import { BootScene } from './scenes/BootScene.js';
import { ArenaScene } from './scenes/ArenaScene.js';
import { BattleUiScene } from './scenes/BattleUiScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 800,
  height: 450,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 600 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  backgroundColor: '#1c1917',
  scene: [BootScene, ArenaScene, BattleUiScene]
};

window.game = new Phaser.Game(config);
`,
    },
    {
      id: 'boot-scene-js',
      path: 'src/scenes/BootScene.js',
      name: 'BootScene.js',
      language: 'javascript',
      content: `// BootScene: Warrior sprites, shields, arena ground, and effects
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    this.createWarriorTextures();
    this.createArenaTextures();
  }

  create() {
    this.scene.start('ArenaScene');
    this.scene.start('BattleUiScene');
  }

  createWarriorTextures() {
    // Player Warrior (Gold / Ochre)
    const g1 = this.make.graphics({ x: 0, y: 0, add: false });
    // Body & Musculature
    g1.fillStyle(0xb45309, 1);
    g1.fillRoundedRect(10, 16, 20, 30, 4);
    // Head & Headband
    g1.fillStyle(0x78350f, 1);
    g1.fillCircle(20, 10, 9);
    g1.fillStyle(0xf59e0b, 1); // Feather headband
    g1.fillRect(12, 6, 16, 4);
    g1.fillTriangle(18, 0, 22, 0, 20, -8);
    // Isihlangu (Cowhide Shield)
    g1.fillStyle(0xfef08a, 1);
    g1.fillEllipse(32, 28, 10, 24);
    g1.fillStyle(0x78350f, 1);
    g1.fillEllipse(32, 28, 6, 16);
    // Induku (Stick / Staff)
    g1.fillStyle(0xfde047, 1);
    g1.fillRect(4, 12, 4, 38);
    g1.generateTexture('warrior-player', 48, 56);
    g1.destroy();

    // AI Warrior (Crimson / Ebony)
    const g2 = this.make.graphics({ x: 0, y: 0, add: false });
    g2.fillStyle(0x991b1b, 1);
    g2.fillRoundedRect(10, 16, 20, 30, 4);
    g2.fillStyle(0x450a0a, 1);
    g2.fillCircle(20, 10, 9);
    g2.fillStyle(0xef4444, 1);
    g2.fillRect(12, 6, 16, 4);
    g2.fillTriangle(18, 0, 22, 0, 20, -8);
    // Crimson Shield
    g2.fillStyle(0x450a0a, 1);
    g2.fillEllipse(32, 28, 10, 24);
    g2.fillStyle(0xfca5a5, 1);
    g2.fillEllipse(32, 28, 6, 16);
    // Stick
    g2.fillStyle(0xfecaca, 1);
    g2.fillRect(4, 12, 4, 38);
    g2.generateTexture('warrior-opponent', 48, 56);
    g2.destroy();
  }

  createArenaTextures() {
    // Arena Ground
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x78350f, 1);
    g.fillRect(0, 0, 800, 60);
    g.fillStyle(0xb45309, 1);
    g.fillRect(0, 0, 800, 8);
    g.generateTexture('arena-ground', 800, 60);
    g.destroy();

    // Arena Sunset Backdrop
    const bg = this.make.graphics({ x: 0, y: 0, add: false });
    bg.fillGradientStyle(0x451a03, 0x7c2d12, 0xc2410c, 0xea580c, 1);
    bg.fillRect(0, 0, 800, 450);
    // Bonfire Silhouette & Village huts in backdrop
    bg.fillStyle(0x1c1917, 0.9);
    bg.fillCircle(120, 390, 60);
    bg.fillCircle(680, 390, 60);
    bg.fillTriangle(40, 390, 120, 300, 200, 390);
    bg.fillTriangle(600, 390, 680, 300, 760, 390);
    // Fiery Giant Sun
    bg.fillStyle(0xfde047, 0.85);
    bg.fillCircle(400, 150, 70);
    bg.generateTexture('arena-bg', 800, 450);
    bg.destroy();
  }
}
`,
    },
    {
      id: 'arena-scene-js',
      path: 'src/scenes/ArenaScene.js',
      name: 'ArenaScene.js',
      language: 'javascript',
      content: `// ArenaScene: Combat physics, hitboxes, blocks, AI behavior
export class ArenaScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ArenaScene' });
  }

  create() {
    this.playerHealth = 100;
    this.opponentHealth = 100;
    this.isMatchOver = false;

    // Background & Ground
    this.add.image(400, 225, 'arena-bg');
    this.ground = this.physics.add.staticImage(400, 420, 'arena-ground');

    // Player Warrior
    this.player = this.physics.add.sprite(220, 320, 'warrior-player');
    this.player.setCollideWorldBounds(true);
    this.player.isBlocking = false;
    this.player.isAttacking = false;
    this.player.canAttack = true;

    // AI Opponent Warrior
    this.opponent = this.physics.add.sprite(580, 320, 'warrior-opponent');
    this.opponent.setCollideWorldBounds(true);
    this.opponent.flipX = true;
    this.opponent.isBlocking = false;
    this.opponent.isAttacking = false;

    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.opponent, this.ground);

    // Keyboard Inputs
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('A,D,W,J,K,SPACE');

    // AI timer loop
    this.time.addEvent({
      delay: 600,
      callback: this.updateAiBehavior,
      callbackScope: this,
      loop: true
    });
  }

  update() {
    if (this.isMatchOver) return;

    const vInput = window.virtualInput || {};
    const moveLeft = this.cursors.left.isDown || this.keys.A.isDown || vInput.left;
    const moveRight = this.cursors.right.isDown || this.keys.D.isDown || vInput.right;
    const jump = this.cursors.up.isDown || this.keys.W.isDown || vInput.jump;
    const attack = this.keys.J.isDown || this.keys.SPACE.isDown || vInput.actionA;
    const block = this.keys.K.isDown || this.cursors.down.isDown || vInput.actionB;

    // Player Blocking
    if (block && !this.player.isAttacking) {
      this.player.isBlocking = true;
      this.player.setVelocityX(0);
      this.player.setTint(0x60a5fa);
    } else {
      this.player.isBlocking = false;
      this.player.clearTint();

      // Player Movement
      if (moveLeft) {
        this.player.setVelocityX(-180);
        this.player.flipX = true;
      } else if (moveRight) {
        this.player.setVelocityX(180);
        this.player.flipX = false;
      } else {
        this.player.setVelocityX(0);
      }

      if (jump && this.player.body.touching.down) {
        this.player.setVelocityY(-450);
      }

      // Player Attack
      if (attack && this.player.canAttack && !this.player.isAttacking) {
        this.executePlayerAttack();
      }
    }
  }

  executePlayerAttack() {
    this.player.isAttacking = true;
    this.player.canAttack = false;
    this.playAudioFx('attack');

    // Lunge forward slightly
    const dir = this.player.x < this.opponent.x ? 1 : -1;
    this.player.setVelocityX(dir * 240);

    // Visual strike swing
    this.tweens.add({
      targets: this.player,
      angle: dir * 25,
      duration: 120,
      yoyo: true,
      onComplete: () => {
        this.player.angle = 0;
        this.player.isAttacking = false;
        this.time.delayedCall(250, () => {
          this.player.canAttack = true;
        });
      }
    });

    // Check hit distance
    const dist = Math.abs(this.player.x - this.opponent.x);
    if (dist < 75 && Math.abs(this.player.y - this.opponent.y) < 40) {
      this.applyDamageToOpponent(15);
    }
  }

  updateAiBehavior() {
    if (this.isMatchOver) return;

    const dist = Math.abs(this.opponent.x - this.player.x);
    const rand = Math.random();

    // Face Player
    this.opponent.flipX = this.opponent.x > this.player.x;

    if (dist > 160) {
      // Approach player
      const dir = this.player.x > this.opponent.x ? 1 : -1;
      this.opponent.setVelocityX(dir * 140);
      this.opponent.isBlocking = false;
      this.opponent.clearTint();
    } else if (dist <= 75) {
      // In strike range: Attack or Block
      if (this.player.isAttacking && rand < 0.65) {
        // AI blocks player strike
        this.opponent.isBlocking = true;
        this.opponent.setVelocityX(0);
        this.opponent.setTint(0x60a5fa);
      } else if (rand < 0.6 && !this.opponent.isAttacking) {
        this.executeAiAttack();
      } else {
        // Backstep
        const retreatDir = this.opponent.x > this.player.x ? 1 : -1;
        this.opponent.setVelocityX(retreatDir * 100);
      }
    } else {
      this.opponent.setVelocityX(0);
    }
  }

  executeAiAttack() {
    this.opponent.isAttacking = true;
    this.opponent.isBlocking = false;
    this.opponent.clearTint();
    this.playAudioFx('attack');

    const dir = this.opponent.x < this.player.x ? 1 : -1;
    this.tweens.add({
      targets: this.opponent,
      angle: dir * 25,
      duration: 140,
      yoyo: true,
      onComplete: () => {
        this.opponent.angle = 0;
        this.opponent.isAttacking = false;
      }
    });

    const dist = Math.abs(this.opponent.x - this.player.x);
    if (dist < 75 && Math.abs(this.opponent.y - this.player.y) < 40) {
      this.applyDamageToPlayer(12);
    }
  }

  applyDamageToOpponent(rawDamage) {
    let damage = rawDamage;
    if (this.opponent.isBlocking) {
      damage = Math.floor(rawDamage * 0.2); // Block absorbs 80% damage
      this.playAudioFx('block');
    } else {
      this.playAudioFx('hit');
      this.opponent.setTint(0xffffff);
      this.time.delayedCall(80, () => this.opponent.clearTint());
    }

    this.opponentHealth = Math.max(0, this.opponentHealth - damage);
    this.scene.get('BattleUiScene').events.emit('update-opponent-hp', this.opponentHealth);

    if (this.opponentHealth <= 0) {
      this.endMatch('VICTORY! YOU HAVE HONORED THE CLAN!');
    }
  }

  applyDamageToPlayer(rawDamage) {
    let damage = rawDamage;
    if (this.player.isBlocking) {
      damage = Math.floor(rawDamage * 0.2);
      this.playAudioFx('block');
    } else {
      this.playAudioFx('hit');
      this.player.setTint(0xff0000);
      this.time.delayedCall(100, () => this.player.clearTint());
    }

    this.playerHealth = Math.max(0, this.playerHealth - damage);
    this.scene.get('BattleUiScene').events.emit('update-player-hp', this.playerHealth);

    if (this.playerHealth <= 0) {
      this.endMatch('DEFEAT! TRAIN HARDER AND TRY AGAIN!');
    }
  }

  endMatch(resultMessage) {
    this.isMatchOver = true;
    this.player.setVelocity(0);
    this.opponent.setVelocity(0);
    this.playAudioFx('win');
    this.scene.get('BattleUiScene').events.emit('match-end', resultMessage);
  }

  playAudioFx(type) {
    try {
      const ctx = window.AudioContext ? new (window.AudioContext || window.webkitAudioContext)() : null;
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (type === 'attack') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'block') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'win') {
        [440, 554, 659, 880].forEach((f, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.frequency.setValueAtTime(f, now + i * 0.1);
          g.gain.setValueAtTime(0.2, now + i * 0.1);
          g.gain.exponentialRampToValueAtTime(0.01, now + (i + 1) * 0.15);
          o.start(now + i * 0.1);
          o.stop(now + (i + 1) * 0.15);
        });
      }
    } catch (e) {}
  }
}
`,
    },
    {
      id: 'battle-ui-scene-js',
      path: 'src/scenes/BattleUiScene.js',
      name: 'BattleUiScene.js',
      language: 'javascript',
      content: `// BattleUiScene: Health Bars, Warrior Names, and Victory Banner
export class BattleUiScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BattleUiScene' });
  }

  create() {
    // Player Health Bar Background & Fill
    this.add.text(30, 16, 'PLAYER WARRIOR (INDUKU & SHIELD)', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#fde047'
    });

    this.playerHpBg = this.add.rectangle(130, 42, 200, 16, 0x450a0a).setOrigin(0.5);
    this.playerHpBar = this.add.rectangle(130, 42, 200, 16, 0x22c55e).setOrigin(0.5);

    // Opponent Health Bar
    this.add.text(530, 16, 'RIVAL CHAMPION', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#f87171'
    });

    this.opponentHpBg = this.add.rectangle(670, 42, 200, 16, 0x450a0a).setOrigin(0.5);
    this.opponentHpBar = this.add.rectangle(670, 42, 200, 16, 0xef4444).setOrigin(0.5);

    // Controls Guide at bottom
    this.add.text(400, 435, 'Move: [A/D or ◄/►]  |  Strike: [J or Space]  |  Block Shield: [K or ▼]', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '12px',
      color: '#94a3b8'
    }).setOrigin(0.5);

    // Result Overlay
    this.resultText = this.add.text(400, 220, '', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '28px',
      fontWeight: '800',
      color: '#fde047',
      backgroundColor: '#0f172ae6',
      padding: { x: 28, y: 18 },
      align: 'center'
    }).setOrigin(0.5).setAlpha(0);

    // Events
    this.events.on('update-player-hp', (hp) => {
      const width = Math.max(0, (hp / 100) * 200);
      this.playerHpBar.width = width;
      if (hp < 30) this.playerHpBar.setFillStyle(0xef4444);
    });

    this.events.on('update-opponent-hp', (hp) => {
      const width = Math.max(0, (hp / 100) * 200);
      this.opponentHpBar.width = width;
    });

    this.events.on('match-end', (msg) => {
      this.resultText.setText(msg + '\\n\\nPress R or Tap to Rematch')
        .setAlpha(1);

      this.input.keyboard.once('keydown-R', () => {
        this.scene.get('ArenaScene').scene.restart();
        this.scene.restart();
      });
      this.input.once('pointerdown', () => {
        this.scene.get('ArenaScene').scene.restart();
        this.scene.restart();
      });
    });
  }
}
`,
    },
    {
      id: 'package-json',
      path: 'package.json',
      name: 'package.json',
      language: 'json',
      content: JSON.stringify(
        {
          name: projectName || 'african-warrior-duel',
          version: '1.0.0',
          private: true,
          description: title || 'Zulu Warrior Stick & Shield Duel created with Ubuntu Studio',
          scripts: {
            dev: 'vite',
            build: 'vite build',
            preview: 'vite preview',
          },
          dependencies: {
            phaser: '^3.80.1',
          },
          devDependencies: {
            vite: '^6.0.0',
          },
        },
        null,
        2,
      ),
    },
    {
      id: 'readme-md',
      path: 'README.md',
      name: 'README.md',
      language: 'markdown',
      content: `# ${title || 'Zulu Stick & Shield Duel'}

Created with **Ubuntu Studio** — The AI 2D Game Development Studio.

## ⚔️ Combat Controls
- **Move Left / Right**: Arrow Keys or \`A\` / \`D\` (or on-screen D-pad)
- **Jump**: \`W\` or Up Arrow
- **Strike Staff (Induku)**: \`J\` or \`Spacebar\` (or Action A)
- **Raise Shield (Isihlangu)**: \`K\` or Down Arrow (or Action B) - *Absorbs 80% of damage!*
- **Rematch**: \`R\` key

## 🛠️ How to Run Locally
\`\`\`bash
npm install
npm run dev
\`\`\`
`,
    },
  ],
};
