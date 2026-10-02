import React, { useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import {
  FileCode,
  X,
  Play,
  Check,
  Sparkles,
  Save,
  Code2,
  Minimize2,
  Maximize2,
  RotateCcw,
} from 'lucide-react';
import { ProjectFile } from '../../types';
import { getFileLanguage } from '../../utils/fileTree';

interface CodeEditorProps {
  files: ProjectFile[];
  activeFilePath?: string;
  openTabs: string[];
  onSelectTab: (path: string) => void;
  onCloseTab: (path: string) => void;
  onContentChange: (path: string, newContent: string) => void;
  onRunGame: () => void;
  hasUnsavedChanges?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  files,
  activeFilePath,
  openTabs,
  onSelectTab,
  onCloseTab,
  onContentChange,
  onRunGame,
  hasUnsavedChanges,
}) => {
  const editorRef = useRef<any>(null);

  const activeFile = files.find((f) => f.path === activeFilePath) || files[0];
  const language = activeFile ? getFileLanguage(activeFile.path) : 'javascript';

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Add Ctrl+S / Cmd+S shortcut to run game with updated code
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onRunGame();
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#0F0F12] select-none">
      {/* Editor Tabs Bar */}
      <div className="flex items-center justify-between bg-[#18181B] border-b border-[#27272A] px-2 pt-1 overflow-x-auto">
        <div className="flex items-center gap-0.5">
          {openTabs.map((path) => {
            const fileName = path.split('/').pop() || path;
            const isActive = activeFilePath === path;

            return (
              <div
                key={path}
                onClick={() => onSelectTab(path)}
                className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-t text-xs cursor-pointer border-t-2 transition-colors ${
                  isActive
                    ? 'bg-[#0F0F12] border-t-[#E95420] text-[#F4F4F5] font-medium'
                    : 'bg-[#18181B] border-t-transparent text-[#71717A] hover:text-[#D4D4D8] hover:bg-[#27272A]'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-blue-400" />
                <span className="truncate max-w-[120px]">{fileName}</span>
                {openTabs.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab(path);
                    }}
                    className="p-0.5 rounded hover:bg-[#3F3F46] text-[#71717A] hover:text-[#F4F4F5] ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pb-1 pr-2">
          <button
            onClick={onRunGame}
            title="Save & Run Code (Ctrl + S)"
            className="flex items-center gap-1 px-2.5 py-1 bg-[#E95420]/15 hover:bg-[#E95420]/25 text-[#E95420] border border-[#E95420]/40 rounded text-xs font-semibold transition-colors"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Apply & Run</span>
          </button>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="h-6 bg-[#121215] border-b border-[#27272A] px-3 flex items-center text-[11px] text-[#71717A]">
        <span>workspace</span>
        <span className="mx-1 text-[#3F3F46]">/</span>
        <span className="text-[#D4D4D8]">{activeFile?.path || 'src/main.js'}</span>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 relative">
        {activeFile ? (
          <Editor
            height="100%"
            path={activeFile.path}
            defaultLanguage={language}
            language={language}
            value={activeFile.content}
            theme="vs-dark"
            onMount={handleEditorDidMount}
            onChange={(value) => {
              if (value !== undefined) {
                onContentChange(activeFile.path, value);
              }
            }}
            options={{
              fontSize: 13,
              fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
              fontLigatures: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              lineNumbers: 'on',
              automaticLayout: true,
              tabSize: 2,
              formatOnPaste: true,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              padding: { top: 12, bottom: 12 },
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-[#71717A] text-sm">
            Select a file from the explorer to view code.
          </div>
        )}
      </div>

      {/* Editor Status Bar */}
      <div className="h-5 bg-[#18181B] border-t border-[#27272A] px-3 flex items-center justify-between text-[10px] text-[#71717A] font-mono">
        <div className="flex items-center gap-3">
          <span>{language.toUpperCase()}</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Phaser 3.80.1</span>
          <span className="text-emerald-400">● Live Sync</span>
        </div>
      </div>
    </div>
  );
};
