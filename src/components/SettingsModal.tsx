import React from 'react';
import { Settings, X, Sliders, Monitor, KeyRound, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#18181B] border border-[#27272A] rounded-lg w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-[#27272A] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#E95420]/15 border border-[#E95420]/30 flex items-center justify-center text-[#E95420]">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F4F4F5]">Ubuntu Studio Settings</h3>
              <p className="text-xs text-[#71717A]">Environment and IDE configuration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#71717A] hover:text-white rounded hover:bg-[#27272A]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3.5 text-xs text-[#D4D4D8]">
          <div className="bg-[#27272A]/50 border border-[#27272A] p-3 rounded-md space-y-1.5">
            <div className="font-bold text-[#E95420] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini AI Engine</span>
            </div>
            <p className="text-[#A1A1AA] leading-relaxed text-[11px]">
              Ubuntu Studio uses server-side Gemini 2.5 architecture to securely synthesize Phaser 3 code without exposing API keys.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#D4D4D8] block">Phaser Engine Version</label>
            <div className="bg-[#0F0F12] border border-[#27272A] px-3 py-1.5 rounded text-[#A1A1AA] font-mono text-[11px]">
              Phaser 3.80.1 (WebGL & Canvas 2D)
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#D4D4D8] block">Source Code Portability</label>
            <div className="text-[11px] text-[#A1A1AA] leading-relaxed">
              All generated projects are fully independent standard Vite + ES6 JavaScript packages. You can download and develop anywhere without vendor lock-in.
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-[#27272A] bg-[#18181B] flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-[#E95420] hover:bg-[#d94514] text-white rounded text-xs font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
