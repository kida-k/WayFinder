import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import suggestRoute from './routes/suggest.js';
import chatRoute from './routes/chat.js';

dotenv.config();

const app = express();
//const PORT = process.env.PORT || 3000;
const PORT = 3001; // Match your constants/api.ts

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', suggestRoute);
app.use('/api', chatRoute);

// Change this at the bottom of your index.js
//const PORT = 3001; // Match your constants/api.ts

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Wayfinder server is live!`);
  console.log(`Network: http://192.168.5.2:${PORT}`);
});