// Server file

if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const express = require("express");
const http = require("http");
const rateLimit = require("express-rate-limit");
const socketIo = require("socket.io");

const app = express();

const server = http.createServer(app);
const io = socketIo(server, {
	cors: {
		origin: "http://localhost:3000", // specify the origin of frontend
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		credentials: true, // allow credentials like cookies, authorization headers, etc.
	},
});

app.io = io;

require("./config/websocket")(io);

const db = require("./config/db");
const port = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");

// rate limit middleware
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
});

// Enable additional middleware for all routes
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

app.use(helmet());
app.use(cookieParser());
app.use(limiter);
app.use(morgan("combined"));
app.use(mongoSanitize());
app.use(
	cors({
		origin: "http://localhost:3000", // specify the origin of frontend
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		credentials: true, // allow credentials like cookies, authorization headers, etc.
	})
);
app.use(express.json());

// routes
const userRoutes = require("./routes/user");
const teamRoutes = require("./routes/team");
const projectRoutes = require("./routes/project");
const taskRoutes = require("./routes/task");
const commentRoutes = require("./routes/comment");
const notificationRoutes = require("./routes/notification");
const eventRoutes = require("./routes/event");

app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/event", eventRoutes);
app.use((req, res, next) => {
	// Catch-all route for non-existing routes
	res.status(404).json({
		success: false,
		message: "Endpoint Not Found",
	});
});

server.listen(port, () =>
	console.log(`Node JS server listening on port ${port}`)
);
