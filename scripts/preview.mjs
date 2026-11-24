import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const port = Number(process.env.PORT || 4173);
const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
  '.mp3': 'audio/mpeg', '.woff2': 'font/woff2',
};

// Phục vụ bản build trên localhost với kiểu nội dung phù hợp cho từng tệp.
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const path = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!path.startsWith(resolve(root) + sep)) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    const info = await stat(path);
    if (!info.isFile()) { response.writeHead(404).end('Not found'); return; }
    response.writeHead(200, { 'Content-Type': mime[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    if (request.method === 'HEAD') { response.end(); return; }
    createReadStream(path).pipe(response);
  } catch {
    response.writeHead(404).end('Not found');
  }
});
server.listen(port, '127.0.0.1', () => console.log(`PolyGlot SRS: http://127.0.0.1:${port}`));
