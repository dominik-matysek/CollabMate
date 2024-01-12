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
		// 	return res.status(400).json({ message: error.details[0].message });

		const { firstName, lastName, email, password } = req.body;

		// Check if the email is already registered
		const existingUser = await User.findOne({ email: email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists!" });
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

		console.log(newUser);

		// Save the user to the database
		await newUser.save();

		res.status(201).json({
			success: true,
			message: "User registered successfully",
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
				SameSite: "none",
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

exports.logout = async (req, res) => {
	try {
		res.clearCookie("token");
		res.json({ success: true, message: "Logged out successfully" });
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
			return res.status(404).json({ message: "User not found" });
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

		// Optional: Add additional checks to ensure the userId is from a recently created user

		// Update only the profilePic field
		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ profilePic: profilePic },
			{ new: true }
		).select("-password");

		if (!updatedUser) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json({
			success: true,
			message: "Profile picture updated successfully",
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
			userId,
			{ $set: updatedValues },
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
		res.status(200).json({
			success: true,
			message: "Dodano zdjęcie",
			data: imageUrl,
		});
	} catch (error) {
		res.status(500).json({ message: "Image upload failed" });
	}
};

exports.getAllUsers = async (req, res) => {
	try {
		const users = await User.find()
			.select("-password")
			.populate("team", "name createdAt");
		res.status(200).json({ success: true, data: users });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

exports.getUserInfo = async (req, res) => {
	try {
		console.log("Kontroler getUserInfo");
		const userId = req.params.userId;
		console.log(userId);
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
			return res.status(404).json({ message: "User not found" });
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

		console.log("User do usunięcia: ", userId);

		if (req.userId === userId) {
			return res
				.status(403)
				.json({ message: "Nie możesz usunąć własnego konta!" });
		}

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		if (user.team) {
			return res.status(404).json({
				message:
					"Członek zespołu nie może zostać usunięty z serwisu! Najpierw usuń użytkownika z zespołu!",
			});
		}

		// Remove the user from the database
		await User.findByIdAndDelete(userId);

		res.status(200).json({
			success: true,
			message: "User has been successfully removed from the system.",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
