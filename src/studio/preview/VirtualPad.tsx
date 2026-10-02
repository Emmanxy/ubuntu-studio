import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Shield, Zap } from 'lucide-react';
import { VirtualInputState } from '../../types';

interface VirtualPadProps {
  onInputChange: (input: Partial<VirtualInputState>) => void;
  gameType?: string;
}

export const VirtualPad: React.FC<VirtualPadProps> = ({
  onInputChange,
  gameType = 'platformer',
}) => {
  const handleButton = (key: keyof VirtualInputState, isPressed: boolean) => {
    onInputChange({ [key]: isPressed });
  };

  const preventGhost = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-20 flex items-end justify-between p-4 pb-6">
      {/* Left: D-Pad */}
      <div className="pointer-events-auto flex items-center gap-2 bg-black/40 backdrop-blur-sm p-2 rounded-2xl border border-white/10 shadow-2xl">
        {/* Left Arrow */}
        <button
          type="button"
          onMouseDown={() => handleButton('left', true)}
          onMouseUp={() => handleButton('left', false)}
          onMouseLeave={() => handleButton('left', false)}
          onTouchStart={(e) => { preventGhost(e); handleButton('left', true); }}
          onTouchEnd={(e) => { preventGhost(e); handleButton('left', false); }}
          className="w-12 h-12 rounded-xl bg-slate-800/80 active:bg-amber-500/80 text-white flex items-center justify-center border border-white/10 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex flex-col gap-2">
          {/* Up Arrow */}
          <button
            type="button"
            onMouseDown={() => handleButton('up', true)}
            onMouseUp={() => handleButton('up', false)}
            onMouseLeave={() => handleButton('up', false)}
            onTouchStart={(e) => { preventGhost(e); handleButton('up', true); }}
            onTouchEnd={(e) => { preventGhost(e); handleButton('up', false); }}
            className="w-12 h-12 rounded-xl bg-slate-800/80 active:bg-amber-500/80 text-white flex items-center justify-center border border-white/10 active:scale-95 transition-transform"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
          {/* Down Arrow */}
          <button
            type="button"
            onMouseDown={() => handleButton('down', true)}
            onMouseUp={() => handleButton('down', false)}
            onMouseLeave={() => handleButton('down', false)}
            onTouchStart={(e) => { preventGhost(e); handleButton('down', true); }}
            onTouchEnd={(e) => { preventGhost(e); handleButton('down', false); }}
            className="w-12 h-12 rounded-xl bg-slate-800/80 active:bg-amber-500/80 text-white flex items-center justify-center border border-white/10 active:scale-95 transition-transform"
          >
            <ArrowDown className="w-6 h-6" />
          </button>
        </div>

        {/* Right Arrow */}
        <button
          type="button"
          onMouseDown={() => handleButton('right', true)}
          onMouseUp={() => handleButton('right', false)}
          onMouseLeave={() => handleButton('right', false)}
          onTouchStart={(e) => { preventGhost(e); handleButton('right', true); }}
          onTouchEnd={(e) => { preventGhost(e); handleButton('right', false); }}
          className="w-12 h-12 rounded-xl bg-slate-800/80 active:bg-amber-500/80 text-white flex items-center justify-center border border-white/10 active:scale-95 transition-transform"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      {/* Right: Action Buttons (A, B, Jump) */}
      <div className="pointer-events-auto flex items-center gap-3 bg-black/40 backdrop-blur-sm p-2 rounded-2xl border border-white/10 shadow-2xl">
        {/* Action B (Shield / Special) */}
        <button
          type="button"
          onMouseDown={() => handleButton('actionB', true)}
          onMouseUp={() => handleButton('actionB', false)}
          onMouseLeave={() => handleButton('actionB', false)}
          onTouchStart={(e) => { preventGhost(e); handleButton('actionB', true); }}
          onTouchEnd={(e) => { preventGhost(e); handleButton('actionB', false); }}
          className="w-12 h-12 rounded-full bg-blue-700/80 active:bg-blue-500 text-white font-bold flex items-center justify-center border border-white/10 active:scale-95 transition-transform text-xs"
        >
          <Shield className="w-5 h-5" />
        </button>

        {/* Action A (Attack / Strike / Action) */}
        <button
          type="button"
          onMouseDown={() => handleButton('actionA', true)}
          onMouseUp={() => handleButton('actionA', false)}
          onMouseLeave={() => handleButton('actionA', false)}
          onTouchStart={(e) => { preventGhost(e); handleButton('actionA', true); }}
          onTouchEnd={(e) => { preventGhost(e); handleButton('actionA', false); }}
          className="w-14 h-14 rounded-full bg-amber-600/90 active:bg-amber-500 text-white font-black flex items-center justify-center border border-white/20 active:scale-95 transition-transform text-sm shadow-lg shadow-amber-950/50"
        >
          <Zap className="w-6 h-6" />
        </button>

        {/* Jump Button */}
        <button
          type="button"
          onMouseDown={() => handleButton('jump', true)}
          onMouseUp={() => handleButton('jump', false)}
          onMouseLeave={() => handleButton('jump', false)}
          onTouchStart={(e) => { preventGhost(e); handleButton('jump', true); }}
          onTouchEnd={(e) => { preventGhost(e); handleButton('jump', false); }}
          className="w-14 h-14 rounded-full bg-emerald-600/90 active:bg-emerald-500 text-white font-black flex items-center justify-center border border-white/20 active:scale-95 transition-transform text-xs shadow-lg shadow-emerald-950/50"
        >
          JUMP
        </button>
      </div>
    </div>
  );
};
