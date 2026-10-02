import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  FileCode,
  FileJson,
  FileText,
  Plus,
  Trash2,
  Edit2,
  ChevronRight,
  ChevronDown,
  FilePlus,
  FolderPlus,
  Image,
  Music,
} from 'lucide-react';
import { ProjectFile } from '../../types';
import { buildFileTree, FileTreeNode } from '../../utils/fileTree';

interface FileExplorerProps {
  files: ProjectFile[];
  activeFilePath?: string;
  onSelectFile: (path: string) => void;
  onCreateFile: (path: string, content?: string) => void;
  onDeleteFile: (path: string) => void;
  onRenameFile: (oldPath: string, newPath: string) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  activeFilePath,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  onRenameFile,
}) => {
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({});
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const tree = buildFileTree(files);

  const toggleFolder = (path: string) => {
    setCollapsedFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    let path = newFileName.trim();
    if (!path.startsWith('src/') && !path.includes('/') && path.endsWith('.js')) {
      path = `src/scenes/${path}`;
    }

    onCreateFile(path, `// ${path}\nexport class ${path.split('/').pop()?.replace('.js', '')} {\n  constructor() {}\n}\n`);
    setNewFileName('');
    setIsCreatingFile(false);
  };

  const handleRenameSubmit = (oldPath: string, e: React.FormEvent) => {
    e.preventDefault();
    if (renameValue.trim() && renameValue !== oldPath) {
      onRenameFile(oldPath, renameValue.trim());
    }
    setEditingPath(null);
  };

  const renderFileIcon = (fileName: string) => {
    if (fileName.endsWith('.js') || fileName.endsWith('.jsx')) return <FileCode className="w-3.5 h-3.5 text-blue-400" />;
    if (fileName.endsWith('.json')) return <FileJson className="w-3.5 h-3.5 text-emerald-400" />;
    if (fileName.endsWith('.md')) return <FileText className="w-3.5 h-3.5 text-sky-400" />;
    if (fileName.match(/\.(png|jpg|svg|webp)$/i)) return <Image className="w-3.5 h-3.5 text-purple-400" />;
    if (fileName.match(/\.(mp3|wav|ogg)$/i)) return <Music className="w-3.5 h-3.5 text-rose-400" />;
    return <FileCode className="w-3.5 h-3.5 text-[#A1A1AA]" />;
  };

  const renderNode = (node: FileTreeNode, depth = 0) => {
    const isCollapsed = collapsedFolders[node.path];

    if (node.isFolder) {
      return (
        <div key={node.path} className="select-none">
          <div
            onClick={() => toggleFolder(node.path)}
            className="flex items-center gap-1.5 px-2 py-1 hover:bg-[#27272A] cursor-pointer rounded text-xs text-[#D4D4D8] transition-colors group"
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
          >
            {isCollapsed ? (
              <ChevronRight className="w-3 h-3 text-[#71717A]" />
            ) : (
              <ChevronDown className="w-3 h-3 text-[#71717A]" />
            )}
            {isCollapsed ? (
              <Folder className="w-3.5 h-3.5 text-[#A1A1AA]" />
            ) : (
              <FolderOpen className="w-3.5 h-3.5 text-[#E95420]" />
            )}
            <span className="font-medium text-[#D4D4D8] text-xs">{node.name}</span>
          </div>

          {!isCollapsed && (
            <div>
              {node.children.map((child) => renderNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    const isActive = activeFilePath === node.file?.path;
    const isRenaming = editingPath === node.file?.path;

    return (
      <div
        key={node.file?.path || node.id}
        className={`group flex items-center justify-between px-2 py-1 text-xs rounded transition-colors cursor-pointer ${
          isActive
            ? 'bg-[#27272A] text-[#F4F4F5] font-medium border-l-2 border-[#E95420] pl-1.5'
            : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#27272A]/60'
        }`}
        style={{ paddingLeft: `${depth * 12 + 14}px` }}
        onClick={() => node.file && onSelectFile(node.file.path)}
      >
        <div className="flex items-center gap-2 truncate">
          {renderFileIcon(node.name)}
          {isRenaming ? (
            <form
              onSubmit={(e) => handleRenameSubmit(node.file!.path, e)}
              onClick={(e) => e.stopPropagation()}
              className="flex-1"
            >
              <input
                type="text"
                autoFocus
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={() => setEditingPath(null)}
                className="bg-[#0F0F12] border border-[#E95420] text-white px-1 py-0.5 rounded text-xs w-full outline-none"
              />
            </form>
          ) : (
            <span className="truncate text-xs">{node.name}</span>
          )}
        </div>

        {/* Action icons on hover */}
        {!isRenaming && (
          <div className="hidden group-hover:flex items-center gap-1 opacity-80" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => {
                setEditingPath(node.file!.path);
                setRenameValue(node.file!.path);
              }}
              title="Rename file"
              className="p-0.5 hover:text-[#E95420]"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            {node.file?.path !== 'src/main.js' && (
              <button
                onClick={() => onDeleteFile(node.file!.path)}
                title="Delete file"
                className="p-0.5 hover:text-rose-400"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#18181B] select-none text-[#D4D4D8]">
      {/* File Tree Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#27272A]">
        <span className="text-[10px] font-bold tracking-wider uppercase text-[#71717A]">
          Explorer
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsCreatingFile(true)}
            title="Create New File"
            className="p-1 hover:bg-[#27272A] rounded text-[#A1A1AA] hover:text-[#E95420] transition-colors"
          >
            <FilePlus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* New File Inline Form */}
      {isCreatingFile && (
        <form onSubmit={handleCreateSubmit} className="p-2 bg-[#27272A] border-b border-[#3F3F46]">
          <div className="text-[10px] text-[#A1A1AA] mb-1">New File Path:</div>
          <div className="flex items-center gap-1">
            <input
              type="text"
              autoFocus
              placeholder="e.g. src/scenes/BossScene.js"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="flex-1 bg-[#0F0F12] border border-[#E95420] rounded px-2 py-1 text-xs text-white outline-none"
            />
            <button
              type="submit"
              className="bg-[#E95420] hover:bg-[#d94514] text-white px-2 py-1 rounded text-xs font-semibold"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsCreatingFile(false)}
              className="text-[#A1A1AA] hover:text-white px-1.5 py-1 text-xs"
            >
              ✕
            </button>
          </div>
        </form>
      )}

      {/* File Tree List */}
      <div className="flex-1 overflow-y-auto py-2 px-1">
        {tree.map((node) => renderNode(node, 0))}
      </div>
    </div>
  );
};
