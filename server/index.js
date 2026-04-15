import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import suggestRoute from './routes/suggest.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', suggestRoute);

app.listen(PORT, () => {
  console.log(`Wayfinder server running on port ${PORT}`);
});