import React from 'react';
import {
  Play,
  Square,
  RotateCcw,
  Download,
  Share2,
  Settings,
  History,
  Monitor,
  Tablet,
  Smartphone,
  FolderTree,
  Sliders,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  FileCode,
  Globe,
} from 'lucide-react';
import { DeviceMode, GameProject } from '../types';

interface TopBarProps {
  project: GameProject;
  isRunning: boolean;
  onToggleRun: () => void;
  onRestart: () => void;
  deviceMode: DeviceMode;
  onDeviceModeChange: (mode: DeviceMode) => void;
  onDownloadSource: () => void;
  onDownloadBuild: () => void;
  onPublish: () => void;
  onOpenSettings: () => void;
  onOpenVersions: () => void;
  onBackToDashboard: () => void;
  isSaving?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  project,
  isRunning,
  onToggleRun,
  onRestart,
  deviceMode,
  onDeviceModeChange,
  onDownloadSource,
  onDownloadBuild,
  onPublish,
  onOpenSettings,
  onOpenVersions,
  onBackToDashboard,
  isSaving,
}) => {
  return (
    <header className="h-12 bg-[#18181B] border-b border-[#27272A] px-3.5 flex items-center justify-between select-none z-30 flex-shrink-0">
      {/* Left: Branding & Project Title */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onBackToDashboard}
          title="Back to Dashboard"
          className="flex items-center gap-1.5 px-2 py-1 rounded text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#27272A] transition-colors text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="font-medium hidden sm:inline">Projects</span>
        </button>

        <div className="h-4 w-[1px] bg-[#27272A]" />

        {/* Ubuntu Studio Logo */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#E95420] to-[#FF6B00] flex items-center justify-center text-white shadow-sm shadow-orange-950/40">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs uppercase tracking-wider text-[#FDFBF7]">Ubuntu Studio</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#F0B429]/15 text-[#F0B429] font-medium border border-[#F0B429]/30 hidden xs:inline-block">
              Heritage Day Edition
            </span>
            <span className="text-xs text-[#7A7067] hidden md:inline">/</span>
            <span className="text-xs text-[#D4CCC4] font-medium truncate max-w-[140px] sm:max-w-[200px]">
              {project.title || project.name}
            </span>
          </div>
        </div>

        {/* Save indicator */}
        <div className="hidden lg:flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded ml-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>{isSaving ? 'SAVING...' : 'SAVED'}</span>
        </div>
      </div>

      {/* Center: Game Controls & Device Switcher */}
      <div className="flex items-center gap-1.5">
        {/* Run / Stop Button */}
        <div className="flex items-center bg-[#27272A] p-0.5 rounded-md border border-[#3F3F46]/50">
          <button
            onClick={onToggleRun}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all ${
              isRunning
                ? 'bg-rose-600/30 text-rose-300 hover:bg-rose-600/40'
                : 'bg-[#E95420] hover:bg-[#d94514] text-white shadow-sm'
            }`}
            title={isRunning ? 'Stop Game (■)' : 'Run Game (▶)'}
          >
            {isRunning ? (
              <>
                <Square className="w-3 h-3 fill-current" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                <Play className="w-3 h-3 fill-current" />
                <span>RUN GAME</span>
              </>
            )}
          </button>

          {/* Restart Button */}
          <button
            onClick={onRestart}
            title="Restart Game (↻)"
            className="p-1 text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#3F3F46] rounded transition-colors ml-0.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-4 w-[1px] bg-[#27272A] mx-1 hidden sm:block" />

        {/* Device Mode Selectors */}
        <div className="hidden md:flex items-center bg-[#0F0F12] border border-[#27272A] p-0.5 rounded-md">
          <button
            onClick={() => onDeviceModeChange('desktop')}
            title="Desktop Mode (800x450)"
            className={`p-1.5 rounded text-xs transition-colors ${
              deviceMode === 'desktop' ? 'bg-[#27272A] text-[#E95420] font-medium' : 'text-[#71717A] hover:text-[#D4D4D8]'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeviceModeChange('tablet')}
            title="Tablet Mode (768x500)"
            className={`p-1.5 rounded text-xs transition-colors ${
              deviceMode === 'tablet' ? 'bg-[#27272A] text-[#E95420] font-medium' : 'text-[#71717A] hover:text-[#D4D4D8]'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeviceModeChange('mobile-landscape')}
            title="Mobile Landscape Touch"
            className={`p-1.5 rounded text-xs transition-colors ${
              deviceMode.startsWith('mobile') ? 'bg-[#27272A] text-[#E95420] font-medium' : 'text-[#71717A] hover:text-[#D4D4D8]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right: Version History, Download Source, Download Build, Publish, Settings */}
      <div className="flex items-center gap-1.5">
        {/* Version History Button */}
        <button
          onClick={onOpenVersions}
          title="Project Version History"
          className="flex items-center gap-1 px-2.5 py-1 text-xs text-[#D4D4D8] bg-[#27272A] hover:bg-[#3F3F46] border border-[#3F3F46]/50 rounded-md transition-colors"
        >
          <History className="w-3.5 h-3.5 text-[#E95420]" />
          <span className="hidden xl:inline font-mono">v{project.currentVersion || 1}</span>
        </button>

        {/* Download Source Code ZIP */}
        <button
          onClick={onDownloadSource}
          title="Download Complete Editable Source Code (ZIP for VS Code / npm)"
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-[#E95420] hover:bg-[#d94514] rounded-md transition-all shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Export ZIP</span>
        </button>

        {/* Download Standalone Web Build */}
        <button
          onClick={onDownloadBuild}
          title="Download Playable Standalone Game Build"
          className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs text-[#D4D4D8] bg-[#27272A] hover:bg-[#3F3F46] border border-[#3F3F46]/50 rounded-md transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden lg:inline">Build</span>
        </button>

        {/* Publish Game */}
        <button
          onClick={onPublish}
          title="Publish Game to Web"
          className="flex items-center gap-1 px-2.5 py-1 text-xs text-[#D4D4D8] bg-[#27272A] hover:bg-[#3F3F46] border border-[#3F3F46]/50 rounded-md transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">Publish</span>
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          title="Studio Settings"
          className="p-1.5 text-[#A1A1AA] hover:text-[#F4F4F5] bg-[#27272A] hover:bg-[#3F3F46] border border-[#3F3F46]/50 rounded-md transition-colors"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
