import React from 'react';
import { Sliders, Volume2, Smartphone, Monitor, Gauge, Compass } from 'lucide-react';
import { GameSettings } from '../../types';

interface GameSettingsPanelProps {
  settings: GameSettings;
  onChange: (settings: GameSettings) => void;
}

export const GameSettingsPanel: React.FC<GameSettingsPanelProps> = ({
  settings,
  onChange,
}) => {
  const update = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="flex flex-col h-full bg-[#18181B] text-[#D4D4D8] select-none overflow-y-auto p-3 space-y-4">
      <div className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] border-b border-[#27272A] pb-2">
        Engine & Game Settings
      </div>

      {/* Physics Settings */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[#F4F4F5] flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-[#E95420]" />
            <span>Gravity (Y-Axis)</span>
          </span>
          <span className="text-xs font-mono text-[#E95420]">{settings.gravityY}px/s²</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="1200"
            step="50"
            value={settings.gravityY}
            onChange={(e) => update('gravityY', Number(e.target.value))}
            className="flex-1 accent-[#E95420] bg-[#27272A] h-1.5 rounded appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Canvas Dimensions */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-medium text-[#A1A1AA] uppercase tracking-wider block mb-1">Width</label>
          <input
            type="number"
            value={settings.canvasWidth}
            onChange={(e) => update('canvasWidth', Number(e.target.value))}
            className="w-full bg-[#0F0F12] border border-[#27272A] text-white text-xs px-2 py-1.5 rounded focus:border-[#E95420] outline-none font-mono"
          />
        </div>
        <div>
          <label className="text-[10px] font-medium text-[#A1A1AA] uppercase tracking-wider block mb-1">Height</label>
          <input
            type="number"
            value={settings.canvasHeight}
            onChange={(e) => update('canvasHeight', Number(e.target.value))}
            className="w-full bg-[#0F0F12] border border-[#27272A] text-white text-xs px-2 py-1.5 rounded focus:border-[#E95420] outline-none font-mono"
          />
        </div>
      </div>

      {/* Orientation & Scale Mode */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[#F4F4F5]">Orientation</label>
        <div className="grid grid-cols-2 gap-2">
          {(['landscape', 'portrait'] as const).map((orient) => (
            <button
              key={orient}
              type="button"
              onClick={() => update('orientation', orient)}
              className={`text-xs py-1.5 rounded border capitalize transition-colors ${
                settings.orientation === orient
                  ? 'bg-[#E95420]/15 border-[#E95420] text-[#E95420] font-semibold'
                  : 'bg-[#27272A] border-[#3F3F46]/50 text-[#A1A1AA] hover:text-white'
              }`}
            >
              {orient}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles: Audio & Mobile Touch */}
      <div className="space-y-2.5 pt-2 border-t border-[#27272A]">
        <label className="flex items-center justify-between text-xs cursor-pointer">
          <span className="flex items-center gap-1.5 text-[#D4D4D8]">
            <Volume2 className="w-3.5 h-3.5 text-[#E95420]" />
            Sound FX & Synthesis
          </span>
          <input
            type="checkbox"
            checked={settings.soundEnabled}
            onChange={(e) => update('soundEnabled', e.target.checked)}
            className="accent-[#E95420] w-4 h-4 rounded cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between text-xs cursor-pointer">
          <span className="flex items-center gap-1.5 text-[#D4D4D8]">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            Mobile Touch D-Pad
          </span>
          <input
            type="checkbox"
            checked={settings.mobileControls}
            onChange={(e) => update('mobileControls', e.target.checked)}
            className="accent-[#E95420] w-4 h-4 rounded cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between text-xs cursor-pointer">
          <span className="flex items-center gap-1.5 text-[#D4D4D8]">
            <Monitor className="w-3.5 h-3.5 text-sky-400" />
            Physics Debug Hitboxes
          </span>
          <input
            type="checkbox"
            checked={settings.debug}
            onChange={(e) => update('debug', e.target.checked)}
            className="accent-[#E95420] w-4 h-4 rounded cursor-pointer"
          />
        </label>
      </div>

      {/* Background Color Picker */}
      <div className="space-y-1.5 pt-2 border-t border-[#27272A]">
        <label className="text-xs font-semibold text-[#F4F4F5]">Canvas Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={settings.backgroundColor || '#0F0F12'}
            onChange={(e) => update('backgroundColor', e.target.value)}
            className="w-7 h-7 rounded border border-[#3F3F46] cursor-pointer bg-transparent"
          />
          <span className="text-xs font-mono text-[#A1A1AA]">{settings.backgroundColor}</span>
        </div>
      </div>
    </div>
  );
};
