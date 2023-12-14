// Database configuration file

const mongoose = require("mongoose");
mongoose.connect(process.env.mongo_url);

const connection = mongoose.connection;

connection.on("connected", () => {
	console.log("Mongo DB connected successfully");
});

//testing db connection
// connection.on("connected", async () => {
// 	console.log("Mongo DB connected successfully");

// 	// Import your Mongoose models
// 	const User = require("../models/user");
// 	const Team = require("../models/team");
// 	const Project = require("../models/project");
// 	const Task = require("../models/task");
// 	const Notification = require("../models/notification");
// 	const Comment = require("../models/comment");
// 	const Calendar = require("../models/calendar");

// 	// Create empty collections based on your models
// 	await User.createCollection();
// 	await Team.createCollection();
// 	await Project.createCollection();
// 	await Task.createCollection();
// 	await Notification.createCollection();
// 	await Comment.createCollection();
// 	await Calendar.createCollection();

// 	// Add a sample document
// 	const sampleUser = new User({
// 		firstName: "Dominik",
// 		lastName: "Matysek",
// 		email: "dom@example.com",
// 		password: "dominik",
// 		// other properties...
// 	});

// 	const sampleTeam = new Team({
// 		name: "Team 1",
// 		teamLead: sampleUser._id,
// 	});

// 	sampleTeam.members.push(sampleUser._id);

// 	sampleUser.teams.push(sampleTeam._id);

// 	const sampleProject = new Project({
// 		name: "Project 1",
// 		description: "Nice project",
// 	});

// 	sampleProject.members.push(sampleUser._id);

// 	sampleTeam.projects.push(sampleProject._id);

// 	const sampleTask = new Task({
// 		name: "Task 1",
// 		description: "Nice task",
// 		priority: "low",
// 		createdBy: sampleUser._id,
// 		dueDate: new Date(),
// 	});

// 	sampleTask.assignees.push(sampleUser._id);

// 	sampleProject.tasks.push(sampleTask._id);

// 	const sampleNotification = new Notification({
// 		user: sampleUser._id,
// 		title: "Notification 1",
// 		description: "What's up?",
// 		link: "itself",
// 		read: false,
// 	});

// 	const sampleComment = new Comment({
// 		content: "siema mordo",
// 		createdBy: sampleUser._id,
// 	});

// 	sampleTask.comments.push(sampleComment._id);

// 	const sampleCalendar = new Calendar({
// 		events: [
// 			{
// 				title: "Sample Event",
// 				description: "This is a sample event.",
// 				date: new Date(),
// 				timeStart: new Date(),
// 				timeEnd: new Date(),
// 				createdBy: sampleUser._id,
// 				participants: [sampleUser._id],
// 			},
// 		],
// 	});

// 	sampleTeam.calendar = sampleCalendar._id;

// 	const savedUser = await sampleUser.save();

// 	const savedTeam = await sampleTeam.save();

// 	const savedProject = await sampleProject.save();

// 	const savedTask = await sampleTask.save();

// 	const savedNotification = await sampleNotification.save();

// 	const savedComment = await sampleComment.save();

// 	const savedCalendar = await sampleCalendar.save();

// 	console.log("Collections created successfully");
// });

connection.on("error", (err) => {
	console.log("Mongo DB connection error: ", err);
});

module.exports = mongoose;
