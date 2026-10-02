import { GameTemplate, ProjectFile } from '../types';

export const adventureTemplate: GameTemplate = {
  id: 'adventure',
  name: 'Mali Chronicles: Timbuktu Scholar',
  type: 'adventure',
  iconName: 'Compass',
  badge: 'Top-Down RPG',
  description: 'Top-down 2D adventure exploring the historical desert city of Timbuktu, interacting with scribes, solving village quests, and collecting lost manuscripts.',
  samplePrompts: [
    'Create an exploration RPG in an ancient West African market.',
    'Add an inventory system with collectible sacred scrolls and gold coins.',
    'Add NPCs with interactive dialogue trees.',
  ],
  culturalInspiration: 'Inspired by the 14th-century Empire of Mali and the University of Sankore in Timbuktu.',
  defaultSettings: {
    canvasWidth: 800,
    canvasHeight: 450,
    orientation: 'landscape',
    gravityY: 0,
    physicsType: 'arcade',
    debug: false,
    soundEnabled: true,
    musicEnabled: true,
    mobileControls: true,
    fpsLimit: 60,
    difficulty: 'normal',
    backgroundColor: '#451a03',
    scaleMode: 'FIT',
  },
  createFiles: (projectName: string, title: string): ProjectFile[] => [
    {
      id: 'main-js',
      path: 'src/main.js',
      name: 'main.js',
      language: 'javascript',
      content: `// Ubuntu Studio - Top-Down RPG Entry
import { VillageScene } from './scenes/VillageScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 800,
  height: 450,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  backgroundColor: '#451a03',
  scene: [VillageScene]
};

window.game = new Phaser.Game(config);
`,
    },
    {
      id: 'village-scene-js',
      path: 'src/scenes/VillageScene.js',
      name: 'VillageScene.js',
      language: 'javascript',
      content: `// VillageScene: Top-down movement, buildings, NPC dialogue, manuscript quests
export class VillageScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VillageScene' });
  }

  create() {
    this.scrollsFound = 0;
    this.totalScrolls = 4;

    this.createTextures();

    // Sandy Market Ground
    const bg = this.add.graphics();
    bg.fillStyle(0xd97706, 1);
    bg.fillRect(0, 0, 800, 450);
    // Path cobblestone
    bg.fillStyle(0xb45309, 1);
    bg.fillRect(360, 0, 80, 450);
    bg.fillRect(0, 200, 800, 60);

    // Clay Mosques & Adobe Houses (Collidable)
    this.buildings = this.physics.add.staticGroup();
    this.createBuilding(140, 100, 160, 120, 'Sankore University');
    this.createBuilding(660, 100, 160, 120, 'Royal Library');
    this.createBuilding(140, 360, 160, 100, 'Caravan Market');
    this.createBuilding(660, 360, 160, 100, 'Alchemist Workshop');

    // Sacred Scrolls (Quest Items)
    this.scrolls = this.physics.add.group();
    const scrollPositions = [
      { x: 380, y: 70 },
      { x: 740, y: 220 },
      { x: 70, y: 230 },
      { x: 420, y: 390 }
    ];
    scrollPositions.forEach(p => {
      const s = this.scrolls.create(p.x, p.y, 'scroll');
      s.setBounce(0);
    });

    // NPC Village Elder
    this.npc = this.physics.add.staticSprite(400, 170, 'npc');

    // Player Explorer
    this.player = this.physics.add.sprite(400, 290, 'explorer');
    this.player.setCollideWorldBounds(true);

    this.physics.add.collider(this.player, this.buildings);
    this.physics.add.collider(this.player, this.npc, this.talkToElder, null, this);
    this.physics.add.overlap(this.player, this.scrolls, this.collectScroll, null, this);

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');

    // HUD
    this.hudText = this.add.text(20, 16, 'TIMBUKTU SCROLLS: 0 / ' + this.totalScrolls, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#fde047',
      backgroundColor: '#0f172ab3',
      padding: { x: 12, y: 6 }
    });

    // Dialog Box
    this.dialogBox = this.add.container(400, 390).setAlpha(0);
    const dlgBg = this.add.graphics();
    dlgBg.fillStyle(0x0f172a, 0.95);
    dlgBg.fillRoundedRect(-320, -35, 640, 70, 12);
    dlgBg.lineStyle(2, 0xf59e0b, 1);
    dlgBg.strokeRoundedRect(-320, -35, 640, 70, 12);
    this.dialogText = this.add.text(0, 0, '', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '15px',
      color: '#f8fafc',
      align: 'center'
    }).setOrigin(0.5);
    this.dialogBox.add([dlgBg, this.dialogText]);
  }

  createTextures() {
    // Explorer
    if (!this.textures.exists('explorer')) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0x1d4ed8, 1);
      g.fillRoundedRect(6, 10, 20, 22, 4);
      g.fillStyle(0x78350f, 1);
      g.fillCircle(16, 7, 7);
      g.fillStyle(0xfde047, 1);
      g.fillCircle(16, 5, 4); // Scholar Turban
      g.generateTexture('explorer', 32, 36);
      g.destroy();
    }

    // NPC Elder
    if (!this.textures.exists('npc')) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0x047857, 1);
      g.fillRoundedRect(6, 10, 20, 22, 4);
      g.fillStyle(0x78350f, 1);
      g.fillCircle(16, 7, 7);
      g.fillStyle(0xffffff, 1);
      g.fillTriangle(12, 14, 20, 14, 16, 24); // White beard
      g.generateTexture('npc', 32, 36);
      g.destroy();
    }

    // Scroll
    if (!this.textures.exists('scroll')) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xfef08a, 1);
      g.fillRoundedRect(4, 6, 16, 12, 2);
      g.fillStyle(0xd97706, 1);
      g.fillRect(8, 9, 8, 2);
      g.fillRect(8, 13, 8, 2);
      g.generateTexture('scroll', 24, 24);
      g.destroy();
    }
  }

  createBuilding(x, y, w, h, label) {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x78350f, 1);
    g.fillRoundedRect(0, 0, w, h, 8);
    // Wooden beams protruding (traditional Sudano-Sahelian architecture)
    g.fillStyle(0x451a03, 1);
    for (let bx = 16; bx < w; bx += 24) {
      g.fillRect(bx, 10, 6, 4);
      g.fillRect(bx, 40, 6, 4);
      g.fillRect(bx, 70, 6, 4);
    }
    // Arched door
    g.fillStyle(0x27170e, 1);
    g.fillRoundedRect(w / 2 - 14, h - 36, 28, 36, 6);
    const key = 'bldg-' + x + '-' + y;
    g.generateTexture(key, w, h);
    g.destroy();

    this.buildings.create(x, y, key);
    this.add.text(x, y - h / 2 - 12, label, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '12px',
      color: '#fde047',
      backgroundColor: '#00000088',
      padding: { x: 4, y: 2 }
    }).setOrigin(0.5);
  }

  update() {
    const vInput = window.virtualInput || {};
    const left = this.cursors.left.isDown || this.wasd.A.isDown || vInput.left;
    const right = this.cursors.right.isDown || this.wasd.D.isDown || vInput.right;
    const up = this.cursors.up.isDown || this.wasd.W.isDown || vInput.up;
    const down = this.cursors.down.isDown || this.wasd.S.isDown || vInput.down;

    const speed = 180;
    this.player.setVelocity(0);

    if (left) this.player.setVelocityX(-speed);
    else if (right) this.player.setVelocityX(speed);

    if (up) this.player.setVelocityY(-speed);
    else if (down) this.player.setVelocityY(speed);

    this.player.body.velocity.normalize().scale(speed);
  }

  collectScroll(player, scroll) {
    scroll.disableBody(true, true);
    this.scrollsFound++;
    this.hudText.setText('TIMBUKTU SCROLLS: ' + this.scrollsFound + ' / ' + this.totalScrolls);
    this.showDialog('Discovered an ancient astronomy treatise! (' + this.scrollsFound + '/' + this.totalScrolls + ')');

    if (this.scrollsFound >= this.totalScrolls) {
      this.time.delayedCall(2000, () => {
        this.showDialog('MASTER SCHOLAR! You have restored the Timbuktu Archives!');
      });
    }
  }

  talkToElder() {
    if (this.scrollsFound >= this.totalScrolls) {
      this.showDialog('Grand Elder: "Blessings! The lost wisdom of astronomy, mathematics and law is safe!"');
    } else {
      this.showDialog('Grand Elder: "Welcome young scholar! Search the 4 corners of the market for the lost manuscripts."');
    }
  }

  showDialog(text) {
    this.dialogText.setText(text);
    this.dialogBox.setAlpha(1);
    if (this.dialogTimer) this.dialogTimer.remove();
    this.dialogTimer = this.time.delayedCall(3500, () => {
      this.dialogBox.setAlpha(0);
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
          name: projectName || 'mali-chronicles-rpg',
          version: '1.0.0',
          private: true,
          dependencies: { phaser: '^3.80.1' },
        },
        null,
        2,
      ),
    },
  ],
};
