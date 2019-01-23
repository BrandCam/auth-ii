const express = require("express");
const helmet = require("helmet");
const knex = require("knex");
const bcrypt = require("bcryptjs");
const knexConfig = require("../knexfile.js");

const server = express();

const db = knex(knexConfig.development);
server.use(helmet());
server.use(express.json());

server.get("/", (req, res) => {
  res.status(200).json({ message: "get working" });
});

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

// get user list if logged in

module.exports = server;
