import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  password: {type: String, required: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  userName: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  createdAt: {type: Date, default: Date.now},
});

const User = mongoose.model("User", userSchema);

export {User};

