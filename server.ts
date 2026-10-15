import express from 'express';
import path from 'node:path';
import { apiApp } from './server/apiApp.ts';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Mount API endpoints
app.use(apiApp);

// In production, serve the built static Vite assets
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

// For client-side routing, fallback to index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`GetWell Eye Hospital server running on port ${PORT}`);
});
