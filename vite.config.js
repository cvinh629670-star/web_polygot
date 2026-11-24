import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { buildHtml } from './scripts/build-html.mjs';

export default defineConfig(({ command, isPreview, mode }) => ({
  base: './',
  define: { 'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development') },
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'polyglot-existing-html',
      configResolved() { buildHtml(); },
      // Ghép lại trang khi template hoặc nội dung của một phòng học thay đổi.
      configureServer(server) {
        server.watcher.add(['index.template.html', 'partials/**/*.html']);
        server.watcher.on('change', (file) => {
          if (file.endsWith('index.template.html') || /[/\\]partials[/\\].+\.html$/.test(file)) buildHtml();
        });
      },
      transformIndexHtml: {
        order: 'pre',
        handler(html) {
          if (command !== 'serve' || isPreview) return html;
          return html
            .replace('<link rel="stylesheet" href="./assets/app-ui.css">', '')
            .replace('<script defer src="./assets/app-ui.js"></script>', '<script type="module" src="/src/main.jsx"></script>');
        },
      },
    },
  ],
  // Xuất bundle tự chạy để index.html mở được trực tiếp từ ổ đĩa.
  build: {
    outDir: 'assets',
    emptyOutDir: false,
    cssCodeSplit: false,
    minify: true,
    target: 'es2020',
    lib: {
      entry: fileURLToPath(new URL('./src/main.jsx', import.meta.url)),
      name: 'PolyGlotModernUI',
      formats: ['iife'],
      fileName: () => 'app-ui.js',
      cssFileName: 'app-ui',
    },
  },
}));
