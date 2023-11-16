const express = require("express");
const cookieParser = require("cookie-parser");
// importing jwt -> jsonwebtoken module

const jwt = require("jsonwebtoken");
const user_router = require("./routes/userRouter");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

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
    your_details: req.user_auth_data,
  });
});

app.post("/refresh", (req, res, next) => {
  // get the refresh token and then create a new access token
  if (req.cookies?.refresh_token) {
    const refresh_token = req.cookies.refresh_token;
    // verify the refresh token
    jwt.verify(refresh_token, process.env.REFRESH_KEY, (err, data) => {
      if (err) {
        return res.status(406).json({
          message: "Unauthorized",
        });
      } else {
        const user_claim = {
          username: data.username,
          user_id: data.user_id,
        };
        const new_access_token = jwt.sign(user_claim, process.env.ACCESS_KEY, {
          expiresIn: "10m",
        });
        return res.json({
          access_token: new_access_token,
        });
      }
    });
  } else {
    return res.status(406).json({
      message: "Unauthorized",
    });
  }
});

// need to implement or define verifyAuth
function verifyAuth(req, res, next) {
  // first is to extract the token from the header
  // req.headers["authorization"]
  // token will be of form: "bearer <token_value>"
  // here we will do some logic to check if token is valid or not
  const auth_header = req.headers["authorization"];
  if (!auth_header) {
    return res.status(406).json({
      message: "Unauthorized",
    });
  } else {
    const auth_token = auth_header.split(" ");
    const access_token = auth_token[1];
    if (!access_token) {
      return res.status(406).json({
        message: "Unauthorized",
      });
    }
    jwt.verify(access_token, process.env.ACCESS_KEY, (err, data) => {
      if (err) {
        return res.status(406).json({
          message: "Unauthorized",
        });
      }
      req.user_auth_data = {
        username: data.username,
        user_id: data.user_id,
      };
    });
  }
  next();
}

app.listen(5000, () => {
  console.log(`Server running at : http://localhost:5000`);
});
