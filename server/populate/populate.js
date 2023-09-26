import 'dotenv/config';
import { promises as fs }  from 'fs';
import mongoose from 'mongoose';
import {Joke as JokeModel} from "../db/jokes.model.js";

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1); // exit the current program
}

const populateJokes = async () => {
  await JokeModel.deleteMany({});

  const jokes = await fs.readFile('./populate/Jokes.json', 'utf8');
  ;
  await JokeModel.create(...JSON.parse(jokes));
  console.log("Jokes created");
};

const main = async () => {
  await mongoose.connect(mongoUrl);

  await populateJokes();

  await mongoose.disconnect();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});