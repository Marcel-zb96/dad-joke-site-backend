import 'dotenv/config';
import express from "express";

import JokeRouter from './controller/jokeController.js';
import UserRouter from './controller/userController.js';
import { getAuthenticated } from './security/authentication.js';

const { MONGO_URL, PORT = 3000 } = process.env;

if (!MONGO_URL) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1);
}

const app = express();

app.use(express.json());

app.use(getAuthenticated);

app.use('/api/jokes', JokeRouter);

app.use('/api/user', UserRouter);
  
export default app;