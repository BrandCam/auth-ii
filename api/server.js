const express = require("express");
const helmet = require("helmet");
const knex = require("knex");

const knexConfig = require("../knexfile.js");

const server = express();

const db = knex(knexConfig.development);
server.use(helmet());
server.use(express.json());

server.get("/", (req, res) => {
  res.status(200).json({ message: "get working" });
});

module.exports = server;
