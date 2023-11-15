const express = require("express");

// importing jwt -> jsonwebtoken module

const jwt = require("jsonwebtoken");

const app = express();

app.get("/api", (req, res, next) => {
  return res.json({
    msg: "Welcome to apex!",
  });
});

app.listen(5000, () => {
  console.log(`Server running at : http://localhost:5000`);
});
