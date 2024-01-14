const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Team = require("../models/team");
const Project = require("../models/project");
const Task = require("../models/task");

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
			console.log("User to admin hehhe");
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

const checkTeamAccess = async (req, res, next) => {
	try {
		const userId = req.userId;
		if (!userId) {
			return res.status(401).json({ message: "Unauthorized access." });
		}
		let teamId = req.params.teamId || req.body.teamId;

		console.log(teamId);

		if (!teamId) {
			const projectId = req.params.projectId || req.body.projectId;
			const taskId = req.params.taskId || req.body.taskId;

			console.log("Project ID in checkTeamAccess: ", projectId);

			if (projectId) {
				const project = await Project.findById(projectId);
				if (!project) {
					return res.status(404).json({ message: "Project not found." });
				}
				teamId = project.team;
			} else if (taskId) {
				const task = await Task.findById(taskId);
				if (!task) {
					return res.status(404).json({ message: "Task not found." });
				}
				// Assuming task model has a 'project' field referencing the project it belongs to
				const project = await Project.findById(task.project);
				if (!project) {
					return res
						.status(404)
						.json({ message: "Project not found for the task." });
				}
				teamId = project.team;
			} else {
				return res
					.status(400)
					.json({ message: "Insufficient data to determine team membership." });
			}
		}

		const team = await Team.findById(teamId);
		if (!team) {
			return res.status(404).json({ message: "Team not found." });
		}

		if (team.members.includes(userId) || team.teamLeaders.includes(userId)) {
			return next();
		}

		return res
			.status(403)
			.json({ message: "Access denied. Not a team member." });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal Server Error." });
	}
};

const checkProjectAccess = async (req, res, next) => {
	try {
		const userId = req.userId;
		if (!userId) {
			return res.status(401).json({ message: "Unauthorized access." });
		}
		const projectId = req.params.projectId || req.body.projectId;

		if (!projectId) {
			return res.status(400).json({ message: "Project ID is required." });
		}

		const project = await Project.findById(projectId);
		if (!project) {
			return res.status(404).json({ message: "Project not found." });
		}

		// Check if the user is a member of the project or a team leader of the team owning the project
		const team = await Team.findById(project.team);
		if (
			team &&
			(project.members.includes(userId) || team.teamLeaders.includes(userId))
		) {
			return next();
		}

		return res
			.status(403)
			.json({ message: "Access denied. Not a project member." });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal Server Error." });
	}
};

const checkTaskAccess = async (req, res, next) => {
	try {
		const userId = req.userId;
		if (!userId) {
			return res.status(401).json({ message: "Unauthorized access." });
		}
		const taskId = req.params.taskId || req.body.taskId;

		if (!taskId) {
			return res.status(400).json({ message: "Task ID is required." });
		}

		const task = await Task.findById(taskId);
		if (!task) {
			return res.status(404).json({ message: "Task not found." });
		}

		// Check if the user is a member of the task or a team leader of the team associated with the project of the task
		const project = await Project.findById(task.project);
		if (!project) {
			return res
				.status(404)
				.json({ message: "Project not found for the task." });
		}

		const team = await Team.findById(project.team);
		if (
			team &&
			(task.members.includes(userId) || team.teamLeaders.includes(userId))
		) {
			return next();
		}

		return res
			.status(403)
			.json({ message: "Access denied. Not a task member." });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal Server Error." });
	}
};

const verifyAdminOrTeamMember = async (req, res, next) => {
	if (!req.userId) {
		return res.status(401).json({ message: "Unauthorized access." });
	}

	try {
		const user = await User.findById(req.userId);
		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}

		if (user.role === "ADMIN") {
			// User is an admin, proceed to the next middleware
			return next();
		}

		// If not admin, check team access
		await checkTeamAccess(req, res, next);
	} catch (error) {
		// Handle any errors that occur during the process
		console.error("Error in verifyAdminOrTeamMember:", error);
		res.status(500).json({ message: "Internal Server Error." });
	}
};

module.exports = {
	verifyToken,
	verifyAdmin,
	verifyLeader,
	checkTeamAccess,
	checkProjectAccess,
	checkTaskAccess,
	verifyAdminOrTeamMember,
};
