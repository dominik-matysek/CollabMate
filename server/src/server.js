// Server file

if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const express = require("express");
const app = express();
const db = require("./config/db");
const port = process.env.PORT || 5000;

// Enable additional middleware for all routes
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

app.use(helmet());
app.use(morgan("combined"));
app.use(mongoSanitize());
app.use(
	cors({
		origin: "http://localhost:3000", // specify the origin of your frontend
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
const calendarRoutes = require("./routes/calendar");

// console.log("User routes base path:", userRoutes);

app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/calendar", calendarRoutes);

app.listen(port, () => console.log(`Node JS server listening on port ${port}`));
