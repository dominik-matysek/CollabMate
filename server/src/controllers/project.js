const Project = require("../models/project");
const Team = require("../models/team");
const User = require("../models/user");

const projectValidation = require("../utils/projectValidation");

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const { error } = projectValidation.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { name, description } = req.body;
    const teamId = req.params.teamId;

    // Create a new project
    const project = new Project({ name, description });
    await project.save();

    // Add the project to the team's projects array
    const team = await Team.findByIdAndUpdate(
      teamId,
      { $push: { projects: project._id } },
      { new: true }
    );

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.status(200).json({
      success: true,
      message: "Stworzono projekt",
      data: project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a project by ID
exports.getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;

    // Retrieve a project by ID
    const project = await Project.findById(projectId)
      .populate("tasks", "name status priority")
      .populate("members", "firstName lastName email");

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json({
      success: true,
      message: "Pobrano projekt",
      data: project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Edit a project
exports.editProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { name, description, status } = req.body;

    const { error } = projectValidation.validate(name, description);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    // Update a project by ID
    const project = await Project.findByIdAndUpdate(
      projectId,
      { name, description, status },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json({
      success: true,
      message: "Edytowano projekt",
      data: project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findById(projectId);

    // If there are tasks in project, forbid to delete project
    if (project.tasks.length > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete project with active tasks" });
    }

    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Remove the project from the team's projects array
    const team = await Team.findByIdAndUpdate(
      req.team._id,
      { $pull: { projects: projectId } },
      { new: true }
    );

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to add a member to a project
exports.addMemberToProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { userId } = req.body; // Extract userId from request body

    // Check if the user is a member of the team associated with the project
    const team = await Team.findOne({ projects: projectId, members: userId });
    if (!team) {
      return res
        .status(403)
        .json({ message: "User is not a member of the team" });
    }

    // Add a member to a project
    const project = await Project.findByIdAndUpdate(
      projectId,
      { $push: { members: userId } },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json({
      success: true,
      message: "Dodano członka do projektu",
      data: project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to remove a member from a project
exports.removeMemberFromProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.params.userId;

    // Remove a member from a project
    const project = await Project.findByIdAndUpdate(
      projectId,
      { $pull: { members: userId } },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json({
      success: true,
      message: "Usunięto członka z projektu",
      data: project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to get all tasks of a project
exports.getAllTasks = async (req, res) => {
  try {
    const projectId = req.params.id;

    // Retrieve all tasks of a project
    const project = await Project.findById(projectId).populate("tasks");

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json({
      success: true,
      message: "Pobrano wszystkie zadania",
      data: project.tasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
