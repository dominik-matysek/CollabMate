const Calendar = require("../models/calendar");
const Team = require("../models/team");

const {
	createEventValidation,
	editEventValidation,
} = require("../utils/calendarEventValidation");

// Controller to create a new event in the calendar
exports.createEvent = async (req, res) => {
	try {
		const { error } = createEventValidation(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		const { title, description, date, timeStart, timeEnd } = req.body;
		const userId = req.user._id;
		const teamId = req.params.teamId;

		// Verify that the user is a member of the specified team
		const team = await Team.findOne({ _id: teamId, members: userId });

		if (!team) {
			return res
				.status(403)
				.json({ error: "User is not a member of the specified team" });
		}

		// Access the team's calendar and add the event
		const teamCalendar = team.calendar;

		if (!teamCalendar) {
			return res.status(404).json({ error: "Team calendar not found" });
		}

		// Create a new event
		const event = {
			title,
			description,
			date,
			timeStart,
			timeEnd,
			createdBy: userId, // Assuming req.user contains the authenticated user details
			participants: [userId], // Add participants as needed
		};

		teamCalendar.events.push(event);
		await teamCalendar.save();
		await team.save();

		res.status(201).json({ event });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.getAllEvents = async (req, res) => {
	try {
		const teamId = req.params.teamId; // Assuming teamId is part of the route parameters

		// Find the team's calendar and retrieve all events
		const team = await Team.findOne({ _id: teamId }).populate("calendar");

		if (!team) {
			return res.status(404).json({ error: "Team not found" });
		}

		const teamCalendar = team.calendar;

		if (!teamCalendar) {
			return res.status(404).json({ error: "Team calendar not found" });
		}

		res.status(200).json({ events: teamCalendar.events });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Controller to get a specific event by ID
exports.getEventById = async (req, res) => {
	try {
		const teamId = req.params.teamId; // Assuming teamId is part of the route parameters
		const eventId = req.params.id;

		// Find the team's calendar and retrieve the specific event
		const team = await Team.findOne({ _id: teamId }).populate("calendar");

		if (!team) {
			return res.status(404).json({ error: "Team not found" });
		}

		const teamCalendar = team.calendar;

		if (!teamCalendar) {
			return res.status(404).json({ error: "Team calendar not found" });
		}

		const event = teamCalendar.events.id(eventId);

		if (!event) {
			return res.status(404).json({ error: "Event not found" });
		}

		res.status(200).json({ event });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Controller to edit an event by ID
exports.editEvent = async (req, res) => {
	try {
		const teamId = req.params.teamId; // Assuming teamId is part of the route parameters
		const eventId = req.params.id;
		const { title, description, date, timeStart, timeEnd } = req.body;

		const { error } = editEventValidation(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		// Find the team's calendar and update the specific event
		const team = await Team.findOne({ _id: teamId }).populate("calendar");

		if (!team) {
			return res.status(404).json({ error: "Team not found" });
		}

		const teamCalendar = team.calendar;

		if (!teamCalendar) {
			return res.status(404).json({ error: "Team calendar not found" });
		}

		const event = teamCalendar.events.id(eventId);

		if (!event) {
			return res.status(404).json({ error: "Event not found" });
		}

		// Update event properties
		event.title = title;
		event.description = description;
		event.date = date;
		event.timeStart = timeStart;
		event.timeEnd = timeEnd;

		await teamCalendar.save();

		res.status(200).json({ event });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Controller to delete an event by ID
exports.deleteEvent = async (req, res) => {
	try {
		const teamId = req.params.teamId; // Assuming teamId is part of the route parameters
		const eventId = req.params.id;

		// Find the team's calendar and delete the specific event
		const team = await Team.findOne({ _id: teamId }).populate("calendar");

		if (!team) {
			return res.status(404).json({ error: "Team not found" });
		}

		const teamCalendar = team.calendar;

		if (!teamCalendar) {
			return res.status(404).json({ error: "Team calendar not found" });
		}

		teamCalendar.events.id(eventId).remove();
		await teamCalendar.save();

		res.status(200).json({ message: "Event deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
