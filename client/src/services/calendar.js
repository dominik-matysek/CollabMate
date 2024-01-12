const { apiRequest } = require(".");

const calendarAPI = "/api/calendar";

const calendarService = {
	createEvent: async (teamId, eventData) => {
		return apiRequest(
			"POST",
			`${calendarAPI}/teams/${teamId}/calendar/create-event`,
			eventData
		);
	},

	getAllEvents: async (teamId) => {
		return apiRequest("GET", `${calendarAPI}/teams/${teamId}/calendar/events`);
	},

	getEventById: async (teamId, eventId) => {
		return apiRequest(
			"GET",
			`${calendarAPI}/teams/${teamId}/calendar/events/${eventId}`
		);
	},

	editEvent: async (teamId, eventId, updatedData) => {
		return apiRequest(
			"PATCH",
			`${calendarAPI}/teams/${teamId}/calendar/events/${eventId}`,
			updatedData
		);
	},

	deleteEvent: async (teamId, eventId) => {
		return apiRequest(
			"DELETE",
			`${calendarAPI}/teams/${teamId}/calendar/events/${eventId}`
		);
	},
};

export default calendarService;
