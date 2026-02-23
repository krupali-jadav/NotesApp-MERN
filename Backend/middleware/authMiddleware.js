const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No Token Provided" });
    }

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    req.user = user;
    next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = authMiddleware;