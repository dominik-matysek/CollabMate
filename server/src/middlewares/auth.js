const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Team = require("../models/team");
const Project = require("../models/project");
const Task = require("../models/task");
const Event = require("../models/event");

const verifyToken = (req, res, next) => {
  try {
    // retrieve token from httponly cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Brak autoryzacji.",
      });
    }
    const decryptedToken = jwt.verify(token, process.env.jwt_secret);

    // attach the userId to the request for later use in route handlers
    req.userId = decryptedToken.userId;
    req.userRole = decryptedToken.userRole;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // token has expired
      return res.status(401).json({ tokenExpired: true });
    }
    console.error(error);
    return res.status(401).json({
      message: "Brak autoryzacji. Spróbuj zalogować się ponownie.",
      error: error.message,
    });
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Brak autoryzacji." });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Nie znaleziono użytkownika." });
    }

    if (user.role === "ADMIN") {
      // allow the request to proceed
      next();
    } else {
      res.status(403).json({ message: "Brak dostępu." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

const verifyLeader = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Brak autoryzacji." });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.role === "TEAM LEADER") {
      // User is a team leader
      next();
    } else {
      res.status(403).json({ message: "Brak dostępu." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

const verifyEventCreator = async (req, res, next) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Brak autoryzacji." });
    }

    const eventId = req.params.eventId || req.body.eventId;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Nie znaleziono wydarzenia." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Nie znaleziono użytkownika." });
    }

    if (user.role === "TEAM LEADER" || userId == event.createdBy) {
      // User is a team leader
      next();
    } else {
      res.status(403).json({ message: "Brak dostępu." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

const verifyCreator = async (req, res, next) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Brak autoryzacji." });
    }

    const taskId = req.params.taskId || req.body.taskId;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Nie znaleziono zadania." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Nie znaleziono użytkownika." });
    }

    if (user.role === "TEAM LEADER" || userId == task.createdBy) {
      // User is a team leader
      next();
    } else {
      res.status(403).json({ message: "Brak dostępu." });
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
      return res.status(401).json({ message: "Brak autoryzacji." });
    }
    let teamId = req.params.teamId || req.body.teamId;

    if (!teamId) {
      const projectId = req.params.projectId || req.body.projectId;
      const taskId = req.params.taskId || req.body.taskId;
      const eventId = req.params.eventId || req.body.eventId;

      if (projectId) {
        const project = await Project.findById(projectId);
        if (!project) {
          return res.status(404).json({ message: "Nie znaleziono projektu." });
        }
        teamId = project.team;
      } else if (taskId) {
        const task = await Task.findById(taskId);
        if (!task) {
          return res.status(404).json({ message: "Nie znaleziono zadania." });
        }
        // Assuming task model has a 'project' field referencing the project it belongs to
        const project = await Project.findById(task.project);
        if (!project) {
          return res
            .status(404)
            .json({ message: "Nie znaleziono powiązanego projektu." });
        }
        teamId = project.team;
      } else if (eventId) {
        const event = await Event.findById(eventId);
        if (!event) {
          return res
            .status(404)
            .json({ message: "Nie znaleziono wydarzenia." });
        }
        teamId = event.team;
      } else {
        return res.status(400).json({ message: "Brak danych." });
      }
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Nie znaleziono zespołu." });
    }

    if (team.members.includes(userId) || team.teamLeaders.includes(userId)) {
      return next();
    }

    return res
      .status(403)
      .json({ message: "Brak dostępu. Nie jesteś członkiem zespołu." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

const checkProjectAccess = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Brak autoryzacji." });
    }
    const projectId = req.params.projectId || req.body.projectId;

    if (!projectId) {
      return res.status(400).json({ message: "Brak ID projektu." });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Nie znaleziono projektu." });
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
      .json({ message: "Brak dostępu. Nie jesteś członkiem zespołu" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

const checkTaskAccess = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Brak autoryzacji." });
    }
    const taskId = req.params.taskId || req.body.taskId;

    if (!taskId) {
      return res.status(400).json({ message: "Wymagane ID zadania." });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Nie znaleziono zadania." });
    }

    // Check if the user is a member of the task or a team leader of the team associated with the project of the task
    const project = await Project.findById(task.project);
    if (!project) {
      return res
        .status(404)
        .json({ message: "Nie znaleziono powiązanego projektu." });
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
      .json({ message: "Brak dostępu. Nie jesteś członkiem zespołu." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

const verifyAdminOrTeamMember = async (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({ message: "Brak autoryzacji." });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Nie znaleziono użytkownika." });
    }

    if (user.role === "ADMIN") {
      // user is an admin, proceed to the next middleware
      return next();
    }

    // if not admin, check team access
    await checkTeamAccess(req, res, next);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

module.exports = {
  verifyToken,
  verifyAdmin,
  verifyLeader,
  verifyCreator,
  checkTeamAccess,
  checkProjectAccess,
  checkTaskAccess,
  verifyAdminOrTeamMember,
  verifyEventCreator,
};
