const Event = require("../models/event");
const Team = require("../models/team");

const createEventValidation = require("../utils/eventValidation");

// Controller to create a new event in the calendar
exports.createEvent = async (req, res) => {
	try {
		// const { error } = createEventValidation.validate(req.body);
		// if (error)
		// 	return res.status(400).json({ message: error.details[0].message });

		const { title, description, date } = req.body;
		const userId = req.userId;
		const teamId = req.params.teamId;

		console.log("req.body: ", title, " ", description, " ", date);
		console.log("req.userId: ", userId);
		console.log("req.teamId: ", teamId);

		// Basic date validation
		if (new Date(date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
			return res
				.status(400)
				.json({ error: "Event date cannot be in the past" });
		}

		// Verify that the user is a member of the specified team
		const team = await Team.findById(teamId);

		if (!team) {
			return res
				.status(403)
				.json({ error: "User is not a member of the specified team" });
		}

		// Create a new event
		const newEvent = new Event({
			title,
			description,
			date,
			createdBy: userId,
			members: [userId], // Initialize with the creator as a participant
			team: teamId, // Set the team reference
		});

		const savedEvent = await newEvent.save();

		// Add the event to the team's events array
		team.events.push(savedEvent._id);
		await team.save();

		res.status(200).json({
			success: true,
			message: "Dodano wydarzenie",
			data: savedEvent,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.getAllEvents = async (req, res) => {
	try {
		const teamId = req.params.teamId; // Assuming teamId is part of the route parameters

		console.log("W get all events team id: ", teamId);
		// Find the team's calendar and retrieve all events
		const team = await Team.findById(teamId).populate({
			path: "events",
			populate: { path: "members" }, // Optional: if you want to populate event members
		});

		if (!team) {
			return res.status(404).json({ error: "Team not found" });
		}

		res.status(200).json({
			success: true,
			message: "Wydarzenia pobrano",
			data: team.events,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Controller to get a specific event by ID
exports.getEventById = async (req, res) => {
	try {
		const eventId = req.params.eventId;

		console.log("EventID: ", eventId);

		// Find the specific event by its ID
		const event = await Event.findById(eventId).populate(
			"members",
			"firstName lastName profilePic role"
		); // Populate members if needed

		if (!event) {
			return res.status(404).json({ error: "Event not found" });
		}

		res.status(200).json({
			success: true,
			message: "Wyswietlono wydarzenie",
			data: event,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Controller to edit an event by ID
exports.editEvent = async (req, res) => {
	try {
		const eventId = req.params.eventId;
		const { title, description, date } = req.body;

		// const { error } = eventValidation.validate(req.body);
		// if (error)
		// 	return res.status(400).json({ message: error.details[0].message });

		if (
			date &&
			new Date(date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
		) {
			return res
				.status(400)
				.json({ error: "Event date cannot be in the past" });
		}

		// Find and update the specific event
		const event = await Event.findById(eventId);

		if (!event) {
			return res.status(404).json({ error: "Event not found" });
		}

		// Update event properties if provided
		if (title) event.title = title;
		if (description) event.description = description;
		if (date) event.date = date;

		await event.save();

		res.status(200).json({
			success: true,
			message: "Edytowano wydarzenie",
			data: event,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Controller to delete an event by ID
exports.deleteEvent = async (req, res) => {
	try {
		const eventId = req.params.eventId;

		const event = await Event.findById(eventId);

		if (!event) {
			return res.status(404).json({ error: "Event not found" });
		}

		// Remove the event from the team's event array
		const team = await Team.findByIdAndUpdate(
			event.team,
			{ $pull: { events: eventId } },
			{ new: true }
		);

		if (!team) {
			return res.status(404).json({ error: "Team not found" });
		}

		await Event.findByIdAndDelete(eventId);

		res.status(200).json({ success: true, message: "Usunięto wydarzenie" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.addMembersToEvent = async (req, res) => {
	try {
		const eventId = req.params.eventId;
		const { memberIds } = req.body; // Extract memberIds from request body

		console.log("EVENTID: ", eventId);

		console.log("Userzy w evencie do dodania: ", memberIds);

		// Find the event and populate the team reference
		const event = await Event.findById(eventId).populate("team", "members");

		if (!event) {
			return res.status(404).json({ error: "Event not found" });
		}

		// Check if all users are members of the team associated with the event
		const areAllUsersTeamMembers = memberIds.every((memberId) =>
			event.team.members.includes(memberId)
		);

		if (!areAllUsersTeamMembers) {
			return res
				.status(403)
				.json({ error: "One or more users are not members of the team" });
		}

		// Update the event by adding new members, using $addToSet to avoid duplicates
		await Event.findByIdAndUpdate(
			eventId,
			{ $addToSet: { members: { $each: memberIds } } },
			{ new: true }
		);

		res.status(200).json({
			success: true,
			message: "Members added to event successfully",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.removeMemberFromEvent = async (req, res) => {
	try {
		const eventId = req.params.eventId;
		const memberId = req.body.memberId; // Extract memberId from request body

		// Remove a member from the event
		const updatedEvent = await Event.findByIdAndUpdate(
			eventId,
			{ $pull: { members: memberId } },
			{ new: true }
		);

		if (!updatedEvent) {
			return res.status(404).json({ error: "Event not found" });
		}

		res.status(200).json({
			success: true,
			message: "Member removed from event successfully",
			data: updatedEvent,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
