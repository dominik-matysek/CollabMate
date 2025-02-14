const { apiRequest } = require(".");

const notificationAPI = "/api/notifications";

const notificationService = {
	createNotification: async (notificationData) => {
		return apiRequest("POST", `${notificationAPI}/create`, notificationData);
	},

	getNotifications: async () => {
		return apiRequest("GET", `${notificationAPI}/`);
	},

	markNotificationAsRead: async (notificationId) => {
		return apiRequest(
			"PATCH",
			`${notificationAPI}/${notificationId}/mark-as-read`
		);
	},

	deleteNotification: async (notificationId) => {
		return apiRequest("DELETE", `${notificationAPI}/${notificationId}`);
	},

	deleteAllNotifications: async () => {
		return apiRequest("DELETE", `${notificationAPI}/`);
	},
};

export default notificationService;
