import express from "express";
import { Joke as JokeModel } from "../repository/jokes.model.js";
import { User as UserModel } from "../repository/user.model.js";
import { shouldAuthenticate } from "../security/authentication.js";
import { getParsedJokeAuth, getParsedJokeNonAuth } from "../util/util.js";
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (req, res) => {
  try {

    const type = req.query.type === '' ? {} : { type: req.query.type };

    const user = await UserModel.findOne({ userName: req.userName });
    const jokes = type === '' ?
      await JokeModel.find().sort({created: -1}) :
      await JokeModel.find(type).populate('author').sort({created: -1});

    const resultJokes = jokes.map((joke) => {
      return req.autenticated
        ? getParsedJokeAuth(joke._doc, user)
        : getParsedJokeNonAuth(joke._doc)
    });

    res.status(200).json(resultJokes);

  } catch (err) {
    console.log(err);
  }
})

router.get('/types', async (req, res) => {
  try {
    const jokes = await JokeModel.find();
    const types = [...new Set(jokes.map((joke) => joke.type))];

    res.send(types).status(200);
  } catch (error) {
    console.log(error);
  }
})

router.get('/random', async (req, res) => {
  try {
    const randomJoke = await JokeModel.aggregate().sample(1)
    await JokeModel.populate(randomJoke, { path: 'author' });

    if (req.autenticated) {  
      const user = await UserModel.findOne({ userName: req.userName });
      const resultJoke = getParsedJokeAuth(randomJoke[0], user);
      
      res.status(200).json(resultJoke);
    } else {
      const resultJoke = getParsedJokeNonAuth(randomJoke[0]);
      res.status(200).json(resultJoke);
    }

  } catch (error) {
    console.log(error);
  }
});

router.put('/:id', shouldAuthenticate, async (req, res) => {
  const updates = req.body;
  const filter = {_id: req.params.id};
  try {
    const updatedJoke = await JokeModel.findOneAndUpdate(filter, updates, {new: true});
    res.status(200).json({success: true, message: 'Joke updated', updatedJoke});
  } catch (error) {
    console.log(error);
    res.status(500).json({success: false, message: 'Update failed', error})
  }
})

router.post('/new' ,shouldAuthenticate, async (req, res) => {
  try {
    const user = await UserModel.findOne({userName: req.userName});
    const newJoke = new JokeModel({
      setup: req.body.setup,
      punchline: req.body.punchline,
      type: req.body.type,
      likes: [],
      author: new mongoose.Types.ObjectId(user._id)
    });

    await newJoke.save();
    res.status(201).json({success: true, message: 'Joke saved', newJoke})
  } catch (error) {
    console.log(error);
    res.status(500).json({success: false, message: 'Save failed', error})
  }

});

router.delete('/:id', shouldAuthenticate, async (req, res) => {
  const jokeId = req.params.id;
  try {
    await JokeModel.findByIdAndDelete(jokeId);
    res.status(200).json({success: true, message: 'Joke deleted'});
  } catch (err) {
    console.log(err);
    res.status(500).json({success: false, error: err, message: 'Failed to delete joke'});
  }
})

export default router;
