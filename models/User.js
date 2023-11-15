const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connection = require("../config/db_connection");

const user_schema = new Schema({
  username: {
    type: Schema.Types.String,
    required: true,
    minLength: 5,
    maxLength: 16,
  },
  password: {
    type: Schema.Types.String,
    required: true,
    minLength: 5,
    maxLength: 16,
  },
});

const user = connection.model("user", user_schema);
module.exports = user;
