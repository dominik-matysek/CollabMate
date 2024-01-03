const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  registerValidation,
  loginValidation,
  updateValidation,
} = require("../utils/userValidation");

// User registration
exports.register = async (req, res) => {
  try {
    console.log("user registration request received");
    //Validate a user before store the user inputs
    // const { error } = registerValidation.validate(req.body);
    // if (error)
    //   return res.status(400).json({ message: error.details[0].message });
    console.log(req.body);
    const { firstName, lastName, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }
    console.log(req.file);
    const profileImageUrl = req.file ? req.file.path : null;

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profilePic: profileImageUrl,
    });

    // Save the user to the database
    await newUser.save();

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
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

    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, {
      expiresIn: "30m", // Token expiration time
    });

    // res.status(200).json({
    //   success: true,
    //   message: "User registered successfully",
    //   data: { token: token, role: user.role },
    // });

    // testowanie httpsonly czy cos takiego ponizej, powyzej domyslny token jak miales wczensiej
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true, // Enable this when deploying your application over HTTPS
        sameSite: "strict",
        maxAge: 30 * 60 * 1000, // Token expiration time in milliseconds
      })
      .json({
        success: true,
        message: "User logged in successfully",
        data: { role: user.role },
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// User authentication
exports.authenticate = async (req, res) => {
  try {
    // testowanie httpsonly ponizej
    // const token = req.cookies.token;

    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    console.log("user edit request received");
    console.log(req.params);
    const userId = req.params.id;
    const { firstName, lastName, email, profilePic } = req.body;

    const updatedValues = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      profilePic: profilePic,
    };

    //Validate user input
    // const { error } = updateValidation.validate(updatedValues);
    // if (error)
    //   return res.status(400).json({ message: error.details[0].message });

    // Check if the new email already exists
    if (email) {
      const emailExist = await User.findOne({
        email: email,
        _id: { $ne: userId },
      });
      if (emailExist)
        return res.status(400).json({ message: "Email already exists" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      updatedValues,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User edited succesfully",
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
    res.status(200).json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: "Image upload failed" });
  }
};
