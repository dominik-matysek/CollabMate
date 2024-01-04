const Team = require("../models/team");
const User = require("../models/user");
const Calendar = require("../models/calendar");
const teamValidation = require("../utils/teamValidation");

// Create a team
exports.createTeam = async (req, res) => {
  try {
    const { error } = teamValidation.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { name, teamLeadId } = req.body;

    // Check if the specified team leader exists and has the correct role
    const teamLead = await User.findOne({
      _id: teamLeadId,
      role: { $ne: "ADMIN" },
    });
    if (!teamLead) {
      return res.status(400).json({ message: "Invalid team leader ID." });
    }

    // Create a new team
    const newTeam = new Team({
      name,
      teamLead: teamLead._id,
      members: [teamLead._id],
    });

    // Automatically create a calendar for the team
    const newCalendar = new Calendar();
    newTeam.calendar = newCalendar._id;

    // Save the team and the calendar
    const savedTeam = await newTeam.save();
    const savedCalendar = await newCalendar.save();

    // Update the team lead's "teams" property
    await User.findByIdAndUpdate(
      teamLeadId,

      { $addToSet: { teams: savedTeam._id }, $set: { role: "TEAM LEADER" } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Utworzono zespół",
      data: savedTeam,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get view of all teams
exports.getAllTeams = async (req, res) => {
  try {
    console.log("Jestem w kontrolerze");
    // Fetch all teams from the database
    const teams = await Team.find();
    console.log(teams);
    // .sort({ createdAt: -1 })
    // .populate("teamLead members", "firstName lastName email");

    res.status(200).json({
      success: true,
      message: "Pobrano zespoły",
      data: teams,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get a team by ID
exports.getTeamById = async (req, res) => {
  try {
    const teamId = req.params.id;
    const team = await Team.findById(teamId).populate(
      "teamLead members",
      "firstName lastName email"
    );

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json({
      success: true,
      message: "Pobrano zespół",
      data: team,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Edit a team by ID
exports.editTeam = async (req, res) => {
  try {
    const teamId = req.params.id;

    const { error } = teamValidation.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const updatedTeam = await Team.findByIdAndUpdate(teamId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTeam) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json({
      success: true,
      message: "Edytowano zespół",
      data: updatedTeam,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete a team by Id
exports.deleteTeam = async (req, res) => {
  try {
    const teamId = req.params.id;

    const team = await Team.findById(teamId);

    // If there are projects in team, forbid to delete team
    if (team.projects.length > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete team with active projects" });
    }
    // Delete associated calendar
    if (team.calendar) {
      await Calendar.findByIdAndDelete(team.calendar);
    }

    // Remove team from users' teams property
    await User.updateMany({ teams: teamId }, { $pull: { teams: teamId } });

    // Finally, delete the team
    const deletedTeam = await Team.findByIdAndDelete(teamId);

    if (!deletedTeam) {
      return res.status(404).json({ message: "Team not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Team deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Add a user to the team
exports.addMemberToTeam = async (req, res) => {
  try {
    const teamId = req.params.id; // Extract team ID from params
    const { searchKey } = req.body; // Extract search key from request body

    // Search for the user by name or email
    const user = await User.findOne({
      $or: [
        { firstName: searchKey },
        { lastName: searchKey },
        { email: searchKey },
      ],
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the user to the team's members
    const updatedTeam = await Team.findByIdAndUpdate(
      teamId,
      { $addToSet: { members: user._id } }, // $addToSet ensures uniqueness
      { new: true }
    );

    if (!updatedTeam) {
      return res.status(404).json({ message: "Team not found" });
    }

    await User.findByIdAndUpdate(
      user._id,
      { $addToSet: { teams: updatedTeam._id } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Dodano członka zespołu",
      data: updatedTeam,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Remove user from a team
exports.removeMemberFromTeam = async (req, res) => {
  try {
    const teamId = req.params.id;
    const userId = req.body.userId; // Extract user ID from request body

    // Remove the user from the team's members
    const updatedTeam = await Team.findByIdAndUpdate(
      teamId,
      { $pull: { members: userId } },
      { new: true }
    );

    if (!updatedTeam) {
      return res.status(404).json({ message: "Team not found" });
    }

    await User.findByIdAndUpdate(
      userId,
      { $pull: { teams: teamId } }, // Remove the team ID from the user's teams array
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Usunięto członka zespołu ",
      data: updatedTeam,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get members of a team
exports.getMembers = async (req, res) => {
  try {
    const teamId = req.params.id;

    // Fetch the team and populate the members
    const team = await Team.findById(teamId).populate(
      "members",
      "firstName lastName email"
    );

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json({
      success: true,
      message: "Pobrano członków",
      data: team.members,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get projects of a team
exports.getAllProjects = async (req, res) => {
  try {
    const teamId = req.params.id;

    // Fetch the team and populate the projects
    const team = await Team.findById(teamId).populate("projects", "name");

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json({
      success: true,
      message: "Pobrano projekty",
      data: team.projects,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
