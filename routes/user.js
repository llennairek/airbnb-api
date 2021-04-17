const router = require("express").Router();
const User = require("../models/User");
const uid2 = require("uid2");
const sha256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

router.post("/sign_up", async (req, res) => {
  const { password, email, username, name, description } = req.fields;
  try {
    if (password && email && username && name && description) {
      const exist = await User.findOne({ email });
      if (!exist) {
        const token = uid2(64);
        const salt = uid2(64);
        const hash = sha256(salt + password).toString(encBase64);

        const newUser = new User({ email, username, name, description, token, salt, hash });
        await newUser.save();
        res.status(201).json({ id: newUser.id, token, email, username, description, name });
      } else {
        res.status(400).json({ error: "This email already has an account." });
      }
    } else {
      res.status(400).json({ error: "Missing parameters" });
    }
  } catch (error) {
    res.status(500).json({ erorr: error.message });
  }
});

router.post("/log_in", async (req, res) => {
  try {
    const { email, password } = req.fields;
    if (email && password) {
      const user = await User.findOne({ email });
      if (user) {
        const newHash = sha256(user.salt + password).toString(encBase64);
        if (newHash === user.hash) {
          res.status(200).json({
            _id: user.id,
            token: user.token,
            email: user.email,
            username: user.username,
            description: user.description,
            name: user.name,
          });
        } else {
          res.status(400).json({ error: "Unauthorized" });
        }
      } else {
        res.status(400).json({ error: "Unauthorized" });
      }
    } else {
      res.status(400).json({ error: "Missing parameters" });
    }
  } catch (error) {
    res.status(500).json({ erorr: error.message });
  }
});

module.exports = router;
