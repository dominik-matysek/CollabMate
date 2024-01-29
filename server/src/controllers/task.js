const Task = require("../models/task");
const Team = require("../models/team");
const Comment = require("../models/comment");
const Project = require("../models/project");
const moment = require("moment");
const { getAllowedStatusTransitions } = require("../utils/allowedStatus");
const { deleteFile } = require("../config/cloudinary");

const taskCreateValidation = require("../utils/taskValidation");

// Controller to create a new task
exports.createTask = async (req, res) => {
  try {
    const { name, description, priority, dueDate, memberIds } = req.body;

    const { error } = taskCreateValidation.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const projectId = req.params.projectId;
    const creatorId = req.userId;

    // Validate dueDate
    if (!moment(dueDate).isAfter(moment().startOf("day"))) {
      return res
        .status(400)
        .json({ message: "Termin musi istnieć w przyszłości." });
    }

    // Retrieve the specified project and populate team members
    const project = await Project.findById(projectId).populate("team");
    if (!project) {
      return res.status(404).json({ message: "Nie znaleziono projektu." });
    }

    // Retrieve the team associated with the project
    const team = await Team.findById(project.team);
    if (!team) {
      return res.status(404).json({ message: "Nie znaleziono zespołu." });
    }

    // Include the creator's ID in the members list and filter validMemberIds
    const validMemberIds = new Set(memberIds);
    validMemberIds.add(creatorId); // Ensure the creator is always a member

    // Filter out any memberIds that are not part of the project's team
    const filteredMemberIds = Array.from(validMemberIds).filter(
      (memberId) =>
        project.members.includes(memberId) && team.members.includes(memberId)
    );

    // Create a new task with valid members
    const task = new Task({
      name,
      description,
      priority,
      dueDate,
      members: filteredMemberIds,
      createdBy: creatorId,
      project: projectId,
    });

    await task.save();

    // Add the task to the project's tasks array
    project.tasks.push(task._id);
    await project.save();

    res.status(200).json({
      success: true,
      message: "Stworzono zadanie",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to get all tasks of a project
exports.getAllTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Retrieve all tasks of a project
    const project = await Project.findById(projectId).populate({
      path: "tasks",
      select: "name members createdAt createdBy dueDate",
      populate: [
        {
          path: "members",
          select: "profilePic",
        },
        {
          path: "createdBy",
          select: "firstName lastName",
        },
      ],
    });

    if (!project) {
      return res.status(404).json({ error: "Nie znaleziono projektu." });
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

// Controller to get a task by ID
exports.getTaskById = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const userRole = req.userRole;

    // Retrieve a task by ID and populate the 'members' and 'comments' fields
    const task = await Task.findById(taskId).populate(
      "members",
      "firstName lastName profilePic role"
    );

    if (!task) {
      return res.status(404).json({ error: "Nie znaleziono zadania." });
    }

    if (new Date() > new Date(task.dueDate) && task.status !== "overdue") {
      task.status = "overdue";
      await task.save();
    }

    const allowedTransitions = getAllowedStatusTransitions(
      task.status,
      userRole
    );

    res.status(200).json({
      success: true,
      message: "Pobrano zadanie",
      data: task,
      allowedTransitions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to delete a task
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;

    const userId = req.userId;

    // Retrieve the task with its project ID
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Nie znaleziono zadania." });
    }

    // Check if the task status is inProgress or completed
    if (task.status === "inProgress" || task.status === "completed") {
      return res.status(400).json({
        error:
          "Nie można usunąć zadania które ma status: w trakcie lub zakończone. Zmień status lub zadbaj o zaakceptowanie przed lidera.",
      });
    }

    const isCreator = task.createdBy === userId;
    const isTeamLeader = req.userRole === "TEAM LEADER";

    if (!isCreator && !isTeamLeader) {
      return res.status(403).json({
        error: "Tylko liderzy lub założyciel zadania mogą go usunąć.",
      });
    }

    // Delete all comments associated with the task
    await Comment.deleteMany({ _id: { $in: task.comments } });

    // Remove the task from the project's tasks array
    await Project.findByIdAndUpdate(
      task.project,
      { $pull: { tasks: taskId } },
      { new: true }
    );

    // Delete the task
    await Task.findByIdAndDelete(taskId);

    res
      .status(200)
      .json({ success: true, message: "Pomyślnie usunięto zadanie." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addMembersToTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { userIds } = req.body;

    const task = await Task.findById(taskId).populate("project", "members");

    if (!task) {
      return res.status(404).json({ error: "Nie znaleziono zadania." });
    }

    const alreadyMembers = userIds.filter((userId) =>
      task.members.includes(userId)
    );

    if (alreadyMembers.length > 0) {
      return res.status(400).json({
        error: "Jeden lub więcej użytkowników należy już do członków zadania.",
      });
    }
    const areAllUsersProjectMembers = userIds.every((userId) =>
      task.project.members.includes(userId)
    );

    if (!areAllUsersProjectMembers) {
      return res.status(403).json({
        message: "Jeden lub więcej użytkowników nie są członkami projektu.",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $addToSet: { members: { $each: userIds } } }, // $addToSet ensures no duplicates
      { new: true }
    ).populate("project", "members");

    res.status(200).json({
      success: true,
      message: "Dodano członków do zadania",
      data: updatedTask,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.removeMemberFromTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const userId = req.body.memberId;

    // Remove a member from a task
    const task = await Task.findByIdAndUpdate(
      taskId,
      { $pull: { members: userId } },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: "Nie znaleziono zadania." });
    }

    res.status(200).json({
      success: true,
      message: "Usunięto członka z zadania",
      data: task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.changeTaskPriority = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Nie znaleziono projektu" });
    }

    // Cycle through the statuses
    const nextPriority = {
      low: "medium",
      medium: "high",
      high: "low",
    };

    const newPriority = nextPriority[task.priority] || "medium";

    // Update the project status
    task.priority = newPriority;

    await task.save();

    res.status(200).json({
      success: true,
      message: "Priorytet zadania zaktualizowany pomyślnie",
      data: { priority: newPriority },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.changeTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userRole = req.userRole;
    const newStatus = req.body.status;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const allowedTransitions = getAllowedStatusTransitions(
      task.status,
      userRole
    );

    if (!allowedTransitions.includes(newStatus)) {
      return res.status(400).json({ message: "Niewłaściwy status." });
    }

    task.status = newStatus;

    await task.save();

    res.status(200).json({
      success: true,
      message: "Pomyślnie zaktualizowano zadanie",
      data: { status: task.status },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.changeTaskDescription = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { description } = req.body;

    const result = await Task.updateOne(
      { _id: taskId },
      { $set: { description: description } }
    );

    if (result.nModified === 0) {
      return res
        .status(404)
        .json({ message: "Nie znaleziono zadania lub nie zmieniono opisu." });
    }

    res.status(200).json({
      success: true,
      message: "Opis zadania zaktualizowany pomyślnie",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.uploadAttachments = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Nie znaleziono zadania." });
    }

    if (req.files) {
      req.files.forEach((file) => {
        const fileUrl = file.path;
        task.attachments.push(fileUrl);
      });
    }

    await task.save();

    res.status(200).json({
      success: true,
      message: "Pomyślnie dodano załączniki",
      data: { attachmentUrls: task.attachments },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.removeAttachment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const attachmentUrl = decodeURIComponent(req.query.url);

    // Update the task and remove the attachment
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $pull: { attachments: attachmentUrl } },
      { new: true } // Return the updated document
    );

    if (!updatedTask) {
      return res.status(404).json({
        message:
          "Nie znaleziono zadania lub nie wybrano załącznika do usunięcia",
      });
    }

    // Extract publicId and use utility function to delete from Cloudinary
    const publicId = `CollabMate/Attachments/${
      attachmentUrl.split("/").pop().split(".")[0]
    }`;
    const { success, error } = await deleteFile(publicId);

    if (!success) {
      return res
        .status(500)
        .json({ error: "Nie udało się usunąć załącznika z systemu." });
    }

    res.status(200).json({
      success: true,
      message: "Pomyślnie usunięto załącznik",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
