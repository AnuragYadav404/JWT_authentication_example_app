const asyncHandler = require("express-async-handler");
const user = require("../models/User");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

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

exports.post_user_login = [
  body("username", "username must be min 5 characters and max 16 characters")
    .trim()
    .escape()
    .isLength({ min: 5, max: 16 }),
  body("password", "password must be min 5 characters and max 16 characters")
    .trim()
    .escape()
    .isLength({ min: 5, max: 16 }),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        status_code: 400,
        msg: "field data failed validation.",
        errors: errors.array(),
      });
    }
    // next thing to check is to verify the credentials entered
    const user_from_db = await user.findOne({
      username: req.body.username,
      password: req.body.password,
    });
    if (user_from_db) {
      // if the user exists in the db
      // successfull login
      // i wanna return access token and refresh token
      const user_claim = {
        username: user_from_db.username,
        user_id: user_from_db.id,
      };

      const access_token = jwt.sign(user_claim, process.env.ACCESS_KEY, {
        expiresIn: "10m",
      });

      const refresh_token = jwt.sign(user_claim, process.env.REFRESH_KEY, {
        expiresIn: "1d",
      });

      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: "None",
        secure: true,
      });

      return res.json({
        access_token,
      });
    } else {
      return res.status(406).json({
        message: "Invalid credentials",
      });
    }
  }),
];
