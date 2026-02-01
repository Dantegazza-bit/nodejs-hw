import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';

import { connectMongoDB } from './db/connectMongoDB.js';

import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

const startServer = async () => {
  await connectMongoDB();

  const app = express();

  app.use(logger);

  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(cookieParser());

  // ✅ ОБИДВА без префікса
  app.use(authRoutes);
  app.use(notesRoutes);

  app.use(errors());
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
