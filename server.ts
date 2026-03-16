import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  
  // API routes can go here
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/download', async (req, res) => {
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);
    
    try {
      const archivePath = path.join(__dirname, 'somoni-ai-project.tar.gz');
      // Create tarball excluding node_modules and other artifacts
      await execAsync(`tar -czf "${archivePath}" --exclude=node_modules --exclude=dist --exclude=.next --exclude=.git .`);
      
      res.download(archivePath, 'somoni-ai-project.tar.gz', (err) => {
        if (err) {
          console.error('Download error:', err);
        }
        // Cleanup after download
        import('fs').then(fs => fs.unlinkSync(archivePath)).catch(() => {});
      });
    } catch (error) {
      console.error('Archive creation failed:', error);
      res.status(500).send('Хатогӣ ҳангоми омодасозии файл');
    }
  });

  // Интеграция Vite
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
