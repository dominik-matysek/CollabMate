const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decryptedToken = jwt.verify(token, process.env.jwt_secret);

    // Attach the userId to the request for later use in route handlers
    req.userId = decryptedToken.userId;

    next();
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      success: false,
      message:
        "Unauthorized - Invalid or expired token. Please try to log in again.",
    });
  }
};
