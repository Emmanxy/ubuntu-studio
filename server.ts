import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));

// Lazy Gemini client helper
let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not configured');
    }
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

/**
 * Model Cascade for High Availability:
 * 1. gemini-3.8-flash: Primary high-efficiency Flash model
 * 2. gemini-flash-latest: Stable flash alias
 * 3. gemini-3.1-flash-lite: Ultra-lightweight fallback model with high availability
 */
const MODEL_CASCADE = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

interface GeminiCascadeOptions {
  contents: string;
  systemInstruction?: string;
  responseMimeType?: string;
  temperature?: number;
}

async function callGeminiWithCascade(options: GeminiCascadeOptions) {
  const ai = getGemini();
  let lastError: any = null;

  for (let i = 0; i < MODEL_CASCADE.length; i++) {
    const model = MODEL_CASCADE[i];
    // Attempt up to 2 times for each model if experiencing 503 or 429
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[Gemini Cascade] Invoking ${model} (attempt ${attempt})...`);
        const response = await ai.models.generateContent({
          model,
          contents: options.contents,
          config: {
            systemInstruction: options.systemInstruction,
            responseMimeType: (options.responseMimeType as any) || 'application/json',
            temperature: options.temperature ?? 0.7,
          },
        });
        return { response, usedModel: model };
      } catch (err: any) {
        lastError = err;
        const errMsg = String(err?.message || err);
        const status = err?.status || err?.code || '';
        const isUnavailable = errMsg.includes('503') || errMsg.includes('UNAVAILABLE') || errMsg.includes('high demand');
        const isRateLimited = errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED');
        const isTransient = isUnavailable || isRateLimited || String(status) === '503';

        console.warn(`[Gemini Cascade] Model ${model} (attempt ${attempt}) returned error: ${errMsg}`);

        if (isTransient && attempt < 2) {
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }

        // Try next model in cascade
        break;
      }
    }
  }

  throw lastError;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// API: Generate full game from prompt & template
app.post('/api/gemini/generate-game', async (req, res) => {
  try {
    const { prompt, templateType, culturalMeta } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getGemini();

    const systemInstruction = `You are Ubuntu Studio's Senior 2D Game Architect and Heritage Game Engine Specialist.
Your task is to generate complete, fully playable, high quality 2D web games using Phaser 3 and standard JavaScript.

CORE GOALS:
1. AUTOMATIC ARCHITECTURE SELECTION:
   Analyze the user's natural language description and automatically determine the most engaging 2D game type (e.g., platformer, fighting/duel, board-game, puzzle, runner, adventure/RPG, or educational/trivia). The user never has to choose an engine archetype; you decide the best mechanics, physics, and scene flow.

2. HERITAGE DAY & AFRICAN CULTURAL INTEGRATION:
   Ubuntu Studio honors South African Heritage Day and African heritage broadly.
   Whenever the user mentions or hints at cultural themes (such as Zulu stick fighting / Intonga, San rock art & animal spirits, Morabaraba / Mancala / Ncuva, Great Zimbabwe, Mapungubwe, Mali chronicles, African wildlife, indigenous folklore, storytelling, or the Ubuntu philosophy "Umuntu ngumuntu ngabantu - I am because we are"), deeply weave these authentic themes into the story, visual motifs, and game mechanics. Even for general game requests, craft vibrant, tasteful, African-inspired color palettes (rich terracotta, warm gold #F0B429, Ubuntu orange #E95420, savannah earth, and vibrant beadwork patterns).

RULES:
1. Output MUST be valid JSON matching this schema:
{
  "projectName": "Short CamelCase or hyphenated name",
  "title": "Display Title",
  "description": "Engaging description of the game and its cultural heritage",
  "gameType": "platformer | fighting | board-game | puzzle | adventure | educational | runner | arcade",
  "mechanics": ["mechanic 1", "mechanic 2"],
  "controls": {
    "desktop": "Arrow keys / WASD to move, Space to jump/act",
    "mobile": "On-screen virtual controls and touch tap"
  },
  "culturalTheme": {
    "culture": "Cultural context or inspiration (e.g. South African Heritage / Zulu / San / African folklore)",
    "history": "Historical or cultural context explanation",
    "educationalObjective": "What players learn or experience through play"
  },
  "files": [
    {
      "path": "src/main.js",
      "content": "... JavaScript code ...",
      "description": "Main entry and Phaser Game configuration"
    },
    {
      "path": "src/scenes/BootScene.js",
      "content": "... JavaScript code ...",
      "description": "Asset loader and procedural textures with rich warm colors"
    },
    {
      "path": "src/scenes/GameScene.js",
      "content": "... JavaScript code ...",
      "description": "Main gameplay loop, physics, collisions, and scoring"
    },
    {
      "path": "src/scenes/UiScene.js",
      "content": "... JavaScript code ...",
      "description": "HUD, health bars, score, and mobile controls"
    },
    {
      "path": "package.json",
      "content": "... package.json string ...",
      "description": "Vite and Phaser 3 standalone project config"
    },
    {
      "path": "README.md",
      "content": "... Markdown documentation ...",
      "description": "How to run, play, and celebrate Heritage Day with the game"
    }
  ]
}

2. The code MUST run smoothly in Phaser 3.80+ with zero missing dependencies or external URLs.
3. Strict File Structure & Module Conventions:
   - Primary entry file MUST be 'src/main.js'. It must import scene classes (e.g. "import { BootScene } from './scenes/BootScene.js';") and configure scene: [BootScene, GameScene, UiScene].
   - Always instantiate the game and attach to window: 'const game = new Phaser.Game(config); window.game = game;'.
   - Scene files MUST reside in 'src/scenes/' (e.g. 'src/scenes/BootScene.js', 'src/scenes/GameScene.js', 'src/scenes/UiScene.js').
   - Every scene class MUST use a named export: 'export class GameScene extends Phaser.Scene { ... }'.
4. Zero External Assets (100% Procedural & Self-Contained):
   - NEVER use external image or audio URLs (no CDN images, no third-party audio files).
   - Generate all visual sprites procedurally using Phaser Graphics/Canvas (e.g. this.make.graphics() -> generateTexture('key', width, height)) in BootScene or create().
   - Generate all sound effects procedurally via Web Audio API AudioContext oscillators (e.g. jumps, hits, coins, victory chimes, tribal drums).
5. Dual Control Support:
   - Support standard Keyboard (cursors + WASD + Space) AND touch inputs via window.virtualInput (window.virtualInput.left, window.virtualInput.right, window.virtualInput.jump, etc.).
6. Instant Playability & Complete Loop:
   - The game must boot cleanly on frame 1 without waiting for external assets.
   - It must have clear objectives, scoring, health/lives, win/lose states, and seamless restart mechanics.`;

    const userPrompt = `Generate a complete, playable 2D Phaser 3 game project based on this creator's idea:
User Idea Description: "${prompt}"
Optional Cultural/Heritage Inspiration: ${JSON.stringify(culturalMeta || {})}

Automatically select the best game type, design rich procedural graphics with African warm tones (terracotta, gold, ochre, Ubuntu orange), implement full gameplay mechanics and sound effects, and return valid JSON!`;

    const { response, usedModel } = await callGeminiWithCascade({
      contents: userPrompt,
      systemInstruction,
      responseMimeType: 'application/json',
      temperature: 0.7,
    });

    const text = response.text || '{}';
    let gameProject;
    try {
      gameProject = JSON.parse(text);
    } catch (e) {
      // Fallback cleanup if markdown wrappers are present
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      gameProject = JSON.parse(cleaned);
    }

    res.json({ success: true, project: gameProject, model: usedModel });
  } catch (error: any) {
    console.warn('[Ubuntu Studio] Game generation notice:', error?.message || error);
    res.status(503).json({
      error: error?.message || 'Failed to generate game with Gemini. Please retry.',
    });
  }
});

// API: Context-aware AI Chat & Modification
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, project, history } = req.body;
    if (!message || !project) {
      return res.status(400).json({ error: 'Message and project context are required' });
    }

    const systemInstruction = `You are Ubuntu Studio's AI Game Development Assistant.
The user is working on an existing 2D Phaser 3 web game and wants to modify, improve, or expand it.

CRITICAL INSTRUCTIONS:
1. Inspect the existing project files.
2. DO NOT regenerate the entire project if only 1-2 files need modification.
3. Return ONLY the files that need to be created, modified, or deleted, plus a friendly explanation.
4. Output MUST be valid JSON matching this schema:
{
  "explanation": "Clear summary of what was added or changed and how it works",
  "modifiedFiles": [
    {
      "path": "src/scenes/GameScene.js",
      "content": "... FULL updated file content ...",
      "action": "modify" // "modify" | "create" | "delete"
    }
  ],
  "suggestedNextSteps": [
    "Add a boss fight",
    "Add power-ups",
    "Add leaderboard"
  ]
}
5. Preserve existing game logic and variables unless explicitly asked to replace them.`;

    // Construct project file summary
    const fileSummaries = (project.files || []).map((f: any) => `--- File: ${f.path} ---\n${f.content}\n`).join('\n');

    const promptText = `EXISTING PROJECT:
Name: ${project.name || project.title}
Game Type: ${project.gameType}
Description: ${project.description}

CURRENT PROJECT FILES:
${fileSummaries}

USER REQUEST:
"${message}"

Identify the exact changes required, update the relevant file(s) while keeping the rest intact, and output the response in JSON format.`;

    const { response, usedModel } = await callGeminiWithCascade({
      contents: promptText,
      systemInstruction,
      responseMimeType: 'application/json',
      temperature: 0.5,
    });

    const text = response.text || '{}';
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      result = JSON.parse(cleaned);
    }

    res.json({ success: true, result, model: usedModel });
  } catch (error: any) {
    console.warn('[Ubuntu Studio] AI modification notice:', error?.message || error);
    res.status(503).json({
      error: error?.message || 'Failed to process AI modification',
    });
  }
});

// API: AI Debugging & Auto-Repair
app.post('/api/gemini/debug', async (req, res) => {
  try {
    const { errorDetails, project, activeFilePath } = req.body;
    if (!errorDetails || !project) {
      return res.status(400).json({ error: 'Error details and project are required' });
    }

    const systemInstruction = `You are Ubuntu Studio's AI Game Debugger.
A runtime or syntax error occurred in a Phaser 3 game project.
Analyze the error message, stack trace, and project files, identify the exact bug, and return the fixed file(s).

Output JSON schema:
{
  "diagnosis": "Clear explanation of what went wrong and why",
  "solution": "How the issue was resolved",
  "modifiedFiles": [
    {
      "path": "src/scenes/GameScene.js",
      "content": "... FULL fixed file content ...",
      "action": "modify"
    }
  ]
}`;

    const filesText = (project.files || []).map((f: any) => `--- File: ${f.path} ---\n${f.content}\n`).join('\n');

    const promptText = `GAME RUNTIME/BUILD ERROR:
Error: ${errorDetails.message}
Location: ${errorDetails.filename || 'Unknown'} Line: ${errorDetails.lineno || 'N/A'}, Col: ${errorDetails.colno || 'N/A'}
Stack: ${errorDetails.stack || 'None'}
Active File: ${activeFilePath || 'N/A'}

PROJECT FILES:
${filesText}

Fix the bug in the appropriate file(s) and return the full corrected file content in JSON.`;

    const { response, usedModel } = await callGeminiWithCascade({
      contents: promptText,
      systemInstruction,
      responseMimeType: 'application/json',
      temperature: 0.3,
    });

    const text = response.text || '{}';
    let fixResult;
    try {
      fixResult = JSON.parse(text);
    } catch {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      fixResult = JSON.parse(cleaned);
    }

    res.json({ success: true, fix: fixResult, model: usedModel });
  } catch (error: any) {
    console.warn('[Ubuntu Studio] Game debugging notice:', error?.message || error);
    res.status(503).json({
      error: error?.message || 'Failed to debug game',
    });
  }
});

// Setup Vite middleware
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ubuntu Studio server running on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
});
