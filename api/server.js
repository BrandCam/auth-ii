const express = require("express");
const helmet = require("helmet");
const knex = require("knex");
const bcrypt = require("bcryptjs");
const knexConfig = require("../knexfile.js");
const jwt = require("jsonwebtoken");
const server = express();

const db = knex(knexConfig.development);
server.use(helmet());
server.use(express.json());

//server test
server.get("/", (req, res) => {
  res.status(200).json({ message: "get working" });
});

//token maker
const createToken = user => {
  const payload = {
    username: user.username,
    department: user.department
  };
  const secret = "asidfugoasidufgoasd";

  const options = {
    expiresIn: "30m"
  };
  return jwt.sign(payload, secret, options);
};

// create user
server.post("/create", (req, res) => {
  const userInfo = req.body;
  const hash = bcrypt.hashSync(userInfo.password, 12);
  userInfo.password = hash;
  db("users")
    .insert(userInfo)
    .then(ids => {
      res.status(200).json({ ids });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// login as user
server.post("/login", (req, res) => {
  const userCreds = req.body;
  console.log(userCreds);
  db("users")
    .where({ username: userCreds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(userCreds.password, user.password)) {
        const token = createToken(user);
        res.status(200).json({ message: `welcome ${user.username}.`, token });
      } else {
        res.status(401).json({ message: "username or pass incorect." });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});
// get user list if logged in
server.get("/users", async (req, res) => {
  const users = await db("users").select("id", "username", "department");
  res.status(200).json(users);
});
module.exports = server;
