import React, { useState } from 'react';
import { Share2, Globe, Copy, Check, ExternalLink, X, Gamepad2 } from 'lucide-react';
import { GameProject } from '../types';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: GameProject;
  onUpdatePublishData: (publishData: GameProject['publishData']) => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  project,
  onUpdatePublishData,
}) => {
  const [creatorName, setCreatorName] = useState(project.publishData?.creatorName || 'Ubuntu Studio Creator');
  const [description, setDescription] = useState(project.description || '');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  if (!isOpen) return null;

  const publicSlug = project.publishData?.publicSlug || project.name;
  const shareableUrl = `${window.location.origin}/?play=${publicSlug}`;
  const embedCode = `<iframe src="${shareableUrl}" width="800" height="450" frameborder="0" allowfullscreen></iframe>`;

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePublishData({
      isPublished: true,
      publishedAt: new Date().toISOString(),
      publicSlug,
      creatorName,
      category: project.gameType,
      tags: project.publishData?.tags || ['Phaser 3', 'Ubuntu Studio', project.gameType],
      playsCount: (project.publishData?.playsCount || 0) + 1,
      likesCount: project.publishData?.likesCount || 0,
    });
  };

  const copyToClipboard = (text: string, isEmbed = false) => {
    navigator.clipboard.writeText(text);
    if (isEmbed) {
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2000);
    } else {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#18181B] border border-[#27272A] rounded-lg w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#27272A] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#E95420]/15 border border-[#E95420]/30 flex items-center justify-center text-[#E95420]">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F4F4F5]">Publish Game to Web</h3>
              <p className="text-xs text-[#71717A]">Share your 2D game with players worldwide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#71717A] hover:text-white rounded hover:bg-[#27272A]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handlePublish} className="p-5 space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#D4D4D8]">Game Title</label>
            <input
              type="text"
              readOnly
              value={project.title || project.name}
              className="w-full bg-[#0F0F12] border border-[#27272A] text-[#A1A1AA] text-xs px-3 py-1.5 rounded outline-none font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#D4D4D8]">Creator Name / Clan</label>
            <input
              type="text"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              className="w-full bg-[#0F0F12] border border-[#27272A] focus:border-[#E95420] text-[#F4F4F5] text-xs px-3 py-1.5 rounded outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#D4D4D8]">Public Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0F0F12] border border-[#27272A] focus:border-[#E95420] text-[#F4F4F5] text-xs px-3 py-1.5 rounded outline-none resize-none"
            />
          </div>

          {/* Shareable Link Box */}
          <div className="bg-[#27272A]/50 border border-[#27272A] p-3 rounded-md space-y-1.5">
            <div className="text-xs font-bold text-[#E95420] flex items-center justify-between">
              <span>Direct Game Link</span>
              <a
                href={shareableUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
              >
                <span>Play in New Tab</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                readOnly
                value={shareableUrl}
                className="flex-1 bg-[#0F0F12] border border-[#27272A] text-[#D4D4D8] text-xs px-2.5 py-1 rounded outline-none select-all font-mono"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(shareableUrl)}
                className="p-1.5 bg-[#E95420]/15 hover:bg-[#E95420]/25 text-[#E95420] border border-[#E95420]/30 rounded text-xs font-medium flex items-center gap-1"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Embed HTML code */}
          <div className="bg-[#27272A]/50 border border-[#27272A] p-3 rounded-md space-y-1.5">
            <div className="text-xs font-bold text-[#D4D4D8]">Embed HTML Iframe</div>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                readOnly
                value={embedCode}
                className="flex-1 bg-[#0F0F12] border border-[#27272A] text-[#71717A] text-xs px-2.5 py-1 rounded outline-none select-all font-mono truncate"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(embedCode, true)}
                className="p-1.5 bg-[#27272A] hover:bg-[#3F3F46] text-[#D4D4D8] rounded text-xs font-medium"
              >
                {copiedEmbed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="pt-1">
            <button
              type="submit"
              className="w-full py-2 bg-[#E95420] hover:bg-[#d94514] text-white rounded text-xs font-semibold shadow transition-colors"
            >
              Update Published Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
