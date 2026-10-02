export type GameType =
  | 'platformer'
  | 'fighting'
  | 'board-game'
  | 'puzzle'
  | 'adventure'
  | 'educational'
  | 'racing'
  | 'custom';

export type DeviceMode = 'desktop' | 'tablet' | 'mobile-portrait' | 'mobile-landscape';

export interface ProjectFile {
  id: string;
  path: string; // e.g. "src/scenes/GameScene.js"
  name: string;
  content: string;
  language: 'javascript' | 'json' | 'markdown' | 'html' | 'css' | 'image' | 'audio';
  isFolder?: boolean;
  isAsset?: boolean;
  assetType?: 'character' | 'background' | 'environment' | 'effect' | 'audio' | 'ui';
  assetDataUrl?: string;
  size?: number;
  lastModified?: number;
}

export interface GameSettings {
  canvasWidth: number;
  canvasHeight: number;
  orientation: 'landscape' | 'portrait' | 'auto';
  gravityY: number;
  physicsType: 'arcade' | 'matter' | 'none';
  debug: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  mobileControls: boolean;
  fpsLimit: number;
  difficulty: 'easy' | 'normal' | 'hard' | 'adaptive';
  backgroundColor: string;
  scaleMode: 'FIT' | 'RESIZE' | 'NONE';
}

export interface CulturalMeta {
  culture?: string;
  region?: string;
  historicalTopic?: string;
  educationalObjective?: string;
  educationalGoal?: string;
  language?: string;
  languageElements?: string;
  tags?: string[];
}

export interface VirtualInputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  jump: boolean;
  actionA: boolean;
  actionB: boolean;
}

export interface PublishData {
  isPublished: boolean;
  publishedAt?: string;
  publicSlug: string;
  creatorName: string;
  category: string;
  tags: string[];
  thumbnail?: string;
  shortDescription?: string;
  controlsGuide?: string;
  playsCount: number;
  likesCount: number;
}

export interface VersionSnapshot {
  id: string;
  versionNumber: number;
  timestamp: number;
  description: string;
  files: ProjectFile[];
  settings?: GameSettings;
  trigger: 'ai_generate' | 'ai_edit' | 'ai_debug' | 'manual_save' | 'restore';
}

export interface GameProject {
  id: string;
  name: string;
  title: string;
  description: string;
  gameType: GameType;
  templateType: string;
  createdAt: number;
  updatedAt: number;
  files: ProjectFile[];
  settings: GameSettings;
  culturalMeta: CulturalMeta;
  publishData: PublishData;
  versions: VersionSnapshot[];
  currentVersion: number;
  activeFilePath?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: number;
  explanation?: string;
  modifiedFiles?: {
    path: string;
    action: 'modify' | 'create' | 'delete';
    content?: string;
  }[];
  suggestedPrompts?: string[];
  status?: 'pending' | 'success' | 'error';
  errorDetails?: string;
  versionId?: string;
}

export interface RuntimeError {
  message: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  stack?: string;
  timestamp: number;
}

export interface GameTemplate {
  id: string;
  name: string;
  type: GameType;
  iconName: string;
  badge: string;
  description: string;
  samplePrompts: string[];
  culturalInspiration?: string;
  defaultSettings: Partial<GameSettings>;
  createFiles: (projectName: string, title: string) => ProjectFile[];
}
