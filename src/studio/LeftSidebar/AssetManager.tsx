import React, { useState } from 'react';
import {
  Sparkles,
  Upload,
  Music,
  Image as ImageIcon,
  Play,
  Copy,
  Check,
  Plus,
  Layers,
  Wand2,
} from 'lucide-react';
import { ProjectFile } from '../../types';

interface AssetManagerProps {
  files: ProjectFile[];
  onInsertAssetCode: (codeSnippet: string) => void;
}

export const AssetManager: React.FC<AssetManagerProps> = ({
  files,
  onInsertAssetCode,
}) => {
  const [activeTab, setActiveTab] = useState<'sprites' | 'audio' | 'generator'>('sprites');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewSound, setPreviewSound] = useState<string | null>(null);

  // Procedural Sprite Catalog
  const proceduralAssets = [
    {
      id: 'warrior-player',
      name: 'Nguni Warrior (Player)',
      category: 'Characters',
      colors: ['#b45309', '#f59e0b', '#fde047'],
      code: `// Create Player Warrior Texture\nconst g = this.make.graphics({ x: 0, y: 0, add: false });\ng.fillStyle(0xb45309, 1);\ng.fillRoundedRect(10, 16, 20, 30, 4);\ng.fillStyle(0x78350f, 1);\ng.fillCircle(20, 10, 9);\ng.fillStyle(0xf59e0b, 1);\ng.fillRect(12, 6, 16, 4);\ng.generateTexture('warrior-player', 48, 56);\ng.destroy();`,
    },
    {
      id: 'warrior-shield',
      name: 'Isihlangu Cowhide Shield',
      category: 'Equipment',
      colors: ['#fef08a', '#78350f'],
      code: `// Create Isihlangu Shield Texture\nconst g = this.make.graphics({ x: 0, y: 0, add: false });\ng.fillStyle(0xfef08a, 1);\ng.fillEllipse(16, 24, 12, 22);\ng.fillStyle(0x78350f, 1);\ng.fillEllipse(16, 24, 6, 14);\ng.generateTexture('shield-isihlangu', 32, 48);\ng.destroy();`,
    },
    {
      id: 'cowrie-coin',
      name: 'Golden Cowrie Shell',
      category: 'Collectibles',
      colors: ['#fde047', '#d97706'],
      code: `// Create Golden Cowrie Shell\nconst g = this.make.graphics({ x: 0, y: 0, add: false });\ng.fillStyle(0xfde047, 1);\ng.fillEllipse(12, 12, 10, 8);\ng.fillStyle(0xb45309, 1);\ng.fillRect(7, 11, 10, 2);\ng.generateTexture('cowrie-shell', 24, 24);\ng.destroy();`,
    },
    {
      id: 'acacia-tree',
      name: 'Savannah Acacia Tree',
      category: 'Environment',
      colors: ['#15803d', '#78350f'],
      code: `// Create Acacia Tree Silhouette\nconst g = this.make.graphics({ x: 0, y: 0, add: false });\ng.fillStyle(0x78350f, 1);\ng.fillRect(45, 40, 10, 60);\ng.fillStyle(0x15803d, 1);\ng.fillEllipse(50, 30, 45, 16);\ng.fillEllipse(50, 20, 30, 12);\ng.generateTexture('acacia-tree', 100, 100);\ng.destroy();`,
    },
    {
      id: 'glyph-relic',
      name: 'Kalahari Sun Glyph',
      category: 'Relics',
      colors: ['#ef4444', '#f59e0b'],
      code: `// Create Sun Glyph Relic\nconst g = this.make.graphics({ x: 0, y: 0, add: false });\ng.fillStyle(0xef4444, 1);\ng.fillRoundedRect(4, 4, 44, 44, 8);\ng.fillStyle(0xfde047, 1);\ng.fillCircle(26, 26, 12);\ng.generateTexture('glyph-sun', 52, 52);\ng.destroy();`,
    },
  ];

  // Procedural Sound Catalog
  const soundEffects = [
    { id: 'jump', name: 'African Drum Jump (Djembe)', freq: '220Hz -> 480Hz', type: 'drum-jump' },
    { id: 'coin', name: 'Cowrie Bell Chime', freq: '659Hz -> 880Hz', type: 'bell-chime' },
    { id: 'shield', name: 'Shield Deflect Thud', freq: '300Hz -> 800Hz', type: 'shield-thud' },
    { id: 'victory', name: 'Kalimba Fanfare', freq: '440/554/659/880Hz', type: 'kalimba-chord' },
  ];

  const playSynthesizedSound = (type: string) => {
    try {
      const ctx = window.AudioContext ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;
      if (!ctx) return;
      const now = ctx.currentTime;
      setPreviewSound(type);

      if (type === 'drum-jump') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(380, now + 0.12);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'bell-chime') {
        [659, 880].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + i * 0.08);
          gain.gain.setValueAtTime(0.2, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.2);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.2);
        });
      } else if (type === 'shield-thud') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'kalimba-chord') {
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + i * 0.09);
          gain.gain.setValueAtTime(0.2, now + i * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.09 + 0.3);
          osc.start(now + i * 0.09);
          osc.stop(now + i * 0.09 + 0.3);
        });
      }

      setTimeout(() => setPreviewSound(null), 500);
    } catch (e) {}
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#18181B] text-[#D4D4D8] select-none">
      {/* Header Tabs */}
      <div className="flex border-b border-[#27272A] px-2 pt-1.5 bg-[#0F0F12]">
        <button
          onClick={() => setActiveTab('sprites')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'sprites'
              ? 'border-[#E95420] text-[#E95420]'
              : 'border-transparent text-[#71717A] hover:text-[#D4D4D8]'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Sprites</span>
        </button>
        <button
          onClick={() => setActiveTab('audio')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'audio'
              ? 'border-[#E95420] text-[#E95420]'
              : 'border-transparent text-[#71717A] hover:text-[#D4D4D8]'
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          <span>Audio FX</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {activeTab === 'sprites' && (
          <>
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#71717A] flex items-center justify-between">
              <span>Procedural 2D Textures</span>
              <span className="text-[#E95420] font-semibold">{proceduralAssets.length} Ready</span>
            </div>

            <div className="space-y-2">
              {proceduralAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="bg-[#27272A] border border-[#3F3F46]/50 hover:border-[#E95420]/60 p-2.5 rounded-md transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-[#0F0F12] border border-[#3F3F46] flex items-center justify-center">
                        <div className="flex gap-0.5">
                          {asset.colors.map((c, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#F4F4F5]">{asset.name}</div>
                        <div className="text-[10px] text-[#A1A1AA]">{asset.category}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyCode(asset.id, asset.code)}
                        title="Copy Texture Code"
                        className="p-1 hover:bg-[#3F3F46] rounded text-[#A1A1AA] hover:text-white transition-colors"
                      >
                        {copiedId === asset.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => onInsertAssetCode(asset.code)}
                        title="Insert into current scene"
                        className="p-1 bg-[#E95420] hover:bg-[#d94514] text-white rounded text-[10px] font-semibold flex items-center gap-0.5 px-1.5 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Insert</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'audio' && (
          <>
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#71717A]">
              Web Audio Synthesizer (0-byte FX)
            </div>

            <div className="space-y-2">
              {soundEffects.map((snd) => (
                <div
                  key={snd.id}
                  className="bg-[#27272A] border border-[#3F3F46]/50 p-2.5 rounded-md flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => playSynthesizedSound(snd.type)}
                      title="Play Preview"
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        previewSound === snd.type
                          ? 'bg-[#E95420] text-white'
                          : 'bg-[#0F0F12] hover:bg-[#E95420]/20 text-[#E95420]'
                      }`}
                    >
                      <Play className="w-3 h-3 fill-current ml-0.5" />
                    </button>
                    <div>
                      <div className="text-xs font-semibold text-[#F4F4F5]">{snd.name}</div>
                      <div className="text-[10px] font-mono text-[#71717A]">{snd.freq}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const snippet = `// Play ${snd.name}\nthis.playSynthSound('${snd.id}');`;
                      onInsertAssetCode(snippet);
                    }}
                    className="text-[10px] font-semibold text-[#E95420] hover:text-white bg-[#E95420]/15 hover:bg-[#E95420] px-2 py-1 rounded transition-colors"
                  >
                    Insert
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
