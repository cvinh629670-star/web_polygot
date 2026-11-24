import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const features = ['production', 'listening', 'vocabulary', 'flashcards', 'zombie', 'nemesis', 'vip'];

// Ghép các phòng học vào template và chỉ ghi lại HTML khi nội dung thay đổi.
export function buildHtml() {
  let html = readFileSync(new URL('index.template.html', root), 'utf8');
  for (const feature of features) {
    const marker = `<!-- INCLUDE:${feature} -->`;
    if (!html.includes(marker)) throw new Error(`Missing feature placeholder: ${marker}`);
    html = html.replace(marker, readFileSync(new URL(`partials/${feature}.html`, root), 'utf8'));
  }
  if (html.includes('<!-- INCLUDE:')) throw new Error('Unresolved feature placeholder.');
  const target = new URL('index.html', root);
  if (!existsSync(target) || readFileSync(target, 'utf8') !== html) writeFileSync(target, html, 'utf8');
  return fileURLToPath(target);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  console.log(`Generated ${buildHtml()}`);
}
