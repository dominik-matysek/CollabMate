const { apiRequest } = require(".");

const userAPI = "/api/users";

const userService = {
	register: async (userData) => {
		return apiRequest("POST", `${userAPI}/register`, userData);
	},

	login: async (userData) => {
		return apiRequest("POST", `${userAPI}/login`, userData);
	},

	authenticate: async () => {
		return apiRequest("GET", `${userAPI}/authenticate`);
	},

	updateProfile: async (userId, updatedProfile) => {
		return apiRequest("POST", `${userAPI}/profile/update`, updatedProfile);
	},
};

export default userService;
