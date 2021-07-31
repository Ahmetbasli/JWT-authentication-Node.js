require("dotenv").config();
const express = require("express");
const { JsonWebTokenError } = require("jsonwebtoken");
const app = express();

app.use(express.json());

const jwt = require("JsonWebToken");

const posts = [
  {
    username: "jhon",
    title: "post 1",
  },
  {
    username: "jim",
    title: "post 2",
  },
  {
    username: "Kyle",
    title: "post 2",
  },
  {
    username: "Kyle",
    title: "post 1",
  },
];

app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(3001);
