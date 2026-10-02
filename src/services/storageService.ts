import { GameProject, ProjectFile, VersionSnapshot } from '../types';

const STORAGE_KEY = 'ubuntu_studio_my_projects_v4';
const LEGACY_STORAGE_KEY = 'ubuntu_studio_projects_v1';
const CURRENT_PROJECT_ID_KEY = 'ubuntu_studio_active_project_id';
const PURGE_GAMES_FLAG = 'ubuntu_studio_purged_all_games_v1';

export const storageService = {
  getProjects(): GameProject[] {
    try {
      // Purge any pre-existing or residual games
      if (!localStorage.getItem(PURGE_GAMES_FLAG)) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('ubuntu_studio_my_projects_v2');
        localStorage.removeItem('ubuntu_studio_my_projects_v3');
        localStorage.removeItem(LEGACY_STORAGE_KEY);
        localStorage.removeItem(CURRENT_PROJECT_ID_KEY);
        localStorage.setItem(PURGE_GAMES_FLAG, 'true');
        return [];
      }

      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed: GameProject[] = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      console.error('Error loading projects from storage:', e);
    }
    // Return empty array by default - no pre-seeded or lingering games
    return [];
  },

  clearAllProjects(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('ubuntu_studio_my_projects_v2');
      localStorage.removeItem('ubuntu_studio_my_projects_v3');
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      localStorage.removeItem(CURRENT_PROJECT_ID_KEY);
      localStorage.setItem(PURGE_GAMES_FLAG, 'true');
    } catch (e) {
      console.error('Error clearing projects from storage:', e);
    }
  },

  saveProjects(projects: GameProject[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Error saving projects to storage:', e);
    }
  },

  getProject(id: string): GameProject | null {
    const projects = this.getProjects();
    return projects.find((p) => p.id === id) || null;
  },

  saveProject(project: GameProject): void {
    const projects = this.getProjects();
    const index = projects.findIndex((p) => p.id === project.id);
    const updated = { ...project, updatedAt: Date.now() };

    if (index >= 0) {
      projects[index] = updated;
    } else {
      projects.unshift(updated);
    }
    this.saveProjects(projects);
  },

  deleteProject(id: string): void {
    const projects = this.getProjects().filter((p) => p.id !== id);
    this.saveProjects(projects);
  },

  duplicateProject(id: string): GameProject | null {
    const project = this.getProject(id);
    if (!project) return null;

    const copy: GameProject = {
      ...project,
      id: `proj-${Date.now()}`,
      name: `${project.name}-copy`,
      title: `${project.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      publishData: {
        ...project.publishData,
        isPublished: false,
        publicSlug: `${project.name}-copy`,
        playsCount: 0,
        likesCount: 0,
      },
    };
    this.saveProject(copy);
    return copy;
  },

  getActiveProjectId(): string | null {
    return localStorage.getItem(CURRENT_PROJECT_ID_KEY);
  },

  setActiveProjectId(id: string): void {
    localStorage.setItem(CURRENT_PROJECT_ID_KEY, id);
  },

  createSnapshot(project: GameProject, description: string, trigger: VersionSnapshot['trigger']): GameProject {
    const nextVer = (project.currentVersion || 1) + 1;
    const snapshot: VersionSnapshot = {
      id: `ver-${nextVer}-${Date.now()}`,
      versionNumber: nextVer,
      timestamp: Date.now(),
      description,
      files: JSON.parse(JSON.stringify(project.files)),
      settings: JSON.parse(JSON.stringify(project.settings)),
      trigger,
    };

    const updated: GameProject = {
      ...project,
      currentVersion: nextVer,
      versions: [snapshot, ...(project.versions || [])].slice(0, 30), // keep last 30 versions
    };

    this.saveProject(updated);
    return updated;
  },

  restoreSnapshot(project: GameProject, versionId: string): GameProject | null {
    const snapshot = project.versions?.find((v) => v.id === versionId);
    if (!snapshot) return null;

    const restored: GameProject = {
      ...project,
      files: JSON.parse(JSON.stringify(snapshot.files)),
      settings: snapshot.settings ? JSON.parse(JSON.stringify(snapshot.settings)) : project.settings,
      updatedAt: Date.now(),
    };

    return this.createSnapshot(restored, `Restored Version ${snapshot.versionNumber}`, 'restore');
  },
};
