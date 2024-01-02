const jwt = require("jsonwebtoken");

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

const verifyAdmin = (req, res, next) => {
  try {
    if (req.user && req.user.role === "ADMIN") {
      // User is an admin, allow the request to proceed
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

const verifyLeader = (req, res, next) => {
  try {
    if (req.user && req.user.role === "TEAM LEADER") {
      // User is a team leader, allow the request to proceed
      next();
    } else {
      // User is not a team leader, send a 403
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
