import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import { initData } from './init/initData.js';
import cardsRouter from './routes/cards.js';
import usersRouter from './routes/users.js';

const envFile = process.env.NODE_ENV === 'production' ? '.env.atlas' : '.env';
dotenv.config({ path: envFile });
console.log(`🌍 Loaded ${envFile}`);
console.log(`🌱 Running in ${process.env.NODE_ENV || 'development'} mode`);

const app = express();
const PORT = process.env.PORT || 3700;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bcards-backend';

app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
  origin: true,
  credentials: true,
  methods: 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  allowedHeaders: 'Content-Type, Accept, Authorization',
}));

app.use((req, res, next) => {
  res.on('finish', () => {
    if (res.statusCode >= 400) {
      const logDir = path.join(process.cwd(), 'logs');
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
      }
      const logFile = path.join(logDir, `${new Date().toISOString().slice(0, 10)}.log`);
      const errorMessage = res.locals.errorMessage || res.statusMessage || '';
      const logEntry = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} → ${res.statusCode} ${errorMessage}\n`;
      fs.appendFileSync(logFile, logEntry);
    }
  });
  next();
});

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');
    await initData();
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};
await connectDB();

app.use('/cards', cardsRouter);
app.use('/users', usersRouter);
app.get('/', (req, res) => res.json({ message: "API is running" }));

app.use((req, res) => {
  res.status(404);
  res.locals.errorMessage = 'Route not found';
  res.json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.message);
  res.locals.errorMessage = err.message;
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
