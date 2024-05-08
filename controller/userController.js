import express from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User as UserModel } from "../repository/user.model.js";
import { Joke as JokeModel } from "../repository/jokes.model.js";
import { shouldAuthenticate } from "../security/authentication.js";
import { parseUser } from '../util/util.js';
import mongoose from "mongoose";

const secret = process.env.TOKEN_SECRET;

const router = express.Router();

router.get('/', shouldAuthenticate, async (req, res) => {
  try {
    const user = await UserModel.findOne({ userName: req.userName });
    const parsedUser = parseUser(user);
    res.status(200).send({success: true, parsedUser});
  } catch (error) {
    console.error(error);
    res.status(404).send({success: false, error});
  }
});

router.get('/jokes', shouldAuthenticate, async (req, res) => {
  try {
    const user = await UserModel.findOne({ userName: req.userName });
    const jokes = await JokeModel.find({ author: new mongoose.Types.ObjectId(user._id) }).sort({created: -1});
    
    res.status(200).json({success: true, jokes});

  } catch (err) {
    console.log(err);
    res.send({success: false, message: "Something went wrong", error: err});
  }
})

router.put('/', shouldAuthenticate, async (req, res) => {
  const filter = {userName: req.userName};
  const updates = req.body.userUpdates;
  try {
    const updatedUser = await UserModel.findOneAndUpdate(filter, updates, {new: true});
    const parsedUser = parseUser(updatedUser);
    const newToken = jwt.sign({ userName: req.body.userUpdates.userName }, secret)
    res.status(200).json({success: true, message: 'User updated', parsedUser, newToken});
  } catch (error) {
    console.log(error);
    res.status(500).json({success: false, message: 'Update failed', error})
  }
})

router.patch('/pwchange', shouldAuthenticate, async (req, res) => {
  const oldPw = req.body.pwS.oldPw;
  const newHashedPw = await bcrypt.hash(req.body.pwS.newPw, 10);
  const userName = req.userName;

  try {
    const user = await UserModel.findOne({ userName });
    bcrypt.compare(oldPw, user.password, async (err, result) => {
      if (result) {
        user.password = newHashedPw;
        await user.save();
        return res.status(200).json({success: true, message: "Password updated!"});
      } else {
        return res.status(401).json({ success: false, message: "Incorrect password", error: err });
      }
    })

  } catch (err) {
    console.log(err)
    res.status(401).json({ success: 'User not found' });
  }

})

router.post('/register', async (req, res) => {

  const email = req.body.email;
  const userName = req.body.userName;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const hashedPw = await bcrypt.hash(req.body.password, 10);
  const createdAt = Date.now();
  const user = new UserModel({
    userName,
    firstName,
    lastName,
    email,
    password: hashedPw,
    createdAt
  });

  try {
    await user.save();
    res.status(201).json({ success: true, message: 'User created' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error })
  }
});

router.post('/login', async (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;

  try {
    const user = await UserModel.findOne({ userName });
    if (!user) {
      return res.status(401).json({ success: false, message: "Incorrect username" });
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        const token = jwt.sign({ userName }, secret)
        return res.status(200).json({ success: true, message: "User authenticated", token });
      } else {
        return res.status(401).json({ success: false, message: "Incorrect password" });
      }
    })

  } catch (err) {
    console.log("User not found")
    res.status(401).json({ success: 'User not found' });
  }
});


export default router;