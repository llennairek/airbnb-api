const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  token: String,
  hash: String,
  salt: String,
  account: {
    username: { type: String, required: true, unique: true },
    name: String,
    description: String,
    photo: Object,
  },
  rooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
  ],
  // "rooms" permettra de stocker toutes les références vers les annonces créées par l'utilisateur
});

const User = mongoose.model("User", userSchema);

module.exports = User;
