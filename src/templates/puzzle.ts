import { GameTemplate, ProjectFile } from '../types';

export const puzzleTemplate: GameTemplate = {
  id: 'puzzle',
  name: 'Kalahari Glyph Relic Match',
  type: 'puzzle',
  iconName: 'Puzzle',
  badge: 'Match-3 / Puzzle',
  description: 'Color and symbol matching puzzle with ancient African cultural glyphs, cascading combos, time attack, and particle effects.',
  samplePrompts: [
    'Create an African artifact matching puzzle game.',
    'Add a combo multiplier and special bomb glyphs.',
    'Add a countdown timer mode with high scores.',
  ],
  culturalInspiration: 'Inspired by ancient Saharan petroglyphs and African beadwork geometry.',
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
    backgroundColor: '#0f172a',
    scaleMode: 'FIT',
  },
  createFiles: (projectName: string, title: string): ProjectFile[] => [
    {
      id: 'main-js',
      path: 'src/main.js',
      name: 'main.js',
      language: 'javascript',
      content: `// Ubuntu Studio - Relic Match Entry
import { PuzzleScene } from './scenes/PuzzleScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 800,
  height: 450,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  backgroundColor: '#0f172a',
  scene: [PuzzleScene]
};

window.game = new Phaser.Game(config);
`,
    },
    {
      id: 'puzzle-scene-js',
      path: 'src/scenes/PuzzleScene.js',
      name: 'PuzzleScene.js',
      language: 'javascript',
      content: `// PuzzleScene: 6x6 Grid of colorful cultural glyphs with match detection
export class PuzzleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PuzzleScene' });
  }

  create() {
    this.createGlyphTextures();
    this.score = 0;
    this.moves = 25;
    this.gridSize = 6;
    this.tileSize = 54;
    this.startX = 230;
    this.startY = 70;
    this.selectedTile = null;

    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0f172a, 0x1e1b4b, 0x312e81, 0x1e293b, 1);
    bg.fillRect(0, 0, 800, 450);

    // Left Info Panel
    this.add.text(40, 50, 'KALAHARI\\nGLYPHS', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '24px',
      fontWeight: '800',
      color: '#fde047'
    });

    this.scoreText = this.add.text(40, 140, 'SCORE\\n0', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#38bdf8'
    });

    this.movesText = this.add.text(40, 210, 'MOVES LEFT\\n25', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#f43f5e'
    });

    this.add.text(40, 320, 'Match 3 or more\\nidentical relics\\nhorizontally or\\nvertically!', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '13px',
      color: '#94a3b8'
    });

    // Grid Container
    const gridBg = this.add.graphics();
    gridBg.fillStyle(0x020617, 0.7);
    gridBg.fillRoundedRect(this.startX - 10, this.startY - 10, this.gridSize * this.tileSize + 20, this.gridSize * this.tileSize + 20, 16);
    gridBg.lineStyle(2, 0x475569, 1);
    gridBg.strokeRoundedRect(this.startX - 10, this.startY - 10, this.gridSize * this.tileSize + 20, this.gridSize * this.tileSize + 20, 16);

    this.initGrid();
  }

  createGlyphTextures() {
    const colors = [
      { key: 'glyph-0', color: 0xef4444, shape: 'triangle' }, // Ruby Sun
      { key: 'glyph-1', color: 0x3b82f6, shape: 'circle' },   // Sapphire Moon
      { key: 'glyph-2', color: 0x10b981, shape: 'diamond' },  // Emerald Leaf
      { key: 'glyph-3', color: 0xf59e0b, shape: 'star' },     // Amber Cowrie
      { key: 'glyph-4', color: 0xa855f7, shape: 'square' }    // Amethyst Mask
    ];

    colors.forEach(c => {
      if (!this.textures.exists(c.key)) {
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(c.color, 1);
        g.fillRoundedRect(4, 4, 44, 44, 8);
        g.fillStyle(0xffffff, 0.4);
        g.fillCircle(14, 14, 6);
        g.lineStyle(2, 0xffffff, 0.8);
        g.strokeRoundedRect(4, 4, 44, 44, 8);
        g.generateTexture(c.key, 52, 52);
        g.destroy();
      }
    });
  }

  initGrid() {
    this.grid = [];
    for (let r = 0; r < this.gridSize; r++) {
      this.grid[r] = [];
      for (let c = 0; c < this.gridSize; c++) {
        const type = Phaser.Math.Between(0, 4);
        const x = this.startX + c * this.tileSize + 26;
        const y = this.startY + r * this.tileSize + 26;
        const sprite = this.add.sprite(x, y, 'glyph-' + type).setInteractive({ cursor: 'pointer' });
        sprite.row = r;
        sprite.col = c;
        sprite.glyphType = type;

        sprite.on('pointerdown', () => this.tileClicked(sprite));
        this.grid[r][c] = sprite;
      }
    }
  }

  tileClicked(tile) {
    if (this.moves <= 0) return;

    if (!this.selectedTile) {
      this.selectedTile = tile;
      tile.setScale(1.15);
      tile.setTint(0xfef08a);
      this.playSynthTone(440);
    } else {
      const isAdjacent = Math.abs(this.selectedTile.row - tile.row) + Math.abs(this.selectedTile.col - tile.col) === 1;
      if (isAdjacent) {
        this.swapTiles(this.selectedTile, tile);
        this.moves--;
        this.movesText.setText('MOVES LEFT\\n' + this.moves);
      }
      this.selectedTile.setScale(1.0);
      this.selectedTile.clearTint();
      this.selectedTile = null;
    }
  }

  swapTiles(tileA, tileB) {
    const tempType = tileA.glyphType;
    tileA.glyphType = tileB.glyphType;
    tileB.glyphType = tempType;

    tileA.setTexture('glyph-' + tileA.glyphType);
    tileB.setTexture('glyph-' + tileB.glyphType);
    this.playSynthTone(600);

    this.checkMatches();
  }

  checkMatches() {
    const matched = new Set();

    // Check rows
    for (let r = 0; r < this.gridSize; r++) {
      for (let c = 0; c < this.gridSize - 2; c++) {
        const type = this.grid[r][c].glyphType;
        if (type !== -1 && type === this.grid[r][c + 1].glyphType && type === this.grid[r][c + 2].glyphType) {
          matched.add(this.grid[r][c]);
          matched.add(this.grid[r][c + 1]);
          matched.add(this.grid[r][c + 2]);
        }
      }
    }

    // Check cols
    for (let c = 0; c < this.gridSize; c++) {
      for (let r = 0; r < this.gridSize - 2; r++) {
        const type = this.grid[r][c].glyphType;
        if (type !== -1 && type === this.grid[r + 1][c].glyphType && type === this.grid[r + 2][c].glyphType) {
          matched.add(this.grid[r][c]);
          matched.add(this.grid[r + 1][c]);
          matched.add(this.grid[r + 2][c]);
        }
      }
    }

    if (matched.size > 0) {
      this.score += matched.size * 50;
      this.scoreText.setText('SCORE\\n' + this.score);
      this.playSynthTone(880);

      matched.forEach(tile => {
        this.tweens.add({
          targets: tile,
          scale: 0.1,
          alpha: 0,
          duration: 200,
          onComplete: () => {
            tile.glyphType = Phaser.Math.Between(0, 4);
            tile.setTexture('glyph-' + tile.glyphType);
            tile.setScale(1);
            tile.setAlpha(1);
          }
        });
      });
    }
  }

  playSynthTone(freq) {
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
          name: projectName || 'kalahari-glyph-puzzle',
          version: '1.0.0',
          private: true,
          description: title || 'Kalahari Glyph Relic Match created with Ubuntu Studio',
          scripts: {
            dev: 'vite',
            build: 'vite build',
          },
          dependencies: {
            phaser: '^3.80.1',
          },
        },
        null,
        2,
      ),
    },
  ],
};
