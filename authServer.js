require("dotenv").config();
const express = require("express");
const { JsonWebTokenError } = require("jsonwebtoken");
const app = express();

app.use(express.json());

const jwt = require("JsonWebToken");
//---

let refreshTokens = [];

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.sendStatus(403);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const acccessToken = generateAccessToken({ name: user.name });
    res.json({ acccessToken });
  });
});

app.post("/login", (req, res) => {
  //authenticate user

  const username = req.body.username;

  const user = { name: username };
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  refreshTokens.push(refreshToken);

  res.json({ accessToken, refreshToken });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "60s" });
}

app.listen(4000);
