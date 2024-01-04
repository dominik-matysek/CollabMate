const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyToken = (req, res, next) => {
  try {
    // const token = req.headers.authorization.split(" ")[1];

    // Retrieve token from HttpOnly cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - Token not found.",
      });
    }
    const decryptedToken = jwt.verify(token, process.env.jwt_secret);

    // Attach the userId to the request for later use in route handlers
    req.userId = decryptedToken.userId;

    next();
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message:
        "Unauthorized - Invalid or expired token. Please try to log in again.",
      error: error.message,
    });
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    // Fetch the user from the database
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.role === "ADMIN") {
      // User is an admin, allow the request to proceed
      console.log("User to admin");
      next();
    } else {
      // User is not an admin, send a 403
      res.status(403).json({ message: "Permission denied." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

const verifyLeader = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    // Fetch the user from the database
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.role === "TEAM LEADER") {
      // User is a team leader, allow the request to proceed
      console.log("User to team leader");
      next();
    } else {
      // User is not an team leader, send a 403
      res.status(403).json({ message: "Permission denied." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

module.exports = {
  verifyToken,
  verifyAdmin,
  verifyLeader,
};
