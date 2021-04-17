const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    unique: true,
    type: String,
  },
  username: {
    require: true,
    type: String,
  },
  name: String,
  description: String,
  token: String,
  hash: String,
  salt: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
