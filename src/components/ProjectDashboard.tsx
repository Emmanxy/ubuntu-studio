import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Play,
  Download,
  Copy,
  Trash2,
  Search,
  Gamepad2,
  FolderOpen,
  Globe,
  X,
  ArrowUpDown,
  Clock,
  HeartHandshake,
} from 'lucide-react';
import { GameProject } from '../types';

interface ProjectDashboardProps {
  projects: GameProject[];
  onOpenProject: (id: string) => void;
  onPlayGame: (id: string) => void;
  onCreateNew: () => void;
  onDownloadZip: (project: GameProject) => void;
  onDuplicateProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onClearAllProjects?: () => void;
}

type SortOrder = 'updated' | 'created' | 'title';

const WELCOME_BANNER_KEY = 'ubuntu_studio_welcome_dismissed_v2';

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({
  projects,
  onOpenProject,
  onPlayGame,
  onCreateNew,
  onDownloadZip,
  onDuplicateProject,
  onDeleteProject,
  onClearAllProjects,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOrder>('updated');
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const isDismissed = localStorage.getItem(WELCOME_BANNER_KEY);
    if (isDismissed === 'true') {
      setShowWelcome(false);
    }
  }, []);

  const handleDismissBanner = () => {
    setShowWelcome(false);
    localStorage.setItem(WELCOME_BANNER_KEY, 'true');
  };

  const filteredProjects = projects
    .filter((proj) => {
      const matchesSearch =
        (proj.title || proj.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (proj.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (proj.culturalMeta?.historicalTopic || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'updated') {
        return (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0);
      }
      if (sortBy === 'created') {
        return (b.createdAt || 0) - (a.createdAt || 0);
      }
      return (a.title || a.name).localeCompare(b.title || b.name);
    });

  return (
    <div className="min-h-screen bg-[#120F0D] text-[#D4CCC4] flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-[#3D2B1F] bg-[#1A1512]/95 backdrop-blur px-6 py-4 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E95420] via-[#F0B429] to-[#E95420] flex items-center justify-center text-white shadow-lg shadow-[#E95420]/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-[#FDFBF7] tracking-tight">
                  Ubuntu Studio
                </h1>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#E95420]/15 text-[#E95420] font-semibold border border-[#E95420]/30">
                  Heritage Day Edition
                </span>
              </div>
              <p className="text-xs text-[#A89F91]">
                Celebrate culture through play — Beginner-friendly AI 2D game creator
              </p>
            </div>
          </div>

          <button
            onClick={onCreateNew}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#E95420] hover:bg-[#d94514] text-white rounded-xl font-bold text-xs transition-all shadow-md shadow-[#E95420]/25 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ New Game</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl w-full mx-auto p-6 flex-1 flex flex-col gap-6">
        {/* Subtle Welcome Banner for Heritage Day */}
        {showWelcome && (
          <div className="bg-gradient-to-r from-[#2B1D15] via-[#241913] to-[#1F1510] border border-[#523A2A] rounded-2xl p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 shadow-lg shadow-black/30">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#F0B429]/15 border border-[#F0B429]/30 text-[#F0B429] flex-shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#FDFBF7] flex items-center gap-2">
                  <span>Welcome to Ubuntu Studio</span>
                  <span className="text-[11px] font-normal text-[#F0B429]">(South African Heritage Day)</span>
                </h2>
                <p className="text-xs text-[#D4CCC4] mt-0.5 leading-relaxed">
                  Create 2D games inspired by African heritage. Just describe your idea in plain language and Gemini AI builds the entire game for you.
                </p>
              </div>
            </div>

            <button
              onClick={handleDismissBanner}
              title="Dismiss announcement"
              className="text-[#A89F91] hover:text-[#FDFBF7] p-1.5 rounded-lg hover:bg-[#3D2B1F] transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Section Header: My Projects */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div>
            <h2 className="text-base font-bold text-[#FDFBF7] flex items-center gap-2">
              <span>My Projects</span>
              <span className="text-xs font-normal text-[#A89F91]">
                ({projects.length} {projects.length === 1 ? 'game' : 'games'})
              </span>
            </h2>
            <p className="text-xs text-[#A89F91]">Your personal game studio creations</p>
          </div>

          {/* Header Actions: Search, Sort & Clear All (if user has projects) */}
          {projects.length > 0 && (
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search Bar */}
              <div className="relative min-w-[180px] sm:min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-[#7A7067] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search games..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#1A1512] border border-[#3D2B1F] text-xs text-[#FDFBF7] pl-8 pr-3 py-2 rounded-xl focus:border-[#E95420] outline-none placeholder-[#7A7067] transition-colors"
                />
              </div>

              {/* Sort Order Selector */}
              <div className="flex items-center gap-1 bg-[#1A1512] border border-[#3D2B1F] rounded-xl px-2.5 py-1.5 text-xs text-[#D4CCC4]">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#A89F91]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOrder)}
                  aria-label="Sort projects"
                  className="bg-transparent border-none outline-none text-xs text-[#D4CCC4] cursor-pointer"
                >
                  <option value="updated" className="bg-[#1A1512] text-[#FDFBF7]">Last Updated</option>
                  <option value="created" className="bg-[#1A1512] text-[#FDFBF7]">Newest First</option>
                  <option value="title" className="bg-[#1A1512] text-[#FDFBF7]">Title (A-Z)</option>
                </select>
              </div>

              {/* Remove All Games Button */}
              {onClearAllProjects && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to remove all games? This will delete all games from your studio.')) {
                      onClearAllProjects();
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#251815] hover:bg-rose-950/60 text-rose-300 hover:text-rose-200 border border-rose-900/40 hover:border-rose-700/60 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95"
                  title="Remove all games from studio"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Remove All Games</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Empty State: Clean and focused without any demo games */}
        {projects.length === 0 ? (
          <div className="bg-[#181412] border border-[#3D2B1F] rounded-3xl p-8 sm:p-12 flex flex-col items-center text-center max-w-2xl mx-auto w-full my-6 shadow-xl shadow-black/40">
            <div className="w-16 h-16 rounded-3xl bg-[#251C17] border border-[#3D2B1F] flex items-center justify-center text-[#E95420] shadow-lg mb-4">
              <Gamepad2 className="w-8 h-8 opacity-80" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[#FDFBF7]">
              No Games
            </h3>
            <p className="text-xs sm:text-sm text-[#A89F91] mt-2 max-w-md leading-relaxed">
              All games have been removed. Your studio is completely clear.
            </p>

            <button
              onClick={onCreateNew}
              className="mt-6 px-6 py-3 bg-[#E95420] hover:bg-[#d94514] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#E95420]/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create New Game</span>
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          /* Search yielded no results */
          <div className="text-center py-12 bg-[#181412] rounded-2xl border border-[#3D2B1F] flex flex-col items-center gap-3">
            <Search className="w-8 h-8 text-[#7A7067]" />
            <div className="text-[#FDFBF7] font-medium text-sm">No games matching "{searchTerm}"</div>
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-[#E95420] hover:underline"
            >
              Clear search query
            </button>
          </div>
        ) : (
          /* Project Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-[#181412] border border-[#3D2B1F] hover:border-[#5C412F] rounded-2xl p-5 flex flex-col justify-between group transition-all shadow-md shadow-black/20"
              >
                <div>
                  {/* Card Header: Type Badge & Version */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#E95420] bg-[#E95420]/10 border border-[#E95420]/25 px-2.5 py-0.5 rounded-full">
                      {project.gameType || '2D Game'}
                    </span>
                    <span className="text-[11px] text-[#8C8276] flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {new Date(project.updatedAt || project.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-sm font-bold text-[#FDFBF7] group-hover:text-[#E95420] transition-colors line-clamp-1">
                    {project.title || project.name}
                  </h3>
                  <p className="text-xs text-[#A89F91] mt-1.5 line-clamp-2 leading-relaxed">
                    {project.description || '2D Game created in Ubuntu Studio.'}
                  </p>

                  {/* Cultural Context Badge if present */}
                  {project.culturalMeta?.historicalTopic && (
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#F0B429] bg-[#F0B429]/10 border border-[#F0B429]/20 px-2.5 py-1 rounded-lg">
                      <Globe className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{project.culturalMeta.historicalTopic}</span>
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="mt-5 pt-3.5 border-t border-[#2F2218] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenProject(project.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E95420] hover:bg-[#d94514] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>Open Studio</span>
                    </button>

                    <button
                      onClick={() => onPlayGame(project.id)}
                      title="Play Game"
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-[#2A211B] hover:bg-[#382B22] text-[#D4CCC4] hover:text-[#FDFBF7] rounded-xl text-xs font-semibold border border-[#3D2B1F] transition-colors"
                    >
                      <Play className="w-3 h-3 text-[#F0B429] fill-current" />
                      <span>Play</span>
                    </button>
                  </div>

                  {/* Secondary Actions */}
                  <div className="flex items-center gap-1 text-[#8C8276]">
                    <button
                      onClick={() => onDownloadZip(project)}
                      title="Export Source Code (ZIP)"
                      className="p-1.5 hover:text-[#E95420] hover:bg-[#2A211B] rounded-lg transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDuplicateProject(project.id)}
                      title="Duplicate Project"
                      className="p-1.5 hover:text-[#F0B429] hover:bg-[#2A211B] rounded-lg transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteProject(project.id)}
                      title="Delete Project"
                      className="p-1.5 hover:text-rose-400 hover:bg-[#2A211B] rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
