import { GameTemplate, ProjectFile } from '../types';

export const platformerTemplate: GameTemplate = {
  id: 'platformer',
  name: 'Savannah Runner: Artifact Quest',
  type: 'platformer',
  iconName: 'Sparkles',
  badge: '2D Platformer',
  description: 'Fast-paced platformer where a courageous hero leaps across savannah platforms, collects sacred cowrie artifacts, and dodges obstacles.',
  samplePrompts: [
    'Create a 2D platformer where a player explores a traditional African village and collects cultural artifacts.',
    'Add a double jump and special dash power-up.',
    'Make the level generate moving floating platforms with golden coins.',
    'Add an evil hyena boss at the end of the stage.',
  ],
  culturalInspiration: 'Inspired by East African savannah folklore and ancient cowrie shell trading traditions.',
  defaultSettings: {
    canvasWidth: 800,
    canvasHeight: 450,
    orientation: 'landscape',
    gravityY: 750,
    physicsType: 'arcade',
    debug: false,
    soundEnabled: true,
    musicEnabled: true,
    mobileControls: true,
    fpsLimit: 60,
    difficulty: 'normal',
    backgroundColor: '#1e293b',
    scaleMode: 'FIT',
  },
  createFiles: (projectName: string, title: string): ProjectFile[] => [
    {
      id: 'main-js',
      path: 'src/main.js',
      name: 'main.js',
      language: 'javascript',
      content: `// Ubuntu Studio - Game Entry Point
import { BootScene } from './scenes/BootScene.js';
import { GameScene } from './scenes/GameScene.js';
import { UiScene } from './scenes/UiScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 800,
  height: 450,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 750 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  backgroundColor: '#0f172a',
  scene: [BootScene, GameScene, UiScene]
};

window.game = new Phaser.Game(config);
`,
    },
    {
      id: 'boot-scene-js',
      path: 'src/scenes/BootScene.js',
      name: 'BootScene.js',
      language: 'javascript',
      content: `// BootScene: Asset setup & procedural texture creation
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Generate all game textures in-memory
    this.createHeroTexture();
    this.createPlatformTexture();
    this.createArtifactTexture();
    this.createEnemyTexture();
    this.createBackgroundTexture();
  }

  create() {
    this.scene.start('GameScene');
    this.scene.start('UiScene');
  }

  createHeroTexture() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // Hero Body
    g.fillStyle(0xd97706, 1); // Ochre Gold
    g.fillRoundedRect(8, 10, 16, 22, 4);
    // Head
    g.fillStyle(0x78350f, 1);
    g.fillCircle(16, 8, 7);
    // Feather / Crown
    g.fillStyle(0xef4444, 1);
    g.fillTriangle(14, 2, 18, 2, 16, -4);
    // Shield
    g.fillStyle(0x92400e, 1);
    g.fillRoundedRect(22, 12, 6, 16, 3);
    g.lineStyle(1, 0xfef08a, 1);
    g.strokeRoundedRect(22, 12, 6, 16, 3);
    // Eyes
    g.fillStyle(0xffffff, 1);
    g.fillCircle(18, 7, 2);
    g.fillStyle(0x000000, 1);
    g.fillCircle(19, 7, 1);
    g.generateTexture('hero', 32, 36);
    g.destroy();
  }

  createPlatformTexture() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // Earth block
    g.fillStyle(0x78350f, 1);
    g.fillRect(0, 0, 64, 32);
    // Grass/Moss cap
    g.fillStyle(0x65a30d, 1);
    g.fillRect(0, 0, 64, 8);
    // Tribal pattern marks
    g.fillStyle(0x92400e, 1);
    g.fillRect(10, 14, 8, 4);
    g.fillRect(42, 18, 12, 4);
    g.generateTexture('platform', 64, 32);
    g.destroy();
  }

  createArtifactTexture() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // Glowing golden Cowrie Shell
    g.fillStyle(0xf59e0b, 1);
    g.fillCircle(12, 12, 10);
    g.fillStyle(0xfef08a, 1);
    g.fillCircle(12, 12, 6);
    g.fillStyle(0xb45309, 1);
    g.fillRoundedRect(9, 8, 6, 8, 2);
    g.generateTexture('artifact', 24, 24);
    g.destroy();
  }

  createEnemyTexture() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xdc2626, 1);
    g.fillRoundedRect(6, 8, 20, 20, 4);
    g.fillStyle(0x450a0a, 1);
    g.fillCircle(16, 6, 6);
    // Sharp teeth / eyes
    g.fillStyle(0xfef08a, 1);
    g.fillCircle(12, 6, 2);
    g.fillCircle(20, 6, 2);
    g.fillStyle(0xffffff, 1);
    g.fillTriangle(10, 22, 14, 22, 12, 26);
    g.fillTriangle(18, 22, 22, 22, 20, 26);
    g.generateTexture('enemy', 32, 32);
    g.destroy();
  }

  createBackgroundTexture() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // Gradient sky
    g.fillGradientStyle(0x0f172a, 0x1e1b4b, 0x312e81, 0x4338ca, 1);
    g.fillRect(0, 0, 800, 450);
    // Distant Savannah Mountains
    g.fillStyle(0x1e1b4b, 0.8);
    g.fillTriangle(0, 400, 180, 220, 360, 400);
    g.fillTriangle(280, 400, 480, 200, 680, 400);
    g.fillTriangle(550, 400, 700, 240, 850, 400);
    // Golden African Moon / Sun
    g.fillStyle(0xfef08a, 0.9);
    g.fillCircle(680, 80, 36);
    g.generateTexture('bg-savannah', 800, 450);
    g.destroy();
  }
}
`,
    },
    {
      id: 'game-scene-js',
      path: 'src/scenes/GameScene.js',
      name: 'GameScene.js',
      language: 'javascript',
      content: `// GameScene: Physics, Player controls, Collectibles, and Enemies
export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.score = 0;
    this.lives = 3;
    this.isGameOver = false;

    // Background
    this.add.image(400, 225, 'bg-savannah');

    // Create Static Platforms Group
    this.platforms = this.physics.add.staticGroup();

    // Ground floor
    for (let x = 0; x < 850; x += 64) {
      this.platforms.create(x, 430, 'platform');
    }

    // Floating Platforms
    this.platforms.create(200, 320, 'platform');
    this.platforms.create(400, 260, 'platform');
    this.platforms.create(600, 200, 'platform');
    this.platforms.create(250, 160, 'platform');
    this.platforms.create(520, 350, 'platform');

    // Player Setup
    this.player = this.physics.add.sprite(80, 350, 'hero');
    this.player.setBounce(0.15);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms);

    // Collectibles (Golden Artifacts)
    this.artifacts = this.physics.add.group();
    const artifactPositions = [
      { x: 200, y: 280 },
      { x: 400, y: 220 },
      { x: 600, y: 160 },
      { x: 250, y: 120 },
      { x: 520, y: 310 },
      { x: 720, y: 380 },
      { x: 120, y: 380 }
    ];

    artifactPositions.forEach(pos => {
      const art = this.artifacts.create(pos.x, pos.y, 'artifact');
      art.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
    });

    this.physics.add.collider(this.artifacts, this.platforms);
    this.physics.add.overlap(this.player, this.artifacts, this.collectArtifact, null, this);

    // Enemies (Roaming Beasts)
    this.enemies = this.physics.add.group();
    const enemy1 = this.enemies.create(420, 400, 'enemy');
    enemy1.setVelocityX(80);
    enemy1.setBounce(1);
    enemy1.setCollideWorldBounds(true);

    const enemy2 = this.enemies.create(380, 220, 'enemy');
    enemy2.setVelocityX(-60);
    enemy2.setBounce(1);
    enemy2.setCollideWorldBounds(false);

    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.player, this.enemies, this.hitEnemy, null, this);

    // Input Controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D,SPACE');

    // Emit initial HUD state
    this.scene.get('UiScene').events.emit('update-score', this.score);
    this.scene.get('UiScene').events.emit('update-lives', this.lives);
  }

  update() {
    if (this.isGameOver) return;

    // Check Virtual Mobile Input or Keyboard
    const vInput = window.virtualInput || {};
    const moveLeft = this.cursors.left.isDown || this.wasd.A.isDown || vInput.left;
    const moveRight = this.cursors.right.isDown || this.wasd.D.isDown || vInput.right;
    const jump = this.cursors.up.isDown || this.wasd.W.isDown || this.wasd.SPACE.isDown || vInput.jump || vInput.actionA;

    // Horizontal Movement
    if (moveLeft) {
      this.player.setVelocityX(-220);
      this.player.flipX = true;
    } else if (moveRight) {
      this.player.setVelocityX(220);
      this.player.flipX = false;
    } else {
      this.player.setVelocityX(0);
    }

    // Jumping
    if (jump && this.player.body.touching.down) {
      this.player.setVelocityY(-540);
      this.playSynthSound('jump');
    }

    // Keep enemies patrolling platform edges
    this.enemies.getChildren().forEach(enemy => {
      if (enemy.body.blocked.left) enemy.setVelocityX(80);
      if (enemy.body.blocked.right) enemy.setVelocityX(-80);
    });
  }

  collectArtifact(player, artifact) {
    artifact.disableBody(true, true);
    this.score += 100;
    this.playSynthSound('coin');
    this.scene.get('UiScene').events.emit('update-score', this.score);

    // Respawn artifacts if all collected
    if (this.artifacts.countActive(true) === 0) {
      this.score += 500;
      this.playSynthSound('win');
      this.scene.get('UiScene').events.emit('show-message', 'Stage Cleared! +500 Bonus');
      
      this.time.delayedCall(1200, () => {
        this.artifacts.children.iterate(child => {
          child.enableBody(true, child.x, 0, true, true);
        });
      });
    }
  }

  hitEnemy(player, enemy) {
    // Jump on top of enemy to defeat it
    if (player.body.velocity.y > 0 && player.y < enemy.y - 12) {
      enemy.disableBody(true, true);
      player.setVelocityY(-350);
      this.score += 250;
      this.playSynthSound('attack');
      this.scene.get('UiScene').events.emit('update-score', this.score);
    } else {
      // Player takes damage
      this.lives -= 1;
      this.playSynthSound('hit');
      this.scene.get('UiScene').events.emit('update-lives', this.lives);
      player.setVelocityY(-300);
      player.setVelocityX(player.x < enemy.x ? -200 : 200);

      // Flash effect
      this.tweens.add({
        targets: player,
        alpha: 0.3,
        yoyo: true,
        repeat: 3,
        duration: 80
      });

      if (this.lives <= 0) {
        this.isGameOver = true;
        this.physics.pause();
        player.setTint(0xff0000);
        this.scene.get('UiScene').events.emit('show-game-over', this.score);
      }
    }
  }

  playSynthSound(type) {
    try {
      const ctx = window.AudioContext ? new (window.AudioContext || window.webkitAudioContext)() : null;
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (type === 'jump') {
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(500, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'coin') {
        osc.frequency.setValueAtTime(550, now);
        osc.frequency.setValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.2);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'attack') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch (e) {}
  }
}
`,
    },
    {
      id: 'ui-scene-js',
      path: 'src/scenes/UiScene.js',
      name: 'UiScene.js',
      language: 'javascript',
      content: `// UiScene: Heads-up Display, Score, Lives, and Game Messages
export class UiScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UiScene' });
  }

  create() {
    // Score label with African tribal banner style
    this.scoreText = this.add.text(24, 20, 'SACRED RELICS: 0', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#fef08a',
      backgroundColor: '#0f172ab0',
      padding: { x: 12, y: 6 }
    });

    // Lives counter
    this.livesText = this.add.text(660, 20, 'HEARTS: ❤️❤️❤️', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#f87171',
      backgroundColor: '#0f172ab0',
      padding: { x: 12, y: 6 }
    });

    // Center Banner for Alerts
    this.centerBanner = this.add.text(400, 225, '', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '32px',
      fontWeight: '800',
      color: '#38bdf8',
      backgroundColor: '#000000cc',
      padding: { x: 24, y: 16 },
      align: 'center'
    }).setOrigin(0.5).setAlpha(0);

    // Event listeners from GameScene
    this.events.on('update-score', (score) => {
      this.scoreText.setText('SACRED RELICS: ' + score);
    });

    this.events.on('update-lives', (lives) => {
      const hearts = '❤️'.repeat(Math.max(0, lives));
      this.livesText.setText('HEARTS: ' + (hearts || '💀'));
    });

    this.events.on('show-message', (msg) => {
      this.centerBanner.setText(msg).setAlpha(1);
      this.tweens.add({
        targets: this.centerBanner,
        alpha: 0,
        delay: 1500,
        duration: 500
      });
    });

    this.events.on('show-game-over', (finalScore) => {
      this.centerBanner.setText('GAME OVER\\nFinal Score: ' + finalScore + '\\n\\nPress R or Tap to Restart')
        .setColor('#ef4444')
        .setAlpha(1);

      this.input.keyboard.once('keydown-R', () => {
        this.scene.get('GameScene').scene.restart();
        this.scene.restart();
      });

      this.input.once('pointerdown', () => {
        this.scene.get('GameScene').scene.restart();
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
          name: projectName || 'savannah-runner',
          version: '1.0.0',
          private: true,
          description: title || 'Savannah Runner 2D Game created with Ubuntu Studio',
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
      content: `# ${title || 'Savannah Runner: Artifact Quest'}

Created with **Ubuntu Studio** — The AI 2D Game Development Studio.

## 🎮 Game Controls
- **Move Left / Right**: Arrow Keys or \`A\` / \`D\` (or on-screen mobile D-pad)
- **Jump**: Up Arrow, \`W\`, or \`Spacebar\` (or mobile Jump button)
- **Restart**: \`R\` key

## 🛠️ How to Run Locally
1. Extract the downloaded ZIP file.
2. Open terminal in the project directory:
\`\`\`bash
npm install
npm run dev
\`\`\`
3. Open your browser at \`http://localhost:5173\`

## 🚀 How to Build for Production
\`\`\`bash
npm run build
\`\`\`
Outputs static web files to \`dist/\` ready for deployment on GitHub Pages, Vercel, or Netlify.
`,
    },
  ],
};
