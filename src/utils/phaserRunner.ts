import { ProjectFile } from '../types';

/**
 * Transforms ES6 import and export statements in game code into
 * a self-contained virtual module factory function.
 *
 * This guarantees that:
 * 1. No browser "Failed to resolve module specifier" errors ever occur with blob or relative URLs.
 * 2. Scene classes are reliably attached to `window` AND exported from modules.
 * 3. Both named and default imports work seamlessly regardless of whether .js is included.
 * 4. Relative paths like `./scenes/NcuvaScene.js` or `../scenes/GameScene` resolve cleanly.
 */
function transformEsModuleCode(rawCode: string, filePath: string): string {
  let code = rawCode;

  // Strip shebangs
  code = code.replace(/^#!.*\n/, '');

  // Track exported identifiers to assign them to window and module exports
  const exportedNames: string[] = [];

  // --- 1. TRANSFORMS IMPORTS ---

  // import A, { B, C } from 'path';
  code = code.replace(
    /(?:^|\n)\s*import\s+([A-Za-z0-9_$]+)\s*,\s*\{\s*([\s\S]*?)\s*\}\s*from\s*['"]([^'"]+)['"]\s*;?/g,
    (_, defId, named, importPath) => {
      const transformedNamed = named
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean)
        .map((s: string) => {
          const parts = s.split(/\s+as\s+/);
          return parts.length === 2 ? `${parts[0].trim()}: ${parts[1].trim()}` : parts[0].trim();
        })
        .join(', ');
      return `\nconst __def_${defId} = __require__('${importPath}', '${filePath}'); const ${defId} = __def_${defId}.default !== undefined ? __def_${defId}.default : __def_${defId}; const { ${transformedNamed} } = __def_${defId};`;
    },
  );

  // import * as A from 'path';
  code = code.replace(
    /(?:^|\n)\s*import\s*\*\s*as\s+([A-Za-z0-9_$]+)\s+from\s*['"]([^'"]+)['"]\s*;?/g,
    (_, id, importPath) => {
      return `\nconst ${id} = __require__('${importPath}', '${filePath}');`;
    },
  );

  // import { A, B as C } from 'path';
  code = code.replace(
    /(?:^|\n)\s*import\s*\{\s*([\s\S]*?)\s*\}\s*from\s*['"]([^'"]+)['"]\s*;?/g,
    (_, named, importPath) => {
      const transformedNamed = named
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean)
        .map((s: string) => {
          const parts = s.split(/\s+as\s+/);
          return parts.length === 2 ? `${parts[0].trim()}: ${parts[1].trim()}` : parts[0].trim();
        })
        .join(', ');
      return `\nconst { ${transformedNamed} } = __require__('${importPath}', '${filePath}');`;
    },
  );

  // import A from 'path';
  code = code.replace(
    /(?:^|\n)\s*import\s+([A-Za-z0-9_$]+)\s+from\s*['"]([^'"]+)['"]\s*;?/g,
    (_, id, importPath) => {
      return `\nconst __mod_${id} = __require__('${importPath}', '${filePath}'); const ${id} = __mod_${id}.default !== undefined ? __mod_${id}.default : (__mod_${id}.${id} !== undefined ? __mod_${id}.${id} : __mod_${id});`;
    },
  );

  // import 'path'; (side effect)
  code = code.replace(/(?:^|\n)\s*import\s*['"]([^'"]+)['"]\s*;?/g, (_, importPath) => {
    return `\n__require__('${importPath}', '${filePath}');`;
  });

  // --- 2. TRANSFORMS EXPORTS ---

  // export default class A [extends B]
  code = code.replace(/(?:^|\n)\s*export\s+default\s+class\s+([A-Za-z0-9_$]+)/g, (_, id) => {
    exportedNames.push(id);
    return `\nclass ${id}`;
  });

  // export class A [extends B]
  code = code.replace(/(?:^|\n)\s*export\s+class\s+([A-Za-z0-9_$]+)/g, (_, id) => {
    exportedNames.push(id);
    return `\nclass ${id}`;
  });

  // export default function A(...)
  code = code.replace(/(?:^|\n)\s*export\s+default\s+function\s+([A-Za-z0-9_$]+)/g, (_, id) => {
    exportedNames.push(id);
    return `\nfunction ${id}`;
  });

  // export function A(...)
  code = code.replace(/(?:^|\n)\s*export\s+function\s+([A-Za-z0-9_$]+)/g, (_, id) => {
    exportedNames.push(id);
    return `\nfunction ${id}`;
  });

  // export const/let/var A = ...
  code = code.replace(/(?:^|\n)\s*export\s+(const|let|var)\s+([A-Za-z0-9_$]+)\s*=/g, (_, decl, id) => {
    exportedNames.push(id);
    return `\n${decl} ${id} =`;
  });

  // export default <identifier>;
  code = code.replace(/(?:^|\n)\s*export\s+default\s+([A-Za-z0-9_$]+)\s*;?/g, (_, id) => {
    exportedNames.push(id);
    return `\n__exports__.default = ${id};`;
  });

  // export { A, B as C };
  code = code.replace(/(?:^|\n)\s*export\s*\{\s*([\s\S]*?)\s*\}\s*;?/g, (_, named) => {
    const statements = named
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean)
      .map((s: string) => {
        const parts = s.split(/\s+as\s+/);
        const local = parts[0].trim();
        const exported = (parts[1] || parts[0]).trim();
        return `__exports__.${exported} = ${local}; if (typeof window !== 'undefined') window.${exported} = ${local};`;
      })
      .join(' ');
    return `\n${statements}`;
  });

  // Post-module assignments for all exported identifiers
  const exportAssignments = exportedNames
    .map((name) => {
      return `if (typeof ${name} !== 'undefined') { __exports__.${name} = ${name}; if (!__exports__.default) __exports__.default = ${name}; if (typeof window !== 'undefined') window.${name} = ${name}; }`;
    })
    .join('\n');

  return `
function(require, __exports__, module) {
  const __filename = '${filePath}';
  const __require__ = require;
${code}
${exportAssignments}
}
`;
}

/**
 * Builds a self-contained HTML bundle with Phaser 3 and in-memory project modules.
 * Runs fluently in a sandboxed iframe with zero module resolution errors.
 */
export function generatePhaserIframeHtml(files: ProjectFile[]): string {
  const jsFiles = files.filter((f) => f.path.endsWith('.js') || f.path.endsWith('.jsx'));
  const mainFile =
    jsFiles.find((f) => f.path.endsWith('main.js') || f.path.endsWith('index.js')) ||
    jsFiles[0] || { path: 'src/main.js', content: '' };

  // Generate module registrations dictionary
  const transformedModules: Record<string, string> = {};
  jsFiles.forEach((file) => {
    transformedModules[file.path] = transformEsModuleCode(file.content, file.path);
  });

  // List of files to pre-execute in order: all non-main files first, then main last
  const nonMainPaths = jsFiles.map((f) => f.path).filter((p) => p !== mainFile.path);
  const mainPath = mainFile.path;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Ubuntu Studio Live Preview</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/phaser/3.80.1/phaser.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #120F0D;
      display: flex;
      justify-content: center;
      align-items: center;
      user-select: none;
      -webkit-user-select: none;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    #game-container, #phaser-game, #game {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    canvas {
      display: block;
      box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.6);
      border-radius: 6px;
      max-width: 100%;
      max-height: 100%;
    }
  </style>
</head>
<body>
  <div id="game-container"></div>
  <div id="phaser-game" style="display:none;"></div>
  <div id="game" style="display:none;"></div>

  <script>
    // 1. GLOBAL VIRTUAL CONTROLLER FOR MOBILE / TOUCH INPUT
    window.virtualInput = {
      left: false,
      right: false,
      up: false,
      down: false,
      jump: false,
      actionA: false,
      actionB: false
    };

    // 2. PHASER GAME CONSTRUCTOR HOOK (Guarantees window.game is always accessible)
    if (typeof Phaser !== 'undefined' && Phaser.Game) {
      var OriginalPhaserGame = Phaser.Game;
      Phaser.Game = function(config) {
        // Ensure default container if missing or not attached
        if (config && !config.parent) {
          config.parent = 'game-container';
        }
        var instance = new OriginalPhaserGame(config);
        window.game = instance;
        return instance;
      };
      Object.setPrototypeOf(Phaser.Game, OriginalPhaserGame);
      Phaser.Game.prototype = OriginalPhaserGame.prototype;
    }

    // 3. ERROR TRAP & NOTIFICATION
    window.onerror = function(message, source, lineno, colno, error) {
      console.error('[Ubuntu Studio Game Error]', message, error);
      window.parent.postMessage({
        type: 'UBUNTU_GAME_ERROR',
        error: {
          message: String(message),
          filename: source,
          lineno: lineno,
          colno: colno,
          stack: error ? error.stack : ''
        }
      }, '*');
      return false;
    };

    window.addEventListener('unhandledrejection', function(event) {
      console.error('[Ubuntu Studio Promise Error]', event.reason);
      window.parent.postMessage({
        type: 'UBUNTU_GAME_ERROR',
        error: {
          message: 'Unhandled Promise Rejection: ' + (event.reason ? (event.reason.message || event.reason) : 'Unknown'),
          stack: event.reason && event.reason.stack ? event.reason.stack : ''
        }
      }, '*');
    });

    // 4. PARENT MESSAGE HANDLER (D-pad input & restart commands)
    window.addEventListener('message', function(event) {
      if (!event.data) return;
      if (event.data.type === 'VIRTUAL_INPUT') {
        window.virtualInput = Object.assign(window.virtualInput, event.data.payload);
      } else if (event.data.type === 'RESTART_GAME') {
        if (window.game && window.game.scene) {
          try {
            var activeScenes = window.game.scene.getScenes(true);
            if (activeScenes.length > 0) {
              activeScenes.forEach(function(s) { s.scene.restart(); });
              return;
            }
          } catch(e) {}
        }
        window.location.reload();
      }
    });

    // 5. FPS METRICS REPORTING
    setInterval(function() {
      if (window.game && window.game.loop) {
        var fps = Math.round(window.game.loop.actualFps || 60);
        window.parent.postMessage({
          type: 'UBUNTU_GAME_METRICS',
          fps: fps
        }, '*');
      }
    }, 1000);

    // 6. IN-MEMORY VIRTUAL MODULE SYSTEM
    window.__modules__ = {};
    window.__module_cache__ = {};

    function __register__(path, factoryFn) {
      window.__modules__[path] = factoryFn;
    }

    function __resolvePath__(specifier, fromPath) {
      if (specifier === 'phaser' || specifier === 'Phaser') return '__phaser__';

      // Clean specifier
      var clean = specifier.replace(/^\\.\\//, '').replace(/^src\\//, '');

      // Direct match
      if (window.__modules__[specifier]) return specifier;
      if (window.__modules__['src/' + clean]) return 'src/' + clean;
      if (window.__modules__[clean]) return clean;

      // Relative path resolution
      if (fromPath) {
        var fromDir = fromPath.lastIndexOf('/') !== -1 ? fromPath.substring(0, fromPath.lastIndexOf('/')) : '';
        var combined = fromDir ? fromDir + '/' + specifier : specifier;
        var parts = combined.split('/');
        var stack = [];
        for (var i = 0; i < parts.length; i++) {
          var p = parts[i];
          if (p === '.' || p === '') continue;
          if (p === '..') {
            if (stack.length > 0) stack.pop();
          } else {
            stack.push(p);
          }
        }
        var resolved = stack.join('/');
        if (window.__modules__[resolved]) return resolved;
        if (window.__modules__[resolved + '.js']) return resolved + '.js';
        if (window.__modules__['src/' + resolved]) return 'src/' + resolved;
        if (window.__modules__['src/' + resolved + '.js']) return 'src/' + resolved + '.js';
      }

      // Fuzzy match by file basename
      var targetBase = specifier.split('/').pop().replace(/\\.js$/, '');
      var keys = Object.keys(window.__modules__);
      for (var k = 0; k < keys.length; k++) {
        var fileBase = keys[k].split('/').pop().replace(/\\.js$/, '');
        if (fileBase.toLowerCase() === targetBase.toLowerCase()) {
          return keys[k];
        }
      }

      return null;
    }

    function __require__(specifier, fromPath) {
      if (specifier === 'phaser' || specifier === 'Phaser') {
        return window.Phaser;
      }

      var target = __resolvePath__(specifier, fromPath);
      if (!target || !window.__modules__[target]) {
        // Fallback: check if identifier already exists on window
        var base = specifier.split('/').pop().replace(/\\.js$/, '');
        if (typeof window[base] !== 'undefined') {
          return { default: window[base], [base]: window[base] };
        }
        console.warn('[Ubuntu Studio] Could not resolve module:', specifier, 'from', fromPath);
        return {};
      }

      if (window.__module_cache__[target]) {
        return window.__module_cache__[target];
      }

      var factory = window.__modules__[target];
      var mod = { exports: {} };
      window.__module_cache__[target] = mod.exports;

      try {
        factory(function(subSpec) {
          return __require__(subSpec, target);
        }, mod.exports, mod);
        window.__module_cache__[target] = mod.exports;
        return mod.exports;
      } catch(err) {
        console.error('[Ubuntu Studio] Error executing module ' + target + ':', err);
        throw err;
      }
    }

    // 7. REGISTER ALL GAME MODULES
    ${Object.entries(transformedModules)
      .map(([path, code]) => `__register__('${path}', ${code});`)
      .join('\n')}

    // 8. BOOTSTRAP PROJECT IN ORDER
    try {
      // Execute scene modules first so their classes are exported and placed on window
      var preExecPaths = ${JSON.stringify(nonMainPaths)};
      preExecPaths.forEach(function(p) {
        try {
          __require__(p, '');
        } catch(e) {
          console.warn('[Ubuntu Studio] Pre-executing scene module warning for ' + p, e);
        }
      });

      // Execute main entry file
      var mainEntry = "${mainPath}";
      __require__(mainEntry, '');

      // Notify parent studio that game loaded successfully
      window.parent.postMessage({ type: 'UBUNTU_GAME_READY' }, '*');
    } catch(bootErr) {
      console.error('[Ubuntu Studio] Game Boot Failure:', bootErr);
      window.parent.postMessage({
        type: 'UBUNTU_GAME_ERROR',
        error: {
          message: bootErr.message || String(bootErr),
          stack: bootErr.stack || ''
        }
      }, '*');
    }
  </script>
</body>
</html>`;
}
