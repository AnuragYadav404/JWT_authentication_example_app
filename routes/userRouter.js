const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/user_controller");

router.post(
  "/signup",
  // req
  // { username: "something", password: "password123"}
  // here we want to handle user creation in db
  // on return we just want to do is return msg of
  // successful or unsuccessfull creation of user account
  (req, res, next) => {
    console.log("req body is", req.body);
    next();
  },
  user_controller.post_user_signup
);

module.exports = router;
