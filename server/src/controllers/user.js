const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  registerValidation,
  loginValidation,
  updateValidation,
} = require("../utils/userValidation");
// google oauth
const passport = require("passport"); 

// User registration
exports.register = async (req, res) => {
  try {
    //Validate a user before store the user inputs
    const { error } = registerValidation.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { firstName, lastName, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "Taki użytkownik już istnieje!" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Pomyślnie założono konto.",
      userId: newUser._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    //Validate a user before store the user inputs
    const { error } = loginValidation.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { email, password} = req.body;

    // Check if the user exists
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "Niewłaściwe hasło lub e-mail." });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Niewłaściwe hasło lub e-mail." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, userRole: user.role },
      process.env.jwt_secret,
      {
        expiresIn: "30m", // Token expiration time
      }
    );

    // Generate JWT Refresh Token
    const refreshToken = jwt.sign(
      { userId: user._id, userRole: user.role },
      process.env.refresh_token_secret,
      { expiresIn: "1d" } // Longer-lived refresh token
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 30 * 60 * 1000, // Token expiration time in milliseconds
    });

    // Store Refresh Token in separate HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({
      success: true,
      message: "Pomyślnie zalogowano użytkownika.",
      data: { role: user.role, userId: user._id },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// // Google OAuth login initiation
// exports.googleLogin = passport.authenticate("google", {
//   scope: ["profile", "email"],
// });

// // Google OAuth callback
// exports.googleCallback = (req, res, next) => {
//   passport.authenticate("google", async (err, user, info) => {
//     if (err || !user) {
//       return res.status(400).json({ message: "Google authentication failed." });
//     }

//     try {
//       // Generate JWT token
//       const token = jwt.sign(
//         { userId: user._id, userRole: user.role },
//         process.env.jwt_secret,
//         { expiresIn: "30m" }
//       );

//       // Generate JWT Refresh Token
//       const refreshToken = jwt.sign(
//         { userId: user._id, userRole: user.role },
//         process.env.refresh_token_secret,
//         { expiresIn: "1d" }
//       );

//       // Set tokens in cookies (optional, depending on your setup)
//       res.cookie("token", token, {
//         httpOnly: true,
//         secure: true,
//         sameSite: "None",
//         maxAge: 30 * 60 * 1000, // 30 minutes
//       });

//       res.cookie("refreshToken", refreshToken, {
//         httpOnly: true,
//         secure: true,
//         sameSite: "None",
//         maxAge: 24 * 60 * 60 * 1000, // 1 day
//       });

//       // Send tokens in the response (for frontend use)
//       res.status(200).json({
//         success: true,
//         message: "Successfully logged in with Google",
//         data: {
//           token,
//           refreshToken,
//           role: user.role,
//           userId: user._id,
//         },
//       });
//     } catch (error) {
//       console.error("Error during Google OAuth callback:", error);
//       res.status(500).json({ message: "Internal server error." });
//     }
//   })(req, res, next);
// };

//google oauth
// exports.googleLogin = (req, res, next) => {
//   passport.authenticate('google', { failureRedirect: '/login' }, (err, user, info) => {
//     if (err || !user) {
//       return res.status(400).json({ message: "Authentication failed" });
//     }
  
//     // If login is successful, log the user in
//     req.login(user, (loginErr) => {
//       if (loginErr) {
//         return res.status(500).json({ message: "Login failed" });
//       }
  
//       // Once logged in, you can issue tokens, set cookies, etc.
//       const token = jwt.sign({ userId: user._id, userRole: user.role }, process.env.jwt_secret, { expiresIn: "30m" });
//       const refreshToken = jwt.sign({ userId: user._id, userRole: user.role }, process.env.refresh_token_secret, { expiresIn: "1d" });
  
//       res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "None", maxAge: 30 * 60 * 1000 });
//       res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "None", maxAge: 24 * 60 * 60 * 1000 });
  
//       res.json({
//         success: true,
//         message: "Successfully logged in with Google",
//         data: { role: user.role, userId: user._id },
//       });
//     });
//   })(req, res);
// };

//google oauth
exports.googleCallback = (req, res, next) => {
  passport.authenticate("google", { failureRedirect: "/login" }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({ message: "Authentication failed" });
    }

    // If login is successful, log the user in
    req.login(user, (loginErr) => {
      if (loginErr) {
        return res.status(500).json({ message: "Login failed" });
      }

      // Once logged in, issue tokens and set cookies
      const token = jwt.sign(
        { userId: user._id, userRole: user.role },
        process.env.jwt_secret,
        { expiresIn: "30m" }
      );

      const refreshToken = jwt.sign(
        { userId: user._id, userRole: user.role },
        process.env.refresh_token_secret,
        { expiresIn: "1d" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 30 * 60 * 1000, // 30 minutes
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      // Send a JSON response
      res.json({
        success: true,
        message: "Successfully logged in with Google",
        data: { role: user.role, userId: user._id },
      });
    });
  })(req, res, next); // Pass req, res, and next to passport.authenticate
};

exports.logout = async (req, res) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    }
    res.clearCookie("token", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    res.json({ success: true, message: "Pomyślnie wylogowano użytkownika." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// User authentication
exports.authenticate = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("-password")
      .populate({
        path: "team",
        select: "name teamLeaders members projects createdAt",
        populate: {
          path: "members",
          select: "profilePic",
        },
      });

    if (!user) {
      return res.status(404).json({ message: "Nie znaleziono użytkownika." });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.setInitialProfilePic = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { profilePic } = req.body;

    // Update only the profilePic field
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: profilePic },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Nie znaleziono użytkownika." });
    }

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { firstName, lastName, email, profilePic } = req.body;

    const updatedValues = {};

    if (firstName) updatedValues.firstName = firstName;
    if (lastName) updatedValues.lastName = lastName;
    if (email) updatedValues.email = email;
    if (profilePic) updatedValues.profilePic = profilePic;

    //Validate user input
    const { error } = updateValidation.validate(updatedValues);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    // Check if the new email already exists
    if (email) {
      const emailExist = await User.findOne({
        email: email,
        _id: { $ne: userId },
      });
      if (emailExist)
        return res.status(400).json({
          message: "Użytkownik o takim e-mailu istnieje już w serwisie.",
        });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedValues },
      { new: true }
    )
      .select("-password")
      .populate({
        path: "team",
        populate: {
          path: "members",
          select: "profilePic",
        },
      });

    if (!updatedUser) {
      return res.status(404).json({ message: "Nie znaleziono użytkownika." });
    }

    res.status(200).json({
      success: true,
      message: "Pomyślnie zaktualizowano profil użytkownika.",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const imageUrl = req.file.path;
    res.status(200).json({
      success: true,
      message: "Dodano zdjęcie",
      data: imageUrl,
    });
  } catch (error) {
    res.status(500).json({ message: "Nie udało się załączyć zdjęcia." });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("team", "name createdAt")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId)
      .select("-password")
      .populate({
        path: "team",
        select: "name teamLeaders members createdAt",
        populate: {
          path: "members",
          select: "profilePic",
        },
      });
    if (!user) {
      return res.status(404).json({ message: "Nie znaleziono użytkownika." });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.removeUserFromSystem = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (req.userId === userId) {
      return res
        .status(403)
        .json({ message: "Nie możesz usunąć własnego konta!" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Nie znaleziono użytkownika." });
    }
    if (user.team) {
      return res.status(404).json({
        message:
          "Członek zespołu nie może zostać usunięty z serwisu! Najpierw usuń użytkownika z zespołu.",
      });
    }

    // Remove the user from the database
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "Pomyślnie usunięto użytkownika z zespołu.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Brak autoryzacji. Test" });
    }
    // Verify the refresh token
    const decryptedToken = jwt.verify(
      refreshToken,
      process.env.refresh_token_secret
    );

    // Issue a new access token
    const accessToken = jwt.sign(
      { userId: decryptedToken.userId, userRole: decryptedToken.userRole },
      process.env.jwt_secret,
      { expiresIn: "30m" } // Example expiration time
    );

    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    return res.status(403).json({
      message: "Nieprawidłowy token. Spróbuj zalogować się ponownie.",
      error: error.message,
    });
  }
};
