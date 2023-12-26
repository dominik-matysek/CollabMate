const { apiRequest } = require(".");

const calendarAPI = "/api/calendar";

const calendarService = {
  createEvent: async (teamId, eventData) => {
    return apiRequest(
      "POST",
      `${calendarAPI}/${teamId}/create-event`,
      eventData
    );
  },

  getAllEvents: async (teamId) => {
    return apiRequest("GET", `${calendarAPI}/${teamId}/events`);
  },

  getEventById: async (teamId, eventId) => {
    return apiRequest("GET", `${calendarAPI}/${teamId}/events/${eventId}`);
  },

  editEvent: async (teamId, eventId, updatedData) => {
    return apiRequest(
      "POST",
      `${calendarAPI}/${teamId}/events/${eventId}/edit`,
      updatedData
    );
  },

  deleteEvent: async (teamId, eventId) => {
    return apiRequest("DELETE", `${calendarAPI}/${teamId}/events/${eventId}`);
  },
};

export default calendarService;
