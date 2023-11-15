const asyncHandler = require("express-async-handler");
const user = require("../models/User");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

exports.post_user_signup = [
  body("username", "username must be min 5 characters and max 16 characters")
    .trim()
    .escape()
    .isLength({ min: 5, max: 16 }),
  body("password", "password must be min 5 characters and max 16 characters")
    .trim()
    .escape()
    .isLength({ min: 5, max: 16 }),
  asyncHandler(async (req, res, next) => {
    console.log("body is: ", req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        status_code: 400,
        msg: "field data failed validation.",
        errors: errors.array(),
      });
    }
    const check_username = await user
      .findOne({
        username: req.body.username,
      })
      .exec();
    if (check_username) {
      return res.json({
        status_code: 400,
        msg: "Username already in use. Choose any other username",
        errors: ["Username already in use.", "Choose any other username"],
      });
    } else {
      // save the user to the db
      const new_user = new user({
        username: req.body.username,
        password: req.body.password,
      });
      await new_user.save();
      return res.json({
        status_code: 200,
        msg: "User account creation successfull.",
        username: new_user.username,
        id: new_user.id,
      });
    }
  }),
];
