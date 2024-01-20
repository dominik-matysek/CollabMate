// Server file

if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const express = require("express");
const http = require("http");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
	cors: {
		origin: "http://localhost:3000", // specify the origin of your frontend
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		credentials: true, // allow credentials like cookies, authorization headers, etc.
	},
});

app.io = io;

require("./websocket")(io);

const db = require("./config/db");
const port = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");

// Rate Limiting middleware
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
// });

// Enable additional middleware for all routes
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

// const store = new MongoStore({
//   mongoUrl: db,
// });

// const sessionConfig = {
//   store: store,
//   name: "session",
//   secret: process.env.SESSION_SECRET || "default-secret-key",
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
//     maxAge: 1000 * 60 * 60 * 24 * 7,
//   },
// };

// app.use(session(sessionConfig));
app.use(helmet());
app.use(cookieParser());
// app.use(limiter);
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
const eventRoutes = require("./routes/event");

// console.log("User routes base path:", userRoutes);

app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/event", eventRoutes);
// app.all('*', require('./routes/404'))

server.listen(port, () =>
	console.log(`Node JS server listening on port ${port}`)
);

// app.listen(port, () => console.log(`Node JS server listening on port ${port}`));
