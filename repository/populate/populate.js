import 'dotenv/config';
import { promises as fs } from 'fs';
import mongoose from 'mongoose';
import { Joke as JokeModel } from "../jokes.model.js";
import { User as UserModel } from "../user.model.js";
import bcrypt from 'bcrypt';

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1); // exit the current program
}

const populateUsers = async () => {
  await UserModel.deleteMany({});

  await UserModel.create({
    password: await bcrypt.hash("anonymus", 10),
    firstName: "anonymus",
    lastName: "anonymus",
    userName: "anonymus",
    email: "anonymus@anonymus.hu",
    createdAt: Date.now(),
    likes: [],
  })
}

const populateJokes = async () => {
  await JokeModel.deleteMany({});
  const user = await UserModel.findOne({ userName: "anonymus" });
  const jokes = await fs.readFile('./Jokes.json', 'utf8');
  const jokesArr = await JSON.parse(jokes).map(e => {
    return {
      ...e,
      author: user._id,
      likes: [new mongoose.Types.ObjectId(user._id)],
    }
  });

  await JokeModel.create(...jokesArr);
  console.log("Jokes created");
}

const main = async () => {
  await mongoose.connect(mongoUrl);
  await populateUsers();
  await populateJokes();

  await mongoose.disconnect();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});