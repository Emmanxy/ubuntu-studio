import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  ImageIcon,
  Sliders,
  Globe,
  Sparkles,
  Columns,
  Code2,
  Play,
  Share2,
  Download,
  History,
  Settings as SettingsIcon,
} from 'lucide-react';
import { DeviceMode, GameProject, RuntimeError } from './types';
import { storageService } from './services/storageService';
import { geminiService } from './services/geminiService';
import { downloadSourceCodeZip } from './utils/exportZip';
import { downloadStandaloneGameBuild } from './utils/exportBuild';

import { TopBar } from './studio/TopBar';
import { FileExplorer } from './studio/LeftSidebar/FileExplorer';
import { AssetManager } from './studio/LeftSidebar/AssetManager';
import { GameSettingsPanel } from './studio/LeftSidebar/GameSettingsPanel';
import { CulturalMetaPanel } from './studio/LeftSidebar/CulturalMetaPanel';
import { CodeEditor } from './studio/editor/CodeEditor';
import { GamePreview } from './studio/preview/GamePreview';
import { AiPanel } from './studio/ai/AiPanel';
import { VersionHistoryModal } from './studio/ai/VersionHistoryModal';

import { ProjectDashboard } from './components/ProjectDashboard';
import { CreateGameModal } from './components/CreateGameModal';
import { PublishModal } from './components/PublishModal';
import { SettingsModal } from './components/SettingsModal';
import { PublicGamePlayer } from './components/PublicGamePlayer';

type ActiveView = 'dashboard' | 'studio' | 'player';
type SidebarTab = 'files' | 'assets' | 'settings' | 'cultural';
type LayoutMode = 'split' | 'code-only' | 'preview-only';

export default function App() {
  const [view, setView] = useState<ActiveView>('dashboard');
  const [projects, setProjects] = useState<GameProject[]>([]);
  const [activeProject, setActiveProject] = useState<GameProject | null>(null);

  // Studio UI State
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('files');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('split');
  const [activeFilePath, setActiveFilePath] = useState<string>('src/main.js');
  const [openTabs, setOpenTabs] = useState<string[]>(['src/main.js']);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isAiPanelExpanded, setIsAiPanelExpanded] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [isFixingError, setIsFixingError] = useState<boolean>(false);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isVersionsModalOpen, setIsVersionsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Initialize projects on load
  useEffect(() => {
    const loaded = storageService.getProjects();
    setProjects(loaded);

    // Check URL parameters for direct play link: ?play=slug
    const urlParams = new URLSearchParams(window.location.search);
    const playSlug = urlParams.get('play');
    if (playSlug) {
      const match = loaded.find((p) => p.publishData?.publicSlug === playSlug || p.name === playSlug);
      if (match) {
        setActiveProject(match);
        setView('player');
        return;
      }
    }

    const lastActiveId = storageService.getActiveProjectId();
    if (lastActiveId) {
      const match = loaded.find((p) => p.id === lastActiveId);
      if (match) {
        setActiveProject(match);
        setupProjectTabs(match);
      }
    }
  }, []);

  const setupProjectTabs = (proj: GameProject) => {
    const defaultScene = proj.files.find((f) => f.path.includes('Scene.js') && !f.path.includes('Boot'))?.path || 'src/main.js';
    setActiveFilePath(defaultScene);
    setOpenTabs([defaultScene, 'src/main.js'].filter((v, i, a) => a.indexOf(v) === i));
  };

  const handleOpenProject = (id: string) => {
    const proj = projects.find((p) => p.id === id);
    if (!proj) return;
    setActiveProject(proj);
    storageService.setActiveProjectId(id);
    setupProjectTabs(proj);
    setIsRunning(true);
    setView('studio');
  };

  const handlePlayGame = (id: string) => {
    const proj = projects.find((p) => p.id === id);
    if (!proj) return;
    setActiveProject(proj);
    setView('player');
  };

  const handleSaveProject = (updated: GameProject) => {
    setActiveProject(updated);
    storageService.saveProject(updated);
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleCreateGame = async (prompt: string, culturalMeta?: any) => {
    setIsAiLoading(true);
    try {
      const newProj = await geminiService.generateGame(prompt, undefined, culturalMeta);
      storageService.saveProject(newProj);
      setProjects((prev) => [newProj, ...prev]);
      setActiveProject(newProj);
      storageService.setActiveProjectId(newProj.id);
      setupProjectTabs(newProj);
      setIsCreateModalOpen(false);
      setView('studio');
      setIsRunning(true);
    } catch (e) {
      console.error('Failed to create game:', e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleDuplicateProject = (id: string) => {
    const copy = storageService.duplicateProject(id);
    if (copy) {
      setProjects((prev) => [copy, ...prev]);
    }
  };

  const handleDeleteProject = (id: string) => {
    storageService.deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (activeProject?.id === id) {
      setActiveProject(null);
      setView('dashboard');
    }
  };

  const handleClearAllProjects = () => {
    storageService.clearAllProjects();
    setProjects([]);
    setActiveProject(null);
    setView('dashboard');
  };

  // Editor Actions
  const handleSelectFile = (path: string) => {
    setActiveFilePath(path);
    if (!openTabs.includes(path)) {
      setOpenTabs((prev) => [...prev, path]);
    }
  };

  const handleCloseTab = (path: string) => {
    const remaining = openTabs.filter((t) => t !== path);
    setOpenTabs(remaining);
    if (activeFilePath === path && remaining.length > 0) {
      setActiveFilePath(remaining[remaining.length - 1]);
    }
  };

  const handleFileContentChange = (path: string, newContent: string) => {
    if (!activeProject) return;
    const updatedFiles = activeProject.files.map((f) => (f.path === path ? { ...f, content: newContent } : f));
    const updated = { ...activeProject, files: updatedFiles, updatedAt: Date.now() };
    handleSaveProject(updated);
  };

  const handleCreateFile = (path: string, content = '') => {
    if (!activeProject) return;
    if (activeProject.files.some((f) => f.path === path)) return;

    const newFile = {
      id: `file-${Date.now()}`,
      path,
      name: path.split('/').pop() || path,
      content,
      language: path.endsWith('.json') ? 'json' : 'javascript' as const,
    };
    const updated = {
      ...activeProject,
      files: [...activeProject.files, newFile],
      updatedAt: Date.now(),
    };
    handleSaveProject(updated);
    handleSelectFile(path);
  };

  const handleDeleteFile = (path: string) => {
    if (!activeProject || path === 'src/main.js') return;
    const updatedFiles = activeProject.files.filter((f) => f.path !== path);
    const updated = { ...activeProject, files: updatedFiles, updatedAt: Date.now() };
    handleSaveProject(updated);
    handleCloseTab(path);
  };

  const handleRenameFile = (oldPath: string, newPath: string) => {
    if (!activeProject) return;
    const updatedFiles = activeProject.files.map((f) =>
      f.path === oldPath ? { ...f, path: newPath, name: newPath.split('/').pop() || newPath } : f,
    );
    const updated = { ...activeProject, files: updatedFiles, updatedAt: Date.now() };
    handleSaveProject(updated);
    setOpenTabs((prev) => prev.map((t) => (t === oldPath ? newPath : t)));
    if (activeFilePath === oldPath) setActiveFilePath(newPath);
  };

  // AI Chat Game Modification
  const handleAiSendMessage = async (message: string) => {
    if (!activeProject) return;
    setIsAiLoading(true);
    try {
      const response = await geminiService.modifyGameWithChat(message, activeProject);

      // Apply modified files
      let files = [...activeProject.files];
      response.modifiedFiles.forEach((mf) => {
        const idx = files.findIndex((f) => f.path === mf.path);
        if (idx >= 0 && mf.content) {
          files[idx] = { ...files[idx], content: mf.content };
        } else if (mf.action === 'create' && mf.content) {
          files.push({
            id: `file-${Date.now()}-${Math.random()}`,
            path: mf.path,
            name: mf.path.split('/').pop() || mf.path,
            content: mf.content,
            language: 'javascript',
          });
        }
      });

      // Save and create version snapshot
      const updatedWithSnapshot = storageService.createSnapshot(
        { ...activeProject, files, updatedAt: Date.now() },
        `AI: ${message.slice(0, 45)}`,
        'ai_edit',
      );
      handleSaveProject(updatedWithSnapshot);
      setIsRunning(true);
    } catch (e) {
      console.error('Failed to modify game with AI:', e);
    } finally {
      setIsAiLoading(false);
    }
  };

  // 1-Click Error Auto-Repair
  const handleFixErrorWithAi = async (error: RuntimeError) => {
    if (!activeProject) return;
    setIsFixingError(true);
    try {
      const fixResult = await geminiService.debugGameError(error, activeProject, activeFilePath);
      let files = [...activeProject.files];
      fixResult.modifiedFiles.forEach((mf) => {
        const idx = files.findIndex((f) => f.path === mf.path);
        if (idx >= 0) {
          files[idx] = { ...files[idx], content: mf.content };
        }
      });

      const updated = storageService.createSnapshot(
        { ...activeProject, files, updatedAt: Date.now() },
        `Auto-Debug: Fixed "${error.message.slice(0, 30)}"`,
        'ai_debug',
      );
      handleSaveProject(updated);
      setIsRunning(true);
    } catch (e) {
      console.error('Auto fix error:', e);
    } finally {
      setIsFixingError(false);
    }
  };

  const handleRestoreVersion = (versionId: string) => {
    if (!activeProject) return;
    const restored = storageService.restoreSnapshot(activeProject, versionId);
    if (restored) {
      handleSaveProject(restored);
      setIsRunning(true);
    }
  };

  // View: Public Game Player
  if (view === 'player' && activeProject) {
    return (
      <PublicGamePlayer
        project={activeProject}
        onBackToDashboard={() => setView('dashboard')}
        onOpenInStudio={() => setView('studio')}
      />
    );
  }

  // View: Project Dashboard ("My Games")
  if (view === 'dashboard' || !activeProject) {
    return (
      <>
        <ProjectDashboard
          projects={projects}
          onOpenProject={handleOpenProject}
          onPlayGame={handlePlayGame}
          onCreateNew={() => setIsCreateModalOpen(true)}
          onDownloadZip={downloadSourceCodeZip}
          onDuplicateProject={handleDuplicateProject}
          onDeleteProject={handleDeleteProject}
          onClearAllProjects={handleClearAllProjects}
        />

        <CreateGameModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateGame={handleCreateGame}
          isGenerating={isAiLoading}
        />
      </>
    );
  }

  // View: Master Studio IDE
  return (
    <div className="flex flex-col h-screen w-screen bg-[#090d16] text-slate-100 overflow-hidden select-none font-sans">
      {/* 1. Top Navigation & Action Controls */}
      <TopBar
        project={activeProject}
        isRunning={isRunning}
        onToggleRun={() => setIsRunning((prev) => !prev)}
        onRestart={() => {
          setIsRunning(false);
          setTimeout(() => setIsRunning(true), 50);
        }}
        deviceMode={deviceMode}
        onDeviceModeChange={setDeviceMode}
        onDownloadSource={() => downloadSourceCodeZip(activeProject)}
        onDownloadBuild={() => downloadStandaloneGameBuild(activeProject)}
        onPublish={() => setIsPublishModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenVersions={() => setIsVersionsModalOpen(true)}
        onBackToDashboard={() => setView('dashboard')}
      />

      {/* 2. Main Studio Body (Sidebar + Editor + Live Preview) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Leftmost Mini Icon Switcher */}
        <aside className="w-11 bg-[#18181B] border-r border-[#27272A] flex flex-col items-center py-2.5 gap-2 z-10 flex-shrink-0">
          <button
            onClick={() => setSidebarTab('files')}
            title="Project File Explorer"
            className={`p-2 rounded-md transition-colors ${
              sidebarTab === 'files'
                ? 'bg-[#E95420]/15 text-[#E95420] border border-[#E95420]/30'
                : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#27272A]'
            }`}
          >
            <FolderTree className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSidebarTab('assets')}
            title="Procedural Assets & Sound Synth"
            className={`p-2 rounded-md transition-colors ${
              sidebarTab === 'assets'
                ? 'bg-[#E95420]/15 text-[#E95420] border border-[#E95420]/30'
                : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#27272A]'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSidebarTab('settings')}
            title="Game Engine & Physics Settings"
            className={`p-2 rounded-md transition-colors ${
              sidebarTab === 'settings'
                ? 'bg-[#E95420]/15 text-[#E95420] border border-[#E95420]/30'
                : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#27272A]'
            }`}
          >
            <Sliders className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSidebarTab('cultural')}
            title="African Cultural Context & History"
            className={`p-2 rounded-md transition-colors ${
              sidebarTab === 'cultural'
                ? 'bg-[#E95420]/15 text-[#E95420] border border-[#E95420]/30'
                : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#27272A]'
            }`}
          >
            <Globe className="w-4 h-4" />
          </button>

          <div className="mt-auto flex flex-col items-center gap-1.5">
            <button
              onClick={() => setIsVersionsModalOpen(true)}
              title="Version History"
              className="p-2 rounded-md text-[#71717A] hover:text-[#E95420] hover:bg-[#27272A]"
            >
              <History className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              title="Studio Settings"
              className="p-2 rounded-md text-[#71717A] hover:text-[#F4F4F5] hover:bg-[#27272A]"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* Left Secondary Panel (Explorer / Assets / Settings / Culture) */}
        <div className="w-60 bg-[#18181B] border-r border-[#27272A] flex-shrink-0 hidden md:block">
          {sidebarTab === 'files' && (
            <FileExplorer
              files={activeProject.files}
              activeFilePath={activeFilePath}
              onSelectFile={handleSelectFile}
              onCreateFile={handleCreateFile}
              onDeleteFile={handleDeleteFile}
              onRenameFile={handleRenameFile}
            />
          )}

          {sidebarTab === 'assets' && (
            <AssetManager
              files={activeProject.files}
              onInsertAssetCode={(snippet) => {
                const activeFile = activeProject.files.find((f) => f.path === activeFilePath);
                if (activeFile) {
                  const updated = activeFile.content + '\n\n' + snippet;
                  handleFileContentChange(activeFile.path, updated);
                }
              }}
            />
          )}

          {sidebarTab === 'settings' && (
            <GameSettingsPanel
              settings={activeProject.settings}
              onChange={(s) => handleSaveProject({ ...activeProject, settings: s })}
            />
          )}

          {sidebarTab === 'cultural' && (
            <CulturalMetaPanel
              culturalMeta={activeProject.culturalMeta}
              onChange={(meta) => handleSaveProject({ ...activeProject, culturalMeta: meta })}
            />
          )}
        </div>

        {/* Workspace: Monaco Code Editor + Live Phaser Preview */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#0F0F12]">
          {/* Layout Toggle Bar */}
          <div className="h-7 bg-[#121215] border-b border-[#27272A] px-3 flex items-center justify-between text-[11px] text-[#71717A]">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setLayoutMode('split')}
                className={`px-2 py-0.5 rounded text-xs transition-colors ${layoutMode === 'split' ? 'bg-[#27272A] text-[#E95420] font-semibold' : 'text-[#71717A] hover:text-[#D4D4D8]'}`}
              >
                Split View
              </button>
              <button
                onClick={() => setLayoutMode('code-only')}
                className={`px-2 py-0.5 rounded text-xs transition-colors ${layoutMode === 'code-only' ? 'bg-[#27272A] text-[#E95420] font-semibold' : 'text-[#71717A] hover:text-[#D4D4D8]'}`}
              >
                Code Only
              </button>
              <button
                onClick={() => setLayoutMode('preview-only')}
                className={`px-2 py-0.5 rounded text-xs transition-colors ${layoutMode === 'preview-only' ? 'bg-[#27272A] text-[#E95420] font-semibold' : 'text-[#71717A] hover:text-[#D4D4D8]'}`}
              >
                Preview Only
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[#E95420] text-xs">
              <Sparkles className="w-3 h-3" />
              <span>Phaser 3 + Gemini 2.5 Active</span>
            </div>
          </div>

          {/* Split Panes */}
          <div className="flex-1 flex overflow-hidden">
            {/* Monaco Code Editor Pane */}
            {(layoutMode === 'split' || layoutMode === 'code-only') && (
              <div className={`${layoutMode === 'split' ? 'w-1/2 border-r border-[#27272A]' : 'w-full'} h-full`}>
                <CodeEditor
                  files={activeProject.files}
                  activeFilePath={activeFilePath}
                  openTabs={openTabs}
                  onSelectTab={handleSelectFile}
                  onCloseTab={handleCloseTab}
                  onContentChange={handleFileContentChange}
                  onRunGame={() => {
                    setIsRunning(false);
                    setTimeout(() => setIsRunning(true), 50);
                  }}
                />
              </div>
            )}

            {/* Phaser Live Preview Pane */}
            {(layoutMode === 'split' || layoutMode === 'preview-only') && (
              <div className={`${layoutMode === 'split' ? 'w-1/2' : 'w-full'} h-full`}>
                <GamePreview
                  project={activeProject}
                  isRunning={isRunning}
                  onToggleRun={() => setIsRunning((prev) => !prev)}
                  onRestart={() => {
                    setIsRunning(false);
                    setTimeout(() => setIsRunning(true), 50);
                  }}
                  deviceMode={deviceMode}
                  onFixErrorWithAi={handleFixErrorWithAi}
                  isFixingError={isFixingError}
                />
              </div>
            )}
          </div>

          {/* 3. Bottom Collapsible AI Studio Assistant */}
          <AiPanel
            project={activeProject}
            onSendMessage={handleAiSendMessage}
            isLoading={isAiLoading}
            isExpanded={isAiPanelExpanded}
            onToggleExpand={() => setIsAiPanelExpanded((prev) => !prev)}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateGameModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateGame={handleCreateGame}
        isGenerating={isAiLoading}
      />

      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        project={activeProject}
        onUpdatePublishData={(pub) => handleSaveProject({ ...activeProject, publishData: pub })}
      />

      <VersionHistoryModal
        isOpen={isVersionsModalOpen}
        onClose={() => setIsVersionsModalOpen(false)}
        project={activeProject}
        onRestoreVersion={handleRestoreVersion}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
}
