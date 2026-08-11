import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-and-copy-assets',
      configureServer(server) {
        server.middlewares.use('/assets', (req, res, next) => {
          const filePath = path.join(__dirname, 'assets', req.url.split('?')[0]);
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            res.setHeader('Cache-Control', 'public, max-age=31536000');
            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes = {
              '.png': 'image/png',
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.svg': 'image/svg+xml',
              '.pdf': 'application/pdf',
              '.json': 'application/json'
            };
            if (mimeTypes[ext]) {
              res.setHeader('Content-Type', mimeTypes[ext]);
            }
            fs.createReadStream(filePath).pipe(res);
          } else {
            next();
          }
        });
      },
      closeBundle() {
        const srcDir = path.join(__dirname, 'assets');
        const destDir = path.join(__dirname, 'dist', 'assets');
        if (fs.existsSync(srcDir)) {
          fs.cpSync(srcDir, destDir, { recursive: true });
        }
      }
    }
  ],
  server: {
    port: 3000,
    host: true
  }
});
