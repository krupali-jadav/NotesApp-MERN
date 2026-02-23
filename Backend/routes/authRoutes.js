const express = require("express");
const router = express.Router();
const User = require("../models/User");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

//register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.json({ message: "user registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "invalid creadentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ message: "Invalid Credentials" });
    }
    //random token generate
    const token = crypto.randomBytes(20).toString("hex");
    user.token = token;
    await user.save();

    res.json({
      message: "Login successful",
      token,
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
