const router = require("express").Router();
const User = require("../models/User");
const uid2 = require("uid2");
const sha256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

router.post("/sign_up", async (req, res) => {
  try {
    const userEmail = await User.findOne({ email: req.fields.email });

    const userUsername = await User.findOne({
      "account.username": req.fields.username,
    });

    // const exist = await User.findOne({ email });
    if (!userEmail && !userUsername) {
      const { password, email, username, name, description } = req.fields;

      if (password && email && username && name && description) {
        const token = uid2(64);
        const salt = uid2(64);
        const hash = sha256(salt + password).toString(encBase64);

        const newUser = new User({
          email,
          token,
          salt,
          hash,
          account: { username, name, description },
        });
        await newUser.save();
        res.status(201).json({ id: newUser.id, token, email, username, description, name });
      } else {
        res.status(400).json({ error: "Missing parameters" });
      }
    } else if (userEmail) {
      res.status(400).json({ error: "This email already has an account." });
    } else if (userUsername) {
      res.status(400).json({ error: "This username already has an account." });
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
            username: user.account.username,
            description: user.account.description,
            name: user.account.name,
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
