import { GameTemplate, GameType } from '../types';
import { platformerTemplate } from './platformer';
import { fightingTemplate } from './fighting';
import { boardGameTemplate } from './boardGame';
import { puzzleTemplate } from './puzzle';
import { adventureTemplate } from './adventure';
import { educationalTemplate } from './educational';

export const GAME_TEMPLATES: Record<string, GameTemplate> = {
  platformer: platformerTemplate,
  fighting: fightingTemplate,
  'board-game': boardGameTemplate,
  puzzle: puzzleTemplate,
  adventure: adventureTemplate,
  educational: educationalTemplate,
};

export const TEMPLATE_LIST: GameTemplate[] = Object.values(GAME_TEMPLATES);

export function detectTemplateFromPrompt(prompt: string): GameTemplate {
  const p = prompt.toLowerCase();

  if (
    p.includes('fight') ||
    p.includes('warrior') ||
    p.includes('shield') ||
    p.includes('stick') ||
    p.includes('combat') ||
    p.includes('duel') ||
    p.includes('battle') ||
    p.includes('zulu') ||
    p.includes('intonga') ||
    p.includes('martial')
  ) {
    return fightingTemplate;
  }
  if (
    p.includes('board') ||
    p.includes('ncuva') ||
    p.includes('mancala') ||
    p.includes('morabaraba') ||
    p.includes('bao') ||
    p.includes('turn-based') ||
    p.includes('stone') ||
    p.includes('mill')
  ) {
    return boardGameTemplate;
  }
  if (
    p.includes('puzzle') ||
    p.includes('match') ||
    p.includes('slide') ||
    p.includes('glyph') ||
    p.includes('tile') ||
    p.includes('rock art') ||
    p.includes('san') ||
    p.includes('relic')
  ) {
    return puzzleTemplate;
  }
  if (
    p.includes('rpg') ||
    p.includes('adventure') ||
    p.includes('explore') ||
    p.includes('village') ||
    p.includes('quest') ||
    p.includes('dialogue') ||
    p.includes('scroll') ||
    p.includes('ubuntu') ||
    p.includes('community')
  ) {
    return adventureTemplate;
  }
  if (
    p.includes('quiz') ||
    p.includes('trivia') ||
    p.includes('curator') ||
    p.includes('history') ||
    p.includes('educational') ||
    p.includes('museum') ||
    p.includes('school') ||
    p.includes('kingdom')
  ) {
    return educationalTemplate;
  }

  // Default to savannah / platformer
  return platformerTemplate;
}

export function getTemplateById(id: string): GameTemplate {
  return GAME_TEMPLATES[id] || platformerTemplate;
}
