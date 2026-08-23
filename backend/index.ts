import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import apiRouter from './routes/api.ts';

dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'SchemeSahay', timestamp: new Date().toISOString() });
});

// Mount API router
app.use('/api', apiRouter);

// Export app for Vercel Serverless Functions
export default app;