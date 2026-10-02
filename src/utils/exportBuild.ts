import { GameProject } from '../types';
import { generatePhaserIframeHtml } from './phaserRunner';

export function downloadStandaloneGameBuild(project: GameProject): void {
  const htmlContent = generatePhaserIframeHtml(project.files);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.name || 'game'}-standalone-build.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
