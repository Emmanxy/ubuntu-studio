import { GameTemplate, ProjectFile } from '../types';

export const educationalTemplate: GameTemplate = {
  id: 'educational',
  name: 'Kingdoms of Africa: History Curator',
  type: 'educational',
  iconName: 'GraduationCap',
  badge: 'Cultural Trivia & Museum',
  description: 'Interactive cultural curation game where players answer history questions, identify relics from ancient civilizations (Nubia, Mali, Great Zimbabwe, Benin, Axum), and build their museum.',
  samplePrompts: [
    'Create an educational trivia quiz about African history and empires.',
    'Add historical artifact exhibitions with unlockable cards.',
    'Add sound effects and a mastery badge reward system.',
  ],
  culturalInspiration: 'Celebrates the architectural, metallurgical, and philosophical achievements of Great Zimbabwe, Kush, Axum, Mali, and the Kingdom of Benin.',
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
    backgroundColor: '#0c0a09',
    scaleMode: 'FIT',
  },
  createFiles: (projectName: string, title: string): ProjectFile[] => [
    {
      id: 'main-js',
      path: 'src/main.js',
      name: 'main.js',
      language: 'javascript',
      content: `// Ubuntu Studio - African Kingdoms History Curator
import { CuratorScene } from './scenes/CuratorScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 800,
  height: 450,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  backgroundColor: '#0c0a09',
  scene: [CuratorScene]
};

window.game = new Phaser.Game(config);
`,
    },
    {
      id: 'curator-scene-js',
      path: 'src/scenes/CuratorScene.js',
      name: 'CuratorScene.js',
      language: 'javascript',
      content: `// CuratorScene: Trivia questions, museum exhibition gallery, score tracking
export class CuratorScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CuratorScene' });
  }

  create() {
    this.score = 0;
    this.currentQuestion = 0;
    this.artifactsUnlocked = 0;

    this.questions = [
      {
        question: "Which ancient civilization built monumental stone palaces and the Conical Tower without mortar in Southern Africa?",
        options: ["Kingdom of Kush", "Great Zimbabwe", "Songhai Empire", "Kingdom of Axum"],
        answer: 1,
        fact: "Great Zimbabwe was a thriving medieval metropolis famous for stone masonry, gold trading, and bird monoliths!"
      },
      {
        question: "Who was the legendary 14th-century ruler of the Mali Empire famed for expanding the University of Timbuktu?",
        options: ["Mansa Musa", "Shaka Zulu", "Queen Amina", "Sunni Ali"],
        answer: 0,
        fact: "Mansa Musa journeyed to Mecca in 1324 and established Mali as a premier center of global learning and wealth!"
      },
      {
        question: "The Kingdom of Benin in West Africa was renowned worldwide for its master craftsmen working in what medium?",
        options: ["Bronze and Brass Reliefs", "Marble Sculptures", "Ice Carvings", "Papyrus Scrolls"],
        answer: 0,
        fact: "Benin Bronzes are celebrated masterworks of lost-wax casting dating back over 700 years!"
      },
      {
        question: "Which ancient Horn of Africa empire had its own written script (Ge'ez) and minted its own international coins?",
        options: ["Kingdom of Axum", "Carthaginian Republic", "Ashanti Empire", "Dahomey"],
        answer: 0,
        fact: "Axum was described by Mani as one of the four great powers of the ancient world alongside Rome and Persia!"
      }
    ];

    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0c0a09, 0x1c1917, 0x292524, 0x0c0a09, 1);
    bg.fillRect(0, 0, 800, 450);

    // Header
    this.add.text(400, 30, '🏛️ KINGDOMS OF AFRICA: HISTORY CURATOR', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#fde047'
    }).setOrigin(0.5);

    this.scoreText = this.add.text(400, 60, 'CURATOR SCORE: 0  |  ARTIFACTS RESTORED: 0 / ' + this.questions.length, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '14px',
      color: '#38bdf8'
    }).setOrigin(0.5);

    this.displayQuestion();
  }

  displayQuestion() {
    if (this.questionElements) {
      this.questionElements.forEach(el => el.destroy());
    }
    this.questionElements = [];

    if (this.currentQuestion >= this.questions.length) {
      this.showFinalCelebration();
      return;
    }

    const q = this.questions[this.currentQuestion];

    // Question Box
    const qBox = this.add.graphics();
    qBox.fillStyle(0x1e293b, 0.9);
    qBox.fillRoundedRect(80, 90, 640, 90, 12);
    qBox.lineStyle(2, 0xf59e0b, 1);
    qBox.strokeRoundedRect(80, 90, 640, 90, 12);
    this.questionElements.push(qBox);

    const qText = this.add.text(400, 135, 'Q' + (this.currentQuestion + 1) + ': ' + q.question, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '16px',
      fontWeight: '600',
      color: '#f8fafc',
      align: 'center',
      wordWrap: { width: 600 }
    }).setOrigin(0.5);
    this.questionElements.push(qText);

    // 4 Option Buttons (2x2 grid)
    const positions = [
      { x: 230, y: 225 },
      { x: 570, y: 225 },
      { x: 230, y: 300 },
      { x: 570, y: 300 }
    ];

    q.options.forEach((opt, idx) => {
      const pos = positions[idx];
      const btn = this.add.graphics();
      btn.fillStyle(0x334155, 1);
      btn.fillRoundedRect(pos.x - 150, pos.y - 25, 300, 50, 8);
      btn.lineStyle(1, 0x64748b, 1);
      btn.strokeRoundedRect(pos.x - 150, pos.y - 25, 300, 50, 8);
      this.questionElements.push(btn);

      const txt = this.add.text(pos.x, pos.y, opt, {
        fontFamily: 'Outfit, sans-serif',
        fontSize: '15px',
        fontWeight: 'bold',
        color: '#fde047'
      }).setOrigin(0.5);
      this.questionElements.push(txt);

      const hitZone = this.add.zone(pos.x, pos.y, 300, 50).setOrigin(0.5).setInteractive({ cursor: 'pointer' });
      hitZone.on('pointerdown', () => this.handleAnswer(idx, q, btn));
      this.questionElements.push(hitZone);
    });
  }

  handleAnswer(selectedIdx, questionData, buttonGraphic) {
    const isCorrect = selectedIdx === questionData.answer;

    if (isCorrect) {
      this.score += 250;
      this.artifactsUnlocked++;
      buttonGraphic.fillStyle(0x16a34a, 1);
      buttonGraphic.fillRoundedRect(buttonGraphic.x - 150, buttonGraphic.y - 25, 300, 50, 8);
      this.showFactModal(true, questionData.fact);
    } else {
      buttonGraphic.fillStyle(0xdc2626, 1);
      buttonGraphic.fillRoundedRect(buttonGraphic.x - 150, buttonGraphic.y - 25, 300, 50, 8);
      this.showFactModal(false, questionData.fact);
    }

    this.scoreText.setText('CURATOR SCORE: ' + this.score + '  |  ARTIFACTS RESTORED: ' + this.artifactsUnlocked + ' / ' + this.questions.length);
  }

  showFactModal(isCorrect, factText) {
    const modal = this.add.container(400, 390);
    const bg = this.add.graphics();
    bg.fillStyle(isCorrect ? 0x064e3b : 0x7f1d1d, 0.95);
    bg.fillRoundedRect(-320, -35, 640, 70, 10);
    bg.lineStyle(2, isCorrect ? 0x22c55e : 0xef4444, 1);
    bg.strokeRoundedRect(-320, -35, 640, 70, 10);

    const txt = this.add.text(0, 0, (isCorrect ? '✅ CORRECT! ' : '❌ FACT: ') + factText, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '13px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 610 }
    }).setOrigin(0.5);

    modal.add([bg, txt]);

    this.time.delayedCall(3000, () => {
      modal.destroy();
      this.currentQuestion++;
      this.displayQuestion();
    });
  }

  showFinalCelebration() {
    this.add.text(400, 200, '🎉 MASTER CURATOR CERTIFIED! 🎉\\nFinal Score: ' + this.score + '\\n\\nYou have restored the African Civilizations Grand Hall!', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '24px',
      fontWeight: '800',
      color: '#fde047',
      backgroundColor: '#0f172ae6',
      padding: { x: 24, y: 20 },
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(400, 360, 'Tap or Press R to Play Again', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '16px',
      color: '#38bdf8'
    }).setOrigin(0.5);

    this.input.once('pointerdown', () => this.scene.restart());
    this.input.keyboard.once('keydown-R', () => this.scene.restart());
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
          name: projectName || 'african-history-curator',
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
