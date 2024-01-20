// websocket.js
const User = require("./models/user"); // Adjust the path as needed
const Notification = require("./models/notification");

let usersSockets = {};

module.exports = function (io) {
	io.on("connection", (socket) => {
		console.log("New WebSocket connection");

		// Store user's socket on connection
		socket.on("register", async (userId) => {
			if (userId) {
				const user = await User.findById(userId);
				if (user) {
					usersSockets[userId] = socket.id;
					console.log(`User ${userId} connected with socket ${socket.id}`);
				}
			}
		});

		// Handle disconnection
		socket.on("disconnect", () => {
			for (let userId in usersSockets) {
				if (usersSockets[userId] === socket.id) {
					console.log(`User ${userId} disconnected`);
					delete usersSockets[userId];
				}
			}
		});

		// Additional event handlers as needed
	});
};

const getSocketIdForUser = (userId) => {
	return usersSockets[userId];
};

module.exports.getSocketIdForUser = getSocketIdForUser;
