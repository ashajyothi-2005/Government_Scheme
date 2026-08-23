import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import fs from 'fs';
import apiRouter from './routes/api.ts';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 10000;

  // Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', app: 'SchemeSahay', timestamp: new Date().toISOString() });
  });

  // Mount API router
  app.use('/api', apiRouter);

  // Check if dist folder exists (forces production static mode if built)
  const distPath = path.resolve(process.cwd(), 'dist');
  const isProduction = process.env.NODE_ENV === 'production' || fs.existsSync(distPath);

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: 'localhost', hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static frontend files from dist folder
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const listen = (port: number) => {
    const server = app.listen(port, '0.0.0.0', () => {
      const address = server.address();
      const activePort = typeof address === 'object' && address ? address.port : port;
      console.log(`🇮🇳 SchemeSahay server running on http://0.0.0.0:${activePort}`);
    });
    server.once('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE' && port === PORT) {
        console.warn(`Port ${PORT} is busy. Selecting an available port.`);
        listen(0);
        return;
      }
      throw error;
    });
  };

  listen(PORT);
}

startServer().catch((err) => {
  console.error('Failed to start SchemeSahay server:', err);
  process.exit(1);
});