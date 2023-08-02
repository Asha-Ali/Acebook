const app = require("../../app");
const request = require("supertest");
require("../mongodb_helper");
const User = require('../../models/user')
const JWT = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

let token;



describe("/users", () => {
  beforeEach( async () => {
    await User.deleteMany({});
  });

  describe("POST, when email, password and username are provided", () => {
    test("the response code is 201", async () => {
      let response = await request(app)
        .post("/users")
        .send({email: "poppy@email.com", password: "1234", username: 'person1'})
      expect(response.statusCode).toBe(201)
    })

    test("a user is created", async () => {
      await request(app)
        .post("/users")
        .send({email: "scarlett@email.com", password: "1234", username: 'person1'})
      let users = await User.find()
      let newUser = users[users.length - 1]
      expect(newUser.email).toEqual("scarlett@email.com")
    })
  })

  describe("POST, when password is missing", () => {
    test("response code is 400", async () => {
      let response = await request(app)
        .post("/users")
        .send({email: "skye@email.com"})
      expect(response.statusCode).toBe(400)
    });

    test("does not create a user", async () => {
      await request(app)
        .post("/users")
        .send({email: "skye@email.com"})
        let users = await User.find()
        expect(users.length).toEqual(0)
    });
  })
  
  describe("POST, when email is missing", () => {
    test("response code is 400", async () => {
      let response = await request(app)
        .post("/users")
        .send({password: "1234"})
      expect(response.statusCode).toBe(400)
    });

    test("does not create a user", async () => {
      await request(app)
        .post("/users")
        .send({password: "1234"})
      let users = await User.find()
      expect(users.length).toEqual(0)
    });
  })

  describe("GET, when path with user ID", () => {
    test("gets user info if user is authenticated", async () => {
      const user = new User({email: 'email@email.com', password: '12345678', username: 'person'});
      const response1 = await request(app)
        .post("/users")
        .send({email: user.email, password: user.password, username: user.username});
      const user_id = response1.id;
      console.log(response1)
      const response = await request(app).get(`/users/${user.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({user_id: user_id});
      expect(response.statusCode).toBe(200);
      expect(response).not.toEqual(undefined);
      expect(response.body.email).toEqual("email@email.com");
      expect(response.body.username).toEqual("person");
      expect(response.body.password).toEqual(undefined);
    })
    
    // test("get user info returns error with wrong info", async () => { 
    //   const user = new User({email: 'email@email.com', password: '12345678', username: 'person'});
    //   await user.save();
    //   await request(app)
    //     .post("/tokens")
    //     .send({email: user.email, password: user.password});
    //   const response = await request(app).get('/users/4eb6e7e7e9b7f4194e000001')
    //     .set("Authorization", `Bearer ${token}`);
    //   expect(response.statusCode).toBe(401)
    // })

    // test("get user info not returned if not authentic token", async () => {
    //   const user = new User({email: 'email@email.com', password: '12345678', username: 'person'})
    //   await user.save()

    //   // find by id with no authentic token returns 401
    //   const response = await request(app).get(`/users/${user.id}`)
    //   expect(response.statusCode).toBe(401)
    // })
  })
})