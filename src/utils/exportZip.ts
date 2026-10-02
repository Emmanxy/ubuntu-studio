import JSZip from 'jszip';
import { GameProject } from '../types';

export async function downloadSourceCodeZip(project: GameProject): Promise<void> {
  const zip = new JSZip();
  const rootFolder = zip.folder(project.name || 'my-ubuntu-game');

  if (!rootFolder) {
    throw new Error('Failed to create ZIP root folder');
  }

  // 1. Add all project files (src/main.js, scenes, etc.)
  project.files.forEach((file) => {
    rootFolder.file(file.path, file.content);
  });

  // 2. Ensure package.json exists
  if (!project.files.some((f) => f.path === 'package.json')) {
    rootFolder.file(
      'package.json',
      JSON.stringify(
        {
          name: project.name || 'ubuntu-studio-game',
          private: true,
          version: '1.0.0',
          type: 'module',
          scripts: {
            dev: 'vite',
            build: 'vite build',
            preview: 'vite preview',
          },
          dependencies: {
            phaser: '^3.80.1',
          },
          devDependencies: {
            vite: '^6.2.0',
          },
        },
        null,
        2,
      ),
    );
  }

  // 3. Ensure index.html exists
  if (!project.files.some((f) => f.path === 'index.html')) {
    rootFolder.file(
      'index.html',
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>${project.title || project.name || 'Ubuntu Studio Game'}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #0f172a;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      overflow: hidden;
      font-family: sans-serif;
    }
    #game-container {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  </style>
</head>
<body>
  <div id="game-container"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>`,
    );
  }

  // 4. Ensure vite.config.js exists
  if (!project.files.some((f) => f.path === 'vite.config.js')) {
    rootFolder.file(
      'vite.config.js',
      `import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    open: true
  },
  build: {
    target: 'esnext'
  }
});`,
    );
  }

  // 5. Ensure README.md exists
  if (!project.files.some((f) => f.path === 'README.md')) {
    rootFolder.file(
      'README.md',
      `# ${project.title || project.name}

Created with **Ubuntu Studio** — The AI 2D Game Development Studio.

## 🚀 Quick Start
1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run local development server:
\`\`\`bash
npm run dev
\`\`\`
Opens at \`http://localhost:5173\`

3. Build production bundle:
\`\`\`bash
npm run build
\`\`\`
Creates deployable assets in \`dist/\`.

## 🎮 Game Engine
- **Engine**: Phaser 3 (v3.80.1)
- **Language**: JavaScript (ES6 Modules)
- **Bundler**: Vite
`,
    );
  }

  // Generate ZIP blob and trigger browser download
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.name || 'ubuntu-game'}-source.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
