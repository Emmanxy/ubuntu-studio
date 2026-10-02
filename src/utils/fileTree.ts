import { ProjectFile } from '../types';

export interface FileTreeNode {
  id: string;
  name: string;
  path: string;
  isFolder: boolean;
  file?: ProjectFile;
  children: FileTreeNode[];
}

export function buildFileTree(files: ProjectFile[]): FileTreeNode[] {
  const root: FileTreeNode = {
    id: 'root',
    name: 'root',
    path: '',
    isFolder: true,
    children: [],
  };

  files.forEach((file) => {
    const parts = file.path.split('/');
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      const currentPath = parts.slice(0, i + 1).join('/');

      let existing = current.children.find((c) => c.name === part);

      if (!existing) {
        existing = {
          id: isLast ? file.id : `dir-${currentPath}`,
          name: part,
          path: currentPath,
          isFolder: !isLast,
          file: isLast ? file : undefined,
          children: [],
        };
        current.children.push(existing);
      }

      current = existing;
    }
  });

  // Sort: folders first, then alphabetical
  function sortNodes(nodes: FileTreeNode[]) {
    nodes.sort((a, b) => {
      if (a.isFolder && !b.isFolder) return -1;
      if (!a.isFolder && b.isFolder) return 1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach((n) => {
      if (n.children.length > 0) sortNodes(n.children);
    });
  }

  sortNodes(root.children);
  return root.children;
}

export function getFileLanguage(filePath: string): ProjectFile['language'] {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx') || filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    return 'javascript';
  }
  if (filePath.endsWith('.json')) return 'json';
  if (filePath.endsWith('.md')) return 'markdown';
  if (filePath.endsWith('.html')) return 'html';
  if (filePath.endsWith('.css')) return 'css';
  if (filePath.match(/\.(png|jpg|jpeg|webp|svg)$/i)) return 'image';
  if (filePath.match(/\.(mp3|wav|ogg)$/i)) return 'audio';
  return 'javascript';
}
