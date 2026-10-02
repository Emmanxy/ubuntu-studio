import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  ChevronDown,
  ChevronUp,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  CornerDownLeft,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { GameProject } from '../../types';

interface AiPanelProps {
  project: GameProject;
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  recentModifications?: { path: string; action: string }[];
}

export const AiPanel: React.FC<AiPanelProps> = ({
  project,
  onSendMessage,
  isLoading,
  isExpanded,
  onToggleExpand,
  recentModifications,
}) => {
  const [input, setInput] = useState('');

  // Quick suggestion chips based on game type
  const getSuggestions = () => {
    switch (project.gameType) {
      case 'fighting':
        return [
          'Add a heavy spinning attack',
          'Make AI warrior block more when HP < 30%',
          'Add a stamina bar for shielding',
          'Add a victory drum rhythm',
        ];
      case 'board-game':
        return [
          'Add a 3-second turn countdown timer',
          'Add gold particle animations on captures',
          'Add a Hard AI heuristic algorithm',
        ];
      case 'puzzle':
        return [
          'Add a 60-second time rush countdown',
          'Create a 4-match bomb explosion effect',
          'Add combo score multipliers (2x, 3x)',
        ];
      case 'adventure':
        return [
          'Add a trading merchant NPC',
          'Add a desert sandstorm weather effect',
          'Add a secret treasure chest puzzle',
        ];
      case 'educational':
        return [
          'Add 3 more questions about Great Zimbabwe',
          'Add a mastery certificate popup',
          'Add voice sound effect on correct answers',
        ];
      case 'platformer':
      default:
        return [
          'Make player jump 20% higher',
          'Add flying eagle obstacles',
          'Add coin collection sound synthesizer',
          'Add moving floating platforms',
        ];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const msg = input.trim();
    setInput('');
    onSendMessage(msg);
  };

  const handleChipClick = (suggestion: string) => {
    if (isLoading) return;
    onSendMessage(suggestion);
  };

  return (
    <div className={`bg-[#18181B] border-t border-[#27272A] flex flex-col select-none transition-all duration-300 ${
      isExpanded ? 'h-60' : 'h-12'
    }`}>
      {/* Header bar */}
      <div
        onClick={onToggleExpand}
        className="h-12 px-3.5 flex items-center justify-between cursor-pointer hover:bg-[#27272A] transition-colors border-b border-[#27272A]"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-[#E95420]/15 border border-[#E95420]/30 flex items-center justify-center text-[#E95420]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F4F4F5]">Ubuntu Gemini Game Architect</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#E95420]/15 text-[#E95420] border border-[#E95420]/30 font-semibold">
                Natural Language Coder
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isLoading && (
            <div className="flex items-center gap-1.5 text-xs text-[#E95420] font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Architecting Game...</span>
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            className="p-1 text-[#A1A1AA] hover:text-white rounded"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Content Area */}
      {isExpanded && (
        <div className="flex-1 p-3 flex flex-col justify-between overflow-hidden bg-[#0F0F12]">
          {/* Suggestion Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
            <div className="flex items-center gap-1 text-[11px] text-[#71717A] whitespace-nowrap mr-1">
              <Lightbulb className="w-3.5 h-3.5 text-[#E95420]" />
              <span>Try:</span>
            </div>
            {getSuggestions().map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(chip)}
                disabled={isLoading}
                className="whitespace-nowrap text-xs bg-[#27272A] hover:bg-[#3F3F46] text-[#D4D4D8] hover:text-[#E95420] border border-[#3F3F46]/60 px-2.5 py-1 rounded-md transition-colors flex-shrink-0 disabled:opacity-50"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Input Field */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-auto">
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. Add a double jump ability with gold dust particle effects..."
                disabled={isLoading}
                className="w-full bg-[#18181B] border border-[#27272A] focus:border-[#E95420] text-[#F4F4F5] placeholder-[#71717A] rounded-md px-3.5 py-2 text-xs outline-none transition-colors pr-10"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 bg-[#E95420] hover:bg-[#d94514] text-white rounded disabled:opacity-40 transition-all shadow-sm"
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
