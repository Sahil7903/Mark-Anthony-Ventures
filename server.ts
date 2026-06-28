import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './server/config/db';
import { errorHandler } from './server/middleware/errorHandler';

import authRoutes from './server/routes/authRoutes';
import bookRoutes from './server/routes/bookRoutes';
import memberRoutes from './server/routes/memberRoutes';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Connect to Database
  if (process.env.DATABASE_URL) {
    connectDB().catch(console.error);
  } else {
    console.warn("WARNING: DATABASE_URL is missing. Please set it in your .env file.");
  }

  // Middleware
  app.use(cors());
  app.use(express.json());

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/books', bookRoutes);
  app.use('/api/members', memberRoutes);

  // Health check route
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Library Management System API is running' });
  });

  // Global Error Handler
  app.use(errorHandler);

  // Vite middleware for development (Frontend fallback)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
