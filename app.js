const express = require("express");

// importing jwt -> jsonwebtoken module

const jwt = require("jsonwebtoken");
const user_router = require("./routes/userRouter");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/api", (req, res, next) => {
  return res.json({
    msg: "Welcome to apex!",
  });
});

// when are tokens created?
// token will be created/returned only when user logs -in
app.use("/users", user_router);

// lets say a user wants to access a protected route ->
app.get("/api/auth", verifyAuth, (req, res, next) => {
  return res.json({
    secret: "Matrix ain't real",
  });
});

// need to implement or define verifyAuth
function verifyAuth(req, res, next) {
  // first is to extract the token from the header
  // req.headers["authorization"]
  // token will be of form: "bearer <token_value>"
  // here we will do some logic to check if token is valid or not
  next();
}

app.listen(5000, () => {
  console.log(`Server running at : http://localhost:5000`);
});
