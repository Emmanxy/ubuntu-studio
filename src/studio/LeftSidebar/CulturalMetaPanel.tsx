import React from 'react';
import { Globe, Sparkles, HeartHandshake, BookOpen } from 'lucide-react';
import { CulturalMeta } from '../../types';

interface CulturalMetaPanelProps {
  culturalMeta?: CulturalMeta;
  onChange: (meta: CulturalMeta) => void;
}

export const CulturalMetaPanel: React.FC<CulturalMetaPanelProps> = ({
  culturalMeta,
  onChange,
}) => {
  const meta: CulturalMeta = culturalMeta || {};

  const update = <K extends keyof CulturalMeta>(key: K, val: CulturalMeta[K]) => {
    onChange({ ...meta, [key]: val });
  };

  return (
    <div className="flex flex-col h-full bg-[#181412] text-[#D4CCC4] select-none overflow-y-auto p-4 space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-[#3D2B1F] pb-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#FDFBF7]">
          <Globe className="w-4 h-4 text-[#F0B429]" />
          <span>African Heritage Context</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E95420]/15 text-[#E95420] font-semibold border border-[#E95420]/30">
          Heritage Day
        </span>
      </div>

      <div className="bg-[#241E1A] border border-[#3D2B1F] p-3 rounded-xl text-xs text-[#D4CCC4] leading-relaxed flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-[#F0B429] flex-shrink-0 mt-0.5" />
        <p>
          Celebrate South African & African heritage by grounding your game in real traditions, folklore, indigenous sports, and community values.
        </p>
      </div>

      {/* Region / Civilization */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-[#F0B429]">
          Culture, Kingdom or Region
        </label>
        <input
          type="text"
          placeholder="e.g. Zulu Kingdom, San Drakensberg, Great Zimbabwe, Xhosa, Sotho"
          value={meta.region || ''}
          onChange={(e) => update('region', e.target.value)}
          className="w-full bg-[#120F0D] border border-[#3D2B1F] text-[#FDFBF7] text-xs px-3 py-2 rounded-xl focus:border-[#E95420] outline-none placeholder-[#7A7067]"
        />
      </div>

      {/* Historical Topic / Tradition */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-[#F0B429]">
          Tradition or Story Theme
        </label>
        <textarea
          rows={3}
          placeholder="e.g. Traditional Nguni stick fighting (Intonga) celebrating athletic honor, bravery, and shield technique."
          value={meta.historicalTopic || ''}
          onChange={(e) => update('historicalTopic', e.target.value)}
          className="w-full bg-[#120F0D] border border-[#3D2B1F] text-[#FDFBF7] text-xs px-3 py-2 rounded-xl focus:border-[#E95420] outline-none resize-none placeholder-[#7A7067] leading-relaxed"
        />
      </div>

      {/* Ubuntu / Values Objective */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-[#F0B429] flex items-center gap-1">
          <HeartHandshake className="w-3.5 h-3.5 text-[#E95420]" />
          <span>Ubuntu Value / Experience</span>
        </label>
        <textarea
          rows={2}
          placeholder="e.g. Teach players about cooperation, sharing community harvests, or the strategy of ancient stone games."
          value={meta.educationalGoal || ''}
          onChange={(e) => update('educationalGoal', e.target.value)}
          className="w-full bg-[#120F0D] border border-[#3D2B1F] text-[#FDFBF7] text-xs px-3 py-2 rounded-xl focus:border-[#E95420] outline-none resize-none placeholder-[#7A7067] leading-relaxed"
        />
      </div>

      {/* Language / Indigenous Terms */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-[#F0B429]">
          Indigenous Terms & Words
        </label>
        <input
          type="text"
          placeholder="e.g. Isihlangu (Cowhide shield), Induku (Fighting stick), Morabaraba"
          value={meta.languageElements || ''}
          onChange={(e) => update('languageElements', e.target.value)}
          className="w-full bg-[#120F0D] border border-[#3D2B1F] text-[#FDFBF7] text-xs px-3 py-2 rounded-xl focus:border-[#E95420] outline-none placeholder-[#7A7067]"
        />
      </div>
    </div>
  );
};
