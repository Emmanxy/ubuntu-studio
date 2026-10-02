import React, { useState } from 'react';
import { Play, RotateCcw, Maximize2, Sparkles, ArrowLeft, Heart, Share2, Code } from 'lucide-react';
import { GameProject } from '../types';
import { generatePhaserIframeHtml } from '../utils/phaserRunner';
import { VirtualPad } from '../studio/preview/VirtualPad';

interface PublicGamePlayerProps {
  project: GameProject;
  onBackToDashboard: () => void;
  onOpenInStudio: () => void;
}

export const PublicGamePlayer: React.FC<PublicGamePlayerProps> = ({
  project,
  onBackToDashboard,
  onOpenInStudio,
}) => {
  const [likes, setLikes] = useState(project.publishData?.likesCount || 12);
  const [hasLiked, setHasLiked] = useState(false);
  const [key, setKey] = useState(1);
  const [showControls, setShowControls] = useState(true);

  const iframeHtml = React.useMemo(() => {
    return generatePhaserIframeHtml(project.files);
  }, [project.files]);

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const handleRestart = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#0F0F12] text-[#D4D4D8] flex flex-col">
      {/* Top Header */}
      <header className="h-12 bg-[#18181B] border-b border-[#27272A] px-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#A1A1AA] hover:text-white bg-[#27272A] hover:bg-[#3F3F46] border border-[#3F3F46]/50 rounded transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <div className="h-4 w-[1px] bg-[#27272A]" />

          <div>
            <h1 className="text-xs font-bold text-[#F4F4F5]">{project.title || project.name}</h1>
            <span className="text-[10px] text-[#E95420] font-medium">
              By {project.publishData?.creatorName || 'Ubuntu Studio'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              hasLiked
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-[#27272A] hover:bg-[#3F3F46] text-[#D4D4D8] border border-[#3F3F46]/50'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
            <span>{likes}</span>
          </button>

          <button
            onClick={onOpenInStudio}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#E95420] hover:bg-[#d94514] text-white rounded text-xs font-semibold shadow-sm transition-all"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Remix in Studio</span>
          </button>
        </div>
      </header>

      {/* Main Canvas Player */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-6xl w-full mx-auto">
        <div className="w-full relative aspect-video max-h-[70vh] bg-black rounded-lg overflow-hidden border border-[#27272A] shadow-xl">
          <iframe
            key={key}
            title={project.title}
            srcDoc={iframeHtml}
            sandbox="allow-scripts allow-same-origin allow-pointer-lock"
            className="w-full h-full border-0 block"
          />

          {/* Optional Virtual Pad for touch */}
          <VirtualPad onInputChange={(payload) => {
            const iframe = document.querySelector('iframe');
            if (iframe && iframe.contentWindow) {
              iframe.contentWindow.postMessage({ type: 'VIRTUAL_INPUT', payload }, '*');
            }
          }} />
        </div>

        {/* Controls & Description Card */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-3.5">
          <div className="md:col-span-2 bg-[#18181B] border border-[#27272A] rounded-lg p-4">
            <h2 className="text-xs font-bold text-[#E95420] uppercase tracking-wider mb-1">About This Game</h2>
            <p className="text-xs text-[#D4D4D8] leading-relaxed">
              {project.description || '2D Game crafted in Ubuntu Studio with Phaser 3 engine.'}
            </p>

            {project.culturalMeta?.historicalTopic && (
              <div className="mt-2.5 pt-2.5 border-t border-[#27272A] text-xs text-[#A1A1AA]">
                <span className="font-semibold text-[#F4F4F5]">Cultural & Historical Inspiration: </span>
                {project.culturalMeta.historicalTopic}
              </div>
            )}
          </div>

          <div className="bg-[#18181B] border border-[#27272A] rounded-lg p-4 flex flex-col justify-between">
            <div>
              <h2 className="text-xs font-bold text-[#F4F4F5] mb-2 uppercase tracking-wider">Controls Guide</h2>
              <div className="space-y-1 text-xs text-[#A1A1AA]">
                <div><span className="font-mono text-[#E95420] bg-[#27272A] px-1 py-0.5 rounded text-[11px]">A / D</span> or <span className="font-mono text-[#E95420] bg-[#27272A] px-1 py-0.5 rounded text-[11px]">◄ / ►</span> : Move</div>
                <div><span className="font-mono text-[#E95420] bg-[#27272A] px-1 py-0.5 rounded text-[11px]">W / Space</span> : Jump / Action</div>
                <div><span className="font-mono text-[#E95420] bg-[#27272A] px-1 py-0.5 rounded text-[11px]">J / K</span> : Attack / Block Shield</div>
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="mt-3 w-full py-1.5 bg-[#27272A] hover:bg-[#3F3F46] text-[#D4D4D8] hover:text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#3F3F46]/50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Match</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
