import React from 'react';
import { History, RotateCcw, Clock, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { GameProject, VersionSnapshot } from '../../types';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: GameProject;
  onRestoreVersion: (versionId: string) => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  project,
  onRestoreVersion,
}) => {
  if (!isOpen) return null;

  const versions = project.versions || [];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#18181B] border border-[#27272A] rounded-lg w-full max-w-xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#27272A] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#E95420]/15 border border-[#E95420]/30 flex items-center justify-center text-[#E95420]">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F4F4F5]">Project Version Snapshots</h3>
              <p className="text-xs text-[#71717A]">Rollback to any previous state of your code and assets</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#71717A] hover:text-white rounded hover:bg-[#27272A]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Versions List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* Current Live Version */}
          <div className="bg-[#E95420]/10 border border-[#E95420]/30 rounded-md p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#E95420] animate-pulse" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#E95420]">Version {project.currentVersion || 1} (Current Live)</span>
                </div>
                <div className="text-[11px] text-[#A1A1AA] mt-0.5">Active working state</div>
              </div>
            </div>
            <span className="text-[10px] text-[#E95420] font-semibold bg-[#E95420]/20 px-2 py-0.5 rounded">Active</span>
          </div>

          {versions.length === 0 ? (
            <div className="text-center py-8 text-[#71717A] text-xs">
              No historical snapshots saved yet. Changes will be recorded automatically.
            </div>
          ) : (
            versions.map((ver) => (
              <div
                key={ver.id}
                className="bg-[#27272A]/50 border border-[#27272A] hover:border-[#3F3F46] rounded-md p-3 flex items-center justify-between transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  <Clock className="w-3.5 h-3.5 text-[#71717A] mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-[#F4F4F5]">
                      Version {ver.versionNumber}
                      <span className="text-[10px] ml-2 font-normal text-[#71717A] font-mono">
                        {new Date(ver.timestamp).toLocaleTimeString()} · {new Date(ver.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-[#A1A1AA] mt-0.5">{ver.description}</div>
                    <div className="text-[10px] text-[#71717A] mt-0.5 font-mono">
                      {ver.files.length} files saved ({ver.trigger})
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onRestoreVersion(ver.id);
                    onClose();
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 bg-[#27272A] hover:bg-[#E95420] hover:text-white text-[#D4D4D8] text-xs font-medium rounded border border-[#3F3F46]/60 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restore</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#27272A] bg-[#18181B] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-[#27272A] hover:bg-[#3F3F46] text-[#D4D4D8] hover:text-white rounded text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
