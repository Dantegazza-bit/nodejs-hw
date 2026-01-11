const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pinoHttp = require('pino-http');

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(pinoHttp());

// ===== Routes =====
app.get('/notes', (req, res) => {
  res.status(200).json({
    message: 'Retrieved all notes',
  });
});

app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;

  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

// ===== 404 Middleware =====
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

// ===== Error (500) Middleware =====
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
