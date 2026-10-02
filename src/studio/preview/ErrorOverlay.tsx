import React from 'react';
import { AlertTriangle, Sparkles, RefreshCw, X } from 'lucide-react';
import { RuntimeError } from '../../types';

interface ErrorOverlayProps {
  error: RuntimeError | null;
  onFixWithAi: () => void;
  onRestart: () => void;
  onDismiss: () => void;
  isFixing?: boolean;
}

export const ErrorOverlay: React.FC<ErrorOverlayProps> = ({
  error,
  onFixWithAi,
  onRestart,
  onDismiss,
  isFixing,
}) => {
  if (!error) return null;

  return (
    <div className="absolute top-2 left-2 right-2 bg-[#18181B] border border-rose-600/50 rounded-lg p-3 shadow-xl z-30 flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-rose-950/60 border border-rose-800/60 text-rose-400">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-xs font-bold text-rose-300">Phaser Game Error Detected</div>
            <div className="text-[11px] font-mono text-rose-200/90 truncate max-w-[450px]">
              {error.message}
            </div>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="text-[#71717A] hover:text-white p-1"
          title="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {error.stack && (
        <div className="bg-[#0F0F12] border border-[#27272A] rounded p-2 text-[10px] font-mono text-rose-300/80 max-h-16 overflow-y-auto whitespace-pre-wrap">
          {error.stack}
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#27272A]">
        <button
          onClick={onRestart}
          className="flex items-center gap-1 px-2.5 py-1 text-xs text-[#D4D4D8] hover:text-white bg-[#27272A] hover:bg-[#3F3F46] rounded border border-[#3F3F46]/60"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reload</span>
        </button>

        <button
          onClick={onFixWithAi}
          disabled={isFixing}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-[#E95420] hover:bg-[#d94514] rounded shadow transition-all disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isFixing ? 'Fixing...' : 'Fix with Gemini AI'}</span>
        </button>
      </div>
    </div>
  );
};
