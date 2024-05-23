import jwt from 'jsonwebtoken';
import request from 'supertest';
import mongoose from 'mongoose';

import { User as UserModel } from "../repository/user.model.js";
import app from '../app.js';


const validToken = jwt.sign({ userName: "anonymus" }, process.env.TOKEN_SECRET);
const invalidToken = "invalid-token";

const parsedUser = {
  userInfo: {
    firstName: "anonymus",
    lastName: "anonymus",
    userName: "anonymus",
    email: "anonymus@anonymus.hu",
  },
  createdAt: `2024-05-6`
}

const parsedUpdatedUser = {
  userInfo: {
    firstName: "anonymus",
    lastName: "anonymus",
    userName: "anonymus2",
    email: "anonymus@anonymus.hu",
  },
  createdAt: `2024-05-6`
}

const fullJokes = [{
  "_id": "663891c350d18ca8c0ed7b9a",
  "setup": "test",
  "punchline": "test",
  "type": "test",
  "author": "663891c250d18ca8c0ed7b94",
  "likes": ["663891c250d18ca8c0ed7b94"],
  "created": "2024-05-06T08:16:03.132Z",
  "__v": 0
}]

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL + 'mad_joketest');
});

beforeEach(async () => {
  await UserModel.findOneAndUpdate({userName: 'anonymus2'}, {userName: 'anonymus'});
})

afterAll(async () => {
  await mongoose.disconnect();
});

describe('GET /api/user/', () => {

  describe('when provided a valid token', () => {
    test("should return with 200 and parsed user object", async () => {
      const response = await request(app).get("/api/user/").auth(validToken, { type: 'bearer' });
      expect(response.status).toEqual(200);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body.parsedUser).toEqual(parsedUser)
    })
  })

  describe('when provided an invalid token', () => {
    test("should return with 401 and auth error message", async () => {
      const response = await request(app).get("/api/user/").auth(invalidToken, { type: 'bearer' });
      expect(response.status).toEqual(401);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body.message).toEqual('Authentication failed');
    })
  })
})

describe('GET /api/user/jokes', () => {

  describe("when provided a valid token", () => {
    test("should return with 200 and full jokes array", async () => {
      const response = await request(app).get("/api/user/jokes").auth(validToken, { type: 'bearer' });
      expect(response.status).toEqual(200);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body.jokes).toEqual(fullJokes);
    })
  })

  describe("when invalid / no token provided", () => {
    test("should return with 401 and an auth error message", async () => {
      const response = await request(app).get("/api/user/jokes").auth(invalidToken, { type: 'bearer' });
      expect(response.status).toEqual(401);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body.message).toEqual('Authentication failed');
    })
  })

})

describe('PUT /api/user', () => {
  
  afterAll(async () => {
    await UserModel.findOneAndUpdate({userName: "anonymus2"}, {userName: "anonymus"}, {new: true});
  })

  describe("when provided a valid token and valid body", () => {
    test("should return with 200 and parsed updated user object", async () => {
      const response = await request(app).put("/api/user/").auth(validToken, { type: 'bearer' }).send({userUpdates: {userName: "anonymus2"}});
      expect(response.status).toEqual(200);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body.parsedUser).toEqual(parsedUpdatedUser);
    })
  })

  describe("when provided a valid token but no body", () => {
    test("should return with 500 and failed update error message", async () => {
      const response = await request(app).put("/api/user/").auth(validToken, { type: 'bearer' });
      expect(response.status).toEqual(500);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body.message).toEqual('Update failed');
    })
  })

  describe("when provided an invalid / no token", () => {
    test("should return with 401 and an auth error message", async () => {
      const response = await request(app).put("/api/user/").auth(invalidToken, { type: 'bearer' });
      expect(response.status).toEqual(401);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body.message).toEqual('Authentication failed');
    })
  })

})

describe('PATCH /api/user/pwchange', () => {

  afterAll(async () => {
    await request(app)
      .patch("/api/user/pwchange")
      .auth(validToken, { type: 'bearer' })
      .send({pwS: {oldPw: "anonymus2", newPw: "anonymus"}})
  })

  describe("when provided a valid token and the old pw matches", () => {
    test("should return with 200 and changed pw message", async () => {
      const response = await request(app).patch("/api/user/pwchange").auth(validToken, { type: 'bearer' }).send({pwS: {oldPw: "anonymus", newPw: "anonymus2"}});
      expect(response.status).toEqual(200);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body.message).toEqual("Password updated!");
    })
  })

  describe("when provided a valid token but the old pw do not match", () => {
    test("should return with 200 and changed pw message", async () => {
      const response = await request(app).patch("/api/user/pwchange").auth(validToken, { type: 'bearer' }).send({pwS: {oldPw: "test", newPw: "test2"}});
      expect(response.status).toEqual(401);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body.message).toEqual("Incorrect password");
    })
  })

  describe("when provided an invalid / no token", () => {
    test("should return with 401 and an auth error message", async () => {
      const response = await request(app).patch("/api/user/pwchange").auth(invalidToken, { type: 'bearer' });
      expect(response.status).toEqual(401);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body.message).toEqual('Authentication failed');
    })
  })

})

describe('POST /api/user/register', () => {

  afterAll( async () => {
    await UserModel.deleteOne({userName: 'test'});
  })

  describe("when all data provided correctly", () => {
    test("should return with 201 and user created message", async () => {
      const response = await request(app)
        .post("/api/user/register")
        .send({
          email: 'test', 
          userName: 'test', 
          firstName: 'test', 
          lastName: 'test',
          password: 'test'
        });

      expect(response.status).toEqual(201);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body.message).toEqual('User created');
    })
  })

  describe("when only partial data provided (null)", () => {
    test("should return with 500 and error message", async () => {
      const response = await request(app)
        .post("/api/user/register")
        .send({
          email: '', 
          userName: '', 
          firstName: '', 
          lastName: '',
          password: ''
        });

      expect(response.status).toEqual(500);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body.message).toEqual('Fields are missing');
    })
  })

})

describe('POST /api/user/login', () => {

  describe("when username and password provided correctly", () => {
    test("should return with 200, token and auth message", async () => {
      const response = await request(app)
        .post("/api/user/login")
        .send({
          userName: 'anonymus',
          password: 'anonymus'
        });

      expect(response.status).toEqual(200);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body.message).toEqual('User authenticated');
      expect(response.body).toHaveProperty('token');
    })
  })

  describe("when password provided incorrectly", () => {
    test("should return with 401 and auth message", async () => {
      const response = await request(app)
        .post("/api/user/login")
        .send({
          userName: 'anonymus',
          password: 'incorrectpw'
        });

      expect(response.status).toEqual(401);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body.message).toEqual('Incorrect password');
    })
  })

  describe("when username provided incorrectly", () => {
    test("should return with 401 and auth message", async () => {
      const response = await request(app)
        .post("/api/user/login")
        .send({
          userName: 'incorrectusername',
          password: 'anonymus'
        });

      expect(response.status).toEqual(401);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body.message).toEqual('Incorrect username');
    })
  })

})

