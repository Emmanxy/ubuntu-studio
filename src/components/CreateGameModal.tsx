import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Wand2,
  Globe,
  Loader2,
  Lightbulb,
} from 'lucide-react';

interface CreateGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGame: (prompt: string, culturalMeta?: any) => Promise<void>;
  isGenerating: boolean;
}

const HERITAGE_PROMPT_INSPIRATIONS = [
  {
    label: 'Zulu Stick & Shield Duel',
    prompt: 'A traditional 2D African martial arts duel where two warriors face off with cowhide shields and fighting sticks, featuring timing-based blocks, strikes, and energetic crowd cheers.',
    cultural: 'Nguni & Zulu traditional stick fighting (Intonga) celebrating athletic skill, discipline, and cultural heritage.',
  },
  {
    label: 'Savannah Artifact Runner',
    prompt: 'A fast-paced endless runner through golden savannah grass under an acacia tree sunset, collecting ancient golden beads and jumping over rock formations and wildlife.',
    cultural: 'African savannah wildlife & archaeology celebrating ancient trade bead artifacts of Mapungubwe.',
  },
  {
    label: 'San Rock Art Spirit Quest',
    prompt: 'A mystical 2D puzzle adventure where players guide an eland spirit animal across red sandstone cliffs to illuminate ancient San rock art glyphs and bring rain to the desert.',
    cultural: 'Drakensberg and Kalahari San rock art, mythology, and reverence for nature and rainmaking.',
  },
  {
    label: 'Morabaraba Traditional Board',
    prompt: 'A turn-based 2D board game inspired by traditional African alignment games like Morabaraba and Mancala, where players place stones to form mills and outsmart an AI opponent.',
    cultural: 'Morabaraba & Mancala / Ncuva: ancient African strategy games played across generations.',
  },
  {
    label: 'Ubuntu Village Harmony',
    prompt: 'A heartwarming community builder game where villagers cooperate to harvest crops, share clean water, and build a community pavilion embodying "I am because we are".',
    cultural: 'The philosophy of Ubuntu ("Umuntu ngumuntu ngabantu") — unity, community care, and shared prosperity.',
  },
];

export const CreateGameModal: React.FC<CreateGameModalProps> = ({
  isOpen,
  onClose,
  onCreateGame,
  isGenerating,
}) => {
  const [prompt, setPrompt] = useState('');
  const [culturalTopic, setCulturalTopic] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    onCreateGame(
      prompt.trim(),
      culturalTopic ? { historicalTopic: culturalTopic } : undefined,
    );
  };

  const handleSelectInspiration = (item: typeof HERITAGE_PROMPT_INSPIRATIONS[0]) => {
    setPrompt(item.prompt);
    setCulturalTopic(item.cultural);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#181412] border border-[#3D2B1F] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Warm Header */}
        <div className="px-6 py-4 border-b border-[#3D2B1F] flex items-center justify-between bg-[#201A16]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#E95420] to-[#F0B429] flex items-center justify-center text-white shadow-md shadow-[#E95420]/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#FDFBF7]">Create New 2D Game</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F0B429]/15 text-[#F0B429] font-medium border border-[#F0B429]/30">
                  Heritage Day
                </span>
              </div>
              <p className="text-xs text-[#D4CCC4]">Describe your idea in plain language — AI builds the full game</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-1.5 text-[#A89F91] hover:text-[#FDFBF7] rounded-lg hover:bg-[#2F2620] transition-colors disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Natural Language Description Area */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#E95420] flex items-center gap-1.5">
              <Wand2 className="w-4 h-4" />
              <span>Describe the game you want to make...</span>
            </label>
            <textarea
              rows={4}
              required
              autoFocus
              placeholder="e.g. A vibrant 2D game where a runner dashes through an African savannah at sunset, leaping over acacia thorn bushes and gathering ancient artifacts..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              className="w-full bg-[#120F0D] border border-[#3D2B1F] focus:border-[#E95420] text-[#FDFBF7] placeholder-[#7A7067] rounded-xl p-3.5 text-sm outline-none transition-all resize-none leading-relaxed shadow-inner"
            />
          </div>

          {/* Quick Heritage Inspirations */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-[#F0B429] font-semibold">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Heritage Day Inspirations (Click to use)</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {HERITAGE_PROMPT_INSPIRATIONS.map((item, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleSelectInspiration(item)}
                  disabled={isGenerating}
                  className="px-2.5 py-1 text-xs rounded-lg bg-[#241E1A] hover:bg-[#342921] text-[#D4CCC4] hover:text-[#FDFBF7] border border-[#3D2B1F] hover:border-[#F0B429]/50 transition-colors text-left"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cultural / Heritage Context Field (Optional) */}
          <div className="space-y-2 pt-2 border-t border-[#3D2B1F]">
            <label className="text-xs font-semibold text-[#D4CCC4] flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#F0B429]" />
              <span>Cultural / Heritage Day Context <span className="text-[#A89F91] font-normal">(Optional)</span></span>
            </label>
            <input
              type="text"
              placeholder="e.g. Inspired by Zulu stick fighting, San rock art, Ubuntu philosophy, etc."
              value={culturalTopic}
              onChange={(e) => setCulturalTopic(e.target.value)}
              disabled={isGenerating}
              className="w-full bg-[#120F0D] border border-[#3D2B1F] focus:border-[#F0B429] text-[#FDFBF7] text-xs px-3.5 py-2.5 rounded-xl outline-none placeholder-[#7A7067] transition-colors"
            />
            <p className="text-[11px] text-[#A89F91] leading-normal">
              Gemini will weave traditional music, authentic storytelling, and symbolic motifs directly into your game.
            </p>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!prompt.trim() || isGenerating}
              className="w-full py-3.5 px-5 bg-gradient-to-r from-[#E95420] via-[#F0B429] to-[#E95420] bg-[length:200%_auto] hover:bg-right text-white font-bold text-sm rounded-xl shadow-lg shadow-[#E95420]/25 transition-all flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Creating your game with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Create with AI</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-[#8C8276] mt-2">
              No engine configuration needed. AI automatically chooses the architecture and generates all Phaser 3 scenes.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
