import { GameTemplate, ProjectFile } from '../types';

export const boardGameTemplate: GameTemplate = {
  id: 'board-game',
  name: 'Ncuva: Ancient Mancala Masters',
  type: 'board-game',
  iconName: 'LayoutGrid',
  badge: 'Turn-Based Strategy',
  description: 'Authentic simulation of Ncuva / Mancala, the ancient African seed distribution game of mathematical calculation, tactical captures, and king pits.',
  samplePrompts: [
    'Create a two-player Ncuva board game.',
    'Add an AI opponent with three difficulty levels.',
    'Add smooth animations for seed distribution and capture effects.',
    'Show turn statistics and captured seed counter.',
  ],
  culturalInspiration: 'Ncuva (also known as Mancala, Bao, or Morabaraba) is one of the oldest strategy games in human history, originating across Southern and Eastern Africa.',
  defaultSettings: {
    canvasWidth: 800,
    canvasHeight: 450,
    orientation: 'landscape',
    gravityY: 0,
    physicsType: 'none',
    debug: false,
    soundEnabled: true,
    musicEnabled: true,
    mobileControls: true,
    fpsLimit: 60,
    difficulty: 'normal',
    backgroundColor: '#27170e',
    scaleMode: 'FIT',
  },
  createFiles: (projectName: string, title: string): ProjectFile[] => [
    {
      id: 'main-js',
      path: 'src/main.js',
      name: 'main.js',
      language: 'javascript',
      content: `// Ubuntu Studio - Ncuva Board Game Entry
import { NcuvaScene } from './scenes/NcuvaScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 800,
  height: 450,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  backgroundColor: '#27170e',
  scene: [NcuvaScene]
};

window.game = new Phaser.Game(config);
`,
    },
    {
      id: 'ncuva-scene-js',
      path: 'src/scenes/NcuvaScene.js',
      name: 'NcuvaScene.js',
      language: 'javascript',
      content: `// NcuvaScene: Board rendering, seed distribution algorithm, AI logic
export class NcuvaScene extends Phaser.Scene {
  constructor() {
    super({ key: 'NcuvaScene' });
  }

  create() {
    this.createBoardGraphics();

    // 2 rows of 6 pits each, plus 2 storehouses (Mancalas)
    // Pits 0-5: Player pits (bottom row, left to right)
    // Pit 6: Player Store (Right)
    // Pits 7-12: AI Opponent pits (top row, right to left)
    // Pit 13: AI Store (Left)
    this.pits = [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0];
    this.currentTurn = 'player'; // 'player' | 'ai'
    this.isAnimating = false;
    this.gameOver = false;

    // Title & Status
    this.add.text(400, 30, 'NCUVA: ANCIENT MANCALA MASTERS', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '22px',
      fontWeight: 'bold',
      color: '#fde047'
    }).setOrigin(0.5);

    this.turnText = this.add.text(400, 65, "Your Turn — Choose a pit with seeds", {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '16px',
      color: '#38bdf8'
    }).setOrigin(0.5);

    this.renderBoard();
  }

  createBoardGraphics() {
    // Carved mahogany wood board
    const g = this.add.graphics();
    g.fillStyle(0x451a03, 1);
    g.fillRoundedRect(70, 90, 660, 270, 24);
    g.lineStyle(4, 0x92400e, 1);
    g.strokeRoundedRect(70, 90, 660, 270, 24);

    // Carved African geometric pattern on trim
    g.fillStyle(0x78350f, 1);
    for (let x = 100; x < 700; x += 40) {
      g.fillTriangle(x, 96, x + 20, 96, x + 10, 108);
      g.fillTriangle(x, 354, x + 20, 354, x + 10, 342);
    }
  }

  renderBoard() {
    // Clear previous pit buttons & texts if any
    if (this.pitElements) {
      this.pitElements.forEach(el => el.destroy());
    }
    this.pitElements = [];

    // Store Pits (Left: AI Store pit 13, Right: Player Store pit 6)
    this.createStorePit(110, 225, 13, 'Rival Store');
    this.createStorePit(690, 225, 6, 'Your Store');

    // AI Top Row Pits (index 12 down to 7)
    for (let i = 0; i < 6; i++) {
      const pitIndex = 12 - i;
      const x = 200 + i * 80;
      const y = 160;
      this.createPitCircle(x, y, pitIndex, false);
    }

    // Player Bottom Row Pits (index 0 to 5)
    for (let i = 0; i < 6; i++) {
      const pitIndex = i;
      const x = 200 + i * 80;
      const y = 290;
      this.createPitCircle(x, y, pitIndex, true);
    }
  }

  createPitCircle(x, y, index, isPlayer) {
    const seedCount = this.pits[index];
    const g = this.add.graphics();

    // Pit bowl
    g.fillStyle(0x27170e, 1);
    g.fillCircle(x, y, 32);
    g.lineStyle(2, isPlayer && this.currentTurn === 'player' && seedCount > 0 ? 0xfde047 : 0x78350f, 1);
    g.strokeCircle(x, y, 32);
    this.pitElements.push(g);

    // Draw Seeds inside pit
    const seedRadius = 5;
    for (let s = 0; s < Math.min(seedCount, 12); s++) {
      const angle = (s / Math.min(seedCount, 12)) * Math.PI * 2;
      const dist = s === 0 ? 0 : 14;
      const sx = x + Math.cos(angle) * dist;
      const sy = y + Math.sin(angle) * dist;
      const sg = this.add.graphics();
      sg.fillStyle(0xd97706, 1);
      sg.fillCircle(sx, sy, seedRadius);
      sg.lineStyle(1, 0xfef08a, 1);
      sg.strokeCircle(sx, sy, seedRadius);
      this.pitElements.push(sg);
    }

    // Seed Count Label
    const countText = this.add.text(x, y + 42, seedCount.toString(), {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '15px',
      fontWeight: 'bold',
      color: isPlayer ? '#fde047' : '#fca5a5'
    }).setOrigin(0.5);
    this.pitElements.push(countText);

    // Interactive zone for player pits
    if (isPlayer) {
      const zone = this.add.zone(x, y, 64, 64).setOrigin(0.5).setInteractive({ cursor: 'pointer' });
      zone.on('pointerdown', () => {
        if (this.currentTurn === 'player' && !this.isAnimating && this.pits[index] > 0 && !this.gameOver) {
          this.distributeSeeds(index);
        }
      });
      this.pitElements.push(zone);
    }
  }

  createStorePit(x, y, index, label) {
    const seedCount = this.pits[index];
    const g = this.add.graphics();
    g.fillStyle(0x27170e, 1);
    g.fillRoundedRect(x - 28, y - 80, 56, 160, 20);
    g.lineStyle(3, 0x92400e, 1);
    g.strokeRoundedRect(x - 28, y - 80, 56, 160, 20);
    this.pitElements.push(g);

    // Label
    const lbl = this.add.text(x, y - 95, label, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '12px',
      color: '#cbd5e1'
    }).setOrigin(0.5);
    this.pitElements.push(lbl);

    // Count in store
    const count = this.add.text(x, y, seedCount.toString(), {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '28px',
      fontWeight: 'bold',
      color: index === 6 ? '#22c55e' : '#ef4444'
    }).setOrigin(0.5);
    this.pitElements.push(count);
  }

  async distributeSeeds(startPit) {
    this.isAnimating = true;
    let seeds = this.pits[startPit];
    this.pits[startPit] = 0;
    this.playTone(350);

    let currentPit = startPit;
    while (seeds > 0) {
      currentPit = (currentPit + 1) % 14;
      // Skip opponent store
      if (this.currentTurn === 'player' && currentPit === 13) continue;
      if (this.currentTurn === 'ai' && currentPit === 6) continue;

      this.pits[currentPit]++;
      seeds--;
      this.playTone(480 + (currentPit * 20));
      this.renderBoard();
      await this.sleep(180);
    }

    // Capture Rule: If last seed lands in an empty pit on your own side
    if (this.currentTurn === 'player' && currentPit >= 0 && currentPit <= 5 && this.pits[currentPit] === 1) {
      const oppositePit = 12 - currentPit;
      if (this.pits[oppositePit] > 0) {
        const captured = this.pits[oppositePit] + 1;
        this.pits[oppositePit] = 0;
        this.pits[currentPit] = 0;
        this.pits[6] += captured;
        this.playTone(880);
        this.turnText.setText('Capture! +' + captured + ' seeds to your store!');
        await this.sleep(400);
      }
    } else if (this.currentTurn === 'ai' && currentPit >= 7 && currentPit <= 12 && this.pits[currentPit] === 1) {
      const oppositePit = 12 - currentPit;
      if (this.pits[oppositePit] > 0) {
        const captured = this.pits[oppositePit] + 1;
        this.pits[oppositePit] = 0;
        this.pits[currentPit] = 0;
        this.pits[13] += captured;
        this.playTone(300);
        this.turnText.setText('Rival captured ' + captured + ' seeds!');
        await this.sleep(400);
      }
    }

    // Free Turn Rule: If last seed lands in your store
    const getsFreeTurn = (this.currentTurn === 'player' && currentPit === 6) ||
                         (this.currentTurn === 'ai' && currentPit === 13);

    this.checkGameOver();

    if (!this.gameOver) {
      if (!getsFreeTurn) {
        this.currentTurn = this.currentTurn === 'player' ? 'ai' : 'player';
      }

      if (this.currentTurn === 'player') {
        this.turnText.setText(getsFreeTurn ? 'Free Turn! Choose another pit' : 'Your Turn');
      } else {
        this.turnText.setText('Rival thinking...');
        this.time.delayedCall(800, () => this.runAiTurn());
      }
    }

    this.isAnimating = false;
    this.renderBoard();
  }

  runAiTurn() {
    if (this.gameOver) return;

    // AI finds valid pits with seeds (pits 7 through 12)
    const validPits = [];
    for (let p = 7; p <= 12; p++) {
      if (this.pits[p] > 0) validPits.push(p);
    }

    if (validPits.length === 0) {
      this.checkGameOver();
      return;
    }

    // Smart heuristic: prefer free turn or capture
    let chosenPit = validPits[Math.floor(Math.random() * validPits.length)];
    for (const pit of validPits) {
      if ((pit + this.pits[pit]) % 14 === 13) {
        chosenPit = pit; // Free turn move
        break;
      }
    }

    this.distributeSeeds(chosenPit);
  }

  checkGameOver() {
    const playerSeeds = this.pits.slice(0, 6).reduce((a, b) => a + b, 0);
    const aiSeeds = this.pits.slice(7, 13).reduce((a, b) => a + b, 0);

    if (playerSeeds === 0 || aiSeeds === 0) {
      this.gameOver = true;
      // Sweep remaining seeds into respective stores
      this.pits[6] += playerSeeds;
      this.pits[13] += aiSeeds;
      for (let i = 0; i < 6; i++) this.pits[i] = 0;
      for (let i = 7; i < 13; i++) this.pits[i] = 0;

      const playerTotal = this.pits[6];
      const aiTotal = this.pits[13];

      let msg = '';
      if (playerTotal > aiTotal) {
        msg = 'VICTORY! You won ' + playerTotal + ' to ' + aiTotal + '!';
      } else if (aiTotal > playerTotal) {
        msg = 'DEFEAT! Rival won ' + aiTotal + ' to ' + playerTotal + '.';
      } else {
        msg = 'DRAW MATCH! Both scored ' + playerTotal + '!';
      }

      this.turnText.setText(msg).setColor('#fde047');
      this.add.text(400, 395, 'Tap anywhere or press R to Play Again', {
        fontFamily: 'Outfit, sans-serif',
        fontSize: '16px',
        color: '#38bdf8'
      }).setOrigin(0.5);

      this.input.once('pointerdown', () => this.scene.restart());
      this.input.keyboard.once('keydown-R', () => this.scene.restart());
    }
  }

  playTone(freq) {
    try {
      const ctx = window.AudioContext ? new (window.AudioContext || window.webkitAudioContext)() : null;
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
          name: projectName || 'ncuva-mancala-board',
          version: '1.0.0',
          private: true,
          description: title || 'Ncuva African Strategy Board Game created with Ubuntu Studio',
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
      content: `# ${title || 'Ncuva: Ancient Mancala Masters'}

Created with **Ubuntu Studio** — The AI 2D Game Development Studio.

## 🎲 Rules of Ncuva / Mancala
1. Click on any of your bottom 6 pits to sow seeds counter-clockwise.
2. If your last seed lands in your storehouse (Right), you get a **Free Turn**!
3. If your last seed lands in an empty pit on your side, you **Capture** all seeds in the opposite opponent pit!
4. The game ends when one player's side is empty. The player with the most seeds in their storehouse wins!
`,
    },
  ],
};
