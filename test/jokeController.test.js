import jwt from 'jsonwebtoken';
import request from 'supertest';
import mongoose from 'mongoose';

import { User as UserModel } from "../repository/user.model.js";
import { Joke as JokeModel } from "../repository/jokes.model.js";
import app from '../app.js';
import { response } from 'express';

const validToken = jwt.sign({ userName: "anonymus" }, process.env.TOKEN_SECRET);
const invalidToken = "invalid-token";

const fullJokesAuth = [ {
  _id: '663891c350d18ca8c0ed7b9a',
  setup: 'test',
  punchline: 'test',
  type: 'test',
  author: 'anonymus',
  likes: 1,
  created: '2024-05-06T08:16:03.132Z',
  __v: 0,
  likedByUser: true
}];

const fullJokesNonAuth = [ {
  _id: '663891c350d18ca8c0ed7b9a',
  setup: 'test',
  punchline: 'Really funny punchline',
  type: 'test',
  author: 'anonymus',
  likes: 1,
  created: '2024-05-06T08:16:03.132Z',
  __v: 0,
  likedByUser: false
}];

const updatedJoke = {
    "_id": "663891c350d18ca8c0ed7b9a",
    "setup": "test2",
    "punchline": "test2",
    "type": "test2",
    "author": "663891c250d18ca8c0ed7b94",
    "likes": ["663891c250d18ca8c0ed7b94"],
    "created": "2024-05-06T08:16:03.132Z",
    "__v": 0
}

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL + 'mad_joketest');
});

afterAll(async () => {
  await mongoose.disconnect();
});

beforeEach(async () => {
  await UserModel.findOneAndUpdate({userName: 'anonymus2'}, {userName: 'anonymus'});
  await JokeModel.findByIdAndUpdate('663891c350d18ca8c0ed7b9a', {setup: 'test', punchline: 'test', type: 'test'});
  await JokeModel.findOneAndDelete({setup: 'test_new'});
})

describe('GET /api/jokes/', () => {

  describe('when provided a valid token', () => {
    test("should return with 200 and all jokes by type with valid punchline", async () => {
      const response = await request(app).get("/api/jokes?type=test").auth(validToken, { type: 'bearer' });
      expect(response.status).toEqual(200);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body).toEqual(fullJokesAuth);
      expect(response.body[0].punchline).toEqual('test');
    })
  });

  describe('when provided an invalid / no token', () => {
    test("should return with 200 and all jokes by type with invlaid punchline", async () => {
      const response = await request(app).get("/api/jokes?type=test").auth(invalidToken, { type: 'bearer' });
      expect(response.status).toEqual(200);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body).toEqual(fullJokesNonAuth);
      expect(response.body[0].punchline).toEqual('Really funny punchline');
    })
  })
});

describe('GET /api/jokes/types', () => {

  describe('when requesting the types', () => {
    test("Should return ith 200 and types array with unique values", async () => {
      const response = await request(app).get('/api/jokes/types')
      expect(response.status).toEqual(200);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body).toEqual(['test']);
    })
  });
});

describe('GET /api/jokes/random', () => {

  describe('when provided a valid token', () => {
    test("Should return ith 200 and one joke", async () => {
      const response = await request(app).get('/api/jokes/random').auth(validToken, {type: 'bearer'});
      expect(response.status).toEqual(200);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body).toEqual(fullJokesAuth[0]);
    })
  });

  describe('when provided an  invalid / no token', () => {
    test("Should return ith 200 and one joke", async () => {
      const response = await request(app).get('/api/jokes/random')
      expect(response.status).toEqual(200);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body).toEqual(fullJokesNonAuth[0]);
    })
  });
});

describe('PUT /api/jokes/:id', () => {

  describe('when provided a valid token', () => {
    test("Should return ith 200 and the updated joke", async () => {
      const response = await request(app)
        .put('/api/jokes/663891c350d18ca8c0ed7b9a')
        .auth(validToken, {type: 'bearer'})
        .send({
          setup: 'test2',
          punchline: 'test2',
          type: 'test2'
        });
      expect(response.status).toEqual(200);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body.updatedJoke).toEqual(updatedJoke);
    })
  });

  describe('when provided an  invalid / no token', () => {
    test("Should return ith 401 and failed auth message", async () => {
      const response = await request(app).put('/api/jokes/663891c350d18ca8c0ed7b9a')
      expect(response.status).toEqual(401);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body.message).toEqual('Authentication failed');
    })
  });
})

describe('POST /api/jokes/new', () => {

  describe('when provided a valid token', () => {
    test("Should return ith 201 and the new joke", async () => {
      const response = await request(app)
        .post('/api/jokes/new')
        .auth(validToken, {type: 'bearer'})
        .send({
          setup: 'test_new',
          punchline: 'test_new',
          type: 'test_new'
        });
      expect(response.status).toEqual(201);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body.newJoke).toHaveProperty('author', '663891c250d18ca8c0ed7b94');
      expect(response.body.newJoke).toHaveProperty('setup', 'test_new');
      expect(response.body.newJoke).toHaveProperty('punchline', 'test_new');
      expect(response.body.newJoke).toHaveProperty('type', 'test_new');
      expect(response.body.newJoke).toHaveProperty('likes', []);
    })
  });

  describe('when provided an  invalid / no token', () => {
    test("Should return ith 401 and failed auth message", async () => {
      const response = await request(app).post('/api/jokes/new')
      expect(response.status).toEqual(401);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body.message).toEqual('Authentication failed');
    })
  });
})

describe('DELETE /api/jokes/:id', () => {
  let joke;

  beforeAll( async () => {
    const user = await UserModel.findOne({userName: 'anonymus'});
    const newJoke = new JokeModel({
      setup: 'test_delete',
      punchline: 'test_delete',
      type: 'test_delete',
      likes: [],
      author: new mongoose.Types.ObjectId(user._id)
    });
    await newJoke.save();
    joke = await JokeModel.findOne({setup: 'test_delete'})
  })

  describe('when provided a valid token and valid joke id', () => {
    
    test("Should return with 200 and a deletion message", async () => {      
      const response = await request(app)
        .delete(`/api/jokes/${joke._id}`)
        .auth(validToken, {type: 'bearer'});

      expect(response.status).toEqual(200);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body.message).toEqual('Joke deleted')
    })
  });

  describe('when provided a valid token but invalid joke id', () => {
    test("Should return with 500 and a deletion message", async () => {
      const response = await request(app)
        .delete('/api/jokes/invalidjokeid')
        .auth(validToken, {type: 'bearer'});

      expect(response.status).toEqual(500);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body.message).toEqual('Failed to delete joke')
    })
  });

  describe('when provided an  invalid / no token', () => {
    test("Should return ith 401 and failed auth message", async () => {
      const response = await request(app).delete(`/api/jokes/${joke._id}`)
      expect(response.status).toEqual(401);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body.message).toEqual('Authentication failed');
    })
  });
})
