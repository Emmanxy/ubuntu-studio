import React, { useEffect, useRef, useState } from 'react';
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  Gauge,
  Sparkles,
  Smartphone,
  Play,
  Square,
} from 'lucide-react';
import { DeviceMode, GameProject, RuntimeError, VirtualInputState } from '../../types';
import { generatePhaserIframeHtml } from '../../utils/phaserRunner';
import { VirtualPad } from './VirtualPad';
import { ErrorOverlay } from './ErrorOverlay';

interface GamePreviewProps {
  project: GameProject;
  isRunning: boolean;
  onToggleRun: () => void;
  onRestart: () => void;
  deviceMode: DeviceMode;
  onFixErrorWithAi: (error: RuntimeError) => void;
  isFixingError?: boolean;
}

export const GamePreview: React.FC<GamePreviewProps> = ({
  project,
  isRunning,
  onToggleRun,
  onRestart,
  deviceMode,
  onFixErrorWithAi,
  isFixingError,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [fps, setFps] = useState<number>(60);
  const [runtimeError, setRuntimeError] = useState<RuntimeError | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVirtualPad, setShowVirtualPad] = useState(project.settings?.mobileControls ?? true);
  const [iframeKey, setIframeKey] = useState<number>(1);

  // Re-generate iframe HTML on project files or settings change
  const iframeHtml = React.useMemo(() => {
    return generatePhaserIframeHtml(project.files);
  }, [project.files]);

  // Message listener from iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.data) return;

      if (e.data.type === 'UBUNTU_GAME_ERROR') {
        setRuntimeError({
          message: e.data.error.message || 'Game Execution Error',
          stack: e.data.error.stack,
          filename: e.data.error.filename,
          lineno: e.data.error.lineno,
          timestamp: Date.now(),
        });
      } else if (e.data.type === 'UBUNTU_GAME_METRICS') {
        if (typeof e.data.fps === 'number') {
          setFps(e.data.fps);
        }
      } else if (e.data.type === 'UBUNTU_GAME_READY') {
        setRuntimeError(null);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleVirtualInput = (input: Partial<VirtualInputState>) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'VIRTUAL_INPUT',
          payload: input,
        },
        '*',
      );
    }
  };

  const handleLocalRestart = () => {
    setRuntimeError(null);
    setIframeKey((prev) => prev + 1);
    onRestart();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Compute Device Frame Dimensions
  const getDeviceDimensions = () => {
    switch (deviceMode) {
      case 'tablet':
        return 'w-[768px] h-[480px] max-w-full max-h-full rounded-2xl border-4 border-slate-700 shadow-2xl';
      case 'mobile-landscape':
        return 'w-[720px] h-[360px] max-w-full max-h-full rounded-3xl border-8 border-slate-800 shadow-2xl';
      case 'mobile-portrait':
        return 'w-[360px] h-[640px] max-w-full max-h-full rounded-3xl border-8 border-slate-800 shadow-2xl';
      case 'desktop':
      default:
        return 'w-full h-full rounded-none border-0';
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col h-full w-full bg-[#0F0F12] overflow-hidden select-none"
    >
      {/* Top Preview Control Bar */}
      <div className="h-8 bg-[#18181B] border-b border-[#27272A] px-3 flex items-center justify-between text-xs text-[#A1A1AA]">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-[#F4F4F5] flex items-center gap-1.5 text-xs">
            <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-[#71717A]'}`} />
            Live Preview
          </span>

          <div className="flex items-center gap-1 text-[10px] font-mono text-[#D4D4D8] bg-[#0F0F12] px-2 py-0.5 rounded border border-[#27272A]">
            <Gauge className="w-3 h-3 text-[#E95420]" />
            <span>{fps} FPS</span>
          </div>

          <span className="text-[10px] text-[#71717A] hidden sm:inline font-mono">
            {project.settings?.canvasWidth || 800}×{project.settings?.canvasHeight || 450}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Virtual Touch Pad Toggle */}
          <button
            onClick={() => setShowVirtualPad((prev) => !prev)}
            title="Toggle Virtual Mobile Controller"
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] transition-colors ${
              showVirtualPad
                ? 'bg-[#E95420]/15 text-[#E95420] border border-[#E95420]/30 font-medium'
                : 'text-[#71717A] hover:text-[#D4D4D8]'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span className="hidden md:inline">Touch D-Pad</span>
          </button>

          {/* Local Reload */}
          <button
            onClick={handleLocalRestart}
            title="Restart Game"
            className="p-1 text-[#A1A1AA] hover:text-[#F4F4F5] rounded hover:bg-[#27272A]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-1 text-[#A1A1AA] hover:text-[#F4F4F5] rounded hover:bg-[#27272A]"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Canvas / Iframe viewport */}
      <div className="flex-1 relative flex items-center justify-center p-2 bg-[#0F0F12] overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(#27272A 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        {/* Error Overlay */}
        <ErrorOverlay
          error={runtimeError}
          onFixWithAi={() => runtimeError && onFixErrorWithAi(runtimeError)}
          onRestart={handleLocalRestart}
          onDismiss={() => setRuntimeError(null)}
          isFixing={isFixingError}
        />

        {isRunning ? (
          <div className={`relative transition-all duration-300 flex items-center justify-center overflow-hidden bg-black border border-[#27272A] rounded-md ${getDeviceDimensions()}`}>
            <iframe
              key={iframeKey}
              ref={iframeRef}
              title="Ubuntu Studio Phaser Sandbox"
              srcDoc={iframeHtml}
              sandbox="allow-scripts allow-same-origin allow-pointer-lock"
              className="w-full h-full border-0 block"
            />

            {/* Virtual Touch Overlay */}
            {showVirtualPad && (
              <VirtualPad
                onInputChange={handleVirtualInput}
                gameType={project.gameType}
              />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 text-[#71717A]">
            <div className="w-12 h-12 rounded-xl bg-[#18181B] border border-[#27272A] flex items-center justify-center text-[#71717A]">
              <Square className="w-5 h-5 fill-current" />
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-[#D4D4D8]">Game Preview Paused</div>
              <div className="text-xs text-[#71717A] mt-1">Click Run Game to compile and boot the canvas</div>
            </div>
            <button
              onClick={onToggleRun}
              className="mt-2 flex items-center gap-2 px-3.5 py-1.5 bg-[#E95420] hover:bg-[#d94514] text-white rounded-md text-xs font-semibold shadow-md transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Live Game</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
