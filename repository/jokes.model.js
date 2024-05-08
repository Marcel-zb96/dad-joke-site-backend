import mongoose from 'mongoose';

const { Schema } = mongoose;

const JokeSchema = new Schema({
  setup: String,
  punchline: String,
  type: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  likes: [{type: Schema.Types.ObjectId, ref: 'User'}],
  created: {
    type: Date,
    default: Date.now,
  },
});

const Joke = mongoose.model("Joke", JokeSchema);

export {Joke};