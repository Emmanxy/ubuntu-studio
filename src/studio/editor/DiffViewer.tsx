import React from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { Check, X, ArrowLeft } from 'lucide-react';

interface DiffViewerProps {
  originalCode: string;
  modifiedCode: string;
  filePath: string;
  explanation?: string;
  onAccept: () => void;
  onReject: () => void;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  originalCode,
  modifiedCode,
  filePath,
  explanation,
  onAccept,
  onReject,
}) => {
  return (
    <div className="flex flex-col h-full bg-[#0d111a] select-none">
      {/* Header with Accept / Reject buttons */}
      <div className="h-10 bg-[#151c2c] border-b border-[#232d42] px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-400">AI Code Review:</span>
          <span className="text-xs font-mono text-slate-300">{filePath}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReject}
            className="flex items-center gap-1 px-3 py-1 bg-[#1e2738] hover:bg-[#28354d] text-slate-300 border border-[#2e3b54] rounded text-xs transition-colors"
          >
            <X className="w-3.5 h-3.5 text-rose-400" />
            <span>Discard</span>
          </button>
          <button
            onClick={onAccept}
            className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold shadow-md shadow-emerald-950/40 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Accept Changes</span>
          </button>
        </div>
      </div>

      {explanation && (
        <div className="bg-amber-950/30 border-b border-amber-800/40 px-4 py-2 text-xs text-amber-200">
          💡 {explanation}
        </div>
      )}

      <div className="flex-1 relative">
        <DiffEditor
          height="100%"
          original={originalCode}
          modified={modifiedCode}
          language="javascript"
          theme="vs-dark"
          options={{
            readOnly: true,
            fontSize: 13,
            renderSideBySide: true,
            automaticLayout: true,
            minimap: { enabled: false },
          }}
        />
      </div>
    </div>
  );
};
