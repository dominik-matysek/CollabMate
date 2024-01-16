const { apiRequest } = require(".");

const eventAPI = "/api/event";

const eventService = {
	createEvent: async (teamId, eventData) => {
		return apiRequest("POST", `${eventAPI}/teams/${teamId}/events`, eventData);
	},

	getAllEvents: async (teamId) => {
		console.log("service: ", teamId);
		return apiRequest("GET", `${eventAPI}/teams/${teamId}/events`);
	},

	getEventById: async (eventId) => {
		return apiRequest("GET", `${eventAPI}/events/${eventId}`);
	},

	editEvent: async (eventId, updatedData) => {
		return apiRequest("PATCH", `${eventAPI}/events/${eventId}`, updatedData);
	},

	deleteEvent: async (eventId) => {
		return apiRequest("DELETE", `${eventAPI}/events/${eventId}`);
	},

	addMembersToEvent: async (eventId, memberData) => {
		return apiRequest(
			"PATCH",
			`${eventAPI}/events/${eventId}/add-member`,
			memberData
		);
	},

	removeMemberFromEvent: async (eventId, memberId) => {
		return apiRequest("PATCH", `${eventAPI}/events/${eventId}/remove-member`, {
			memberId,
		});
	},
};

export default eventService;
