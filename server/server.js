import 'dotenv/config';
import express from "express";
import mongoose from 'mongoose';
import { Joke as JokeModel } from "./db/jokes.model.js";

const { MONGO_URL, PORT = 3000 } = process.env;

if (!MONGO_URL) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1);
}

const app = express();
app.use(express.json());

// Type endpoints after this line

async function createJokeList() {
  try {
    const jokes = await JokeModel.find({});
    return jokes
  } catch (error) {
    console.log(err);
  }
}


app.get('/api/jokes', async (req, res) => {
  const jokeList = await createJokeList();
  res.send(jokeList).status(200)
})

app.get('/api/jokes/:author', async (req, res) => {
  const author = req.params.author;
  try {
    const data = await JokeModel.find({ author: author });
    res.send(data);
  } catch (err) {
    res.status(555).send(console.error(err));
  }
});

app.post('/api/jokes/new', (req, res) => {
    const setup = req.body.setup;
    const punchline = req.body.punchline;
    const type = req.body.type;
    const author = req.body.author;
    const likes = 0;
    const created = Date.now();
    const newJoke = new JokeModel ({
      setup,
      punchline,
      type,
      author,
      likes,
      created
    });
    newJoke.save()
      .then((newJoke) => {res.status(200).send(newJoke)})
      .catch((err) => {res.status(444).send(err)})
});


// Type endpoints before this line

const main = async () => {
  await mongoose.connect(MONGO_URL);

  app.listen(PORT, () => {
    console.log("App is listening on 3000");
  });
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});