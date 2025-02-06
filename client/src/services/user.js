const { apiRequest } = require(".");

const userAPI = "/api/users";

const userService = {
	register: async (userData) => {
		return apiRequest("POST", `${userAPI}/register`, userData);
	},

	login: async (userData) => {
		return apiRequest("POST", `${userAPI}/login`, userData);
	},

	logout: async () => {
		return apiRequest("POST", `${userAPI}/logout`);
	},

	authenticate: async () => {
		return apiRequest("GET", `${userAPI}/authenticate`);
	},

	setInitialProfilePic: async (userId, profilePicData) => {
		return apiRequest("PATCH", `${userAPI}/${userId}`, profilePicData);
	},

	updateProfile: async (userId, updatedProfile) => {
		return apiRequest("PATCH", `${userAPI}/profile/${userId}`, updatedProfile);
	},

	uploadImage: async (imageData) => {
		return apiRequest("POST", `${userAPI}/upload-image`, imageData);
	},

	getAllUsers: async () => {
		return apiRequest("GET", `${userAPI}/`);
	},

	getUserInfo: async (userId) => {
		return apiRequest("GET", `${userAPI}/profile/${userId}`);
	},

	removeUserFromSystem: async (userId) => {
		return apiRequest("DELETE", `${userAPI}/${userId}`);
	},

	refreshToken: async () => {
		return apiRequest("POST", `${userAPI}/refresh-token`);
	},

	googleLogin: async () => {
		return apiRequest("GET", `${userAPI}/auth/google`);
	},

	googleCallback: async () => {
		return apiRequest("GET", `${userAPI}/auth/google/callback`);
	},
};

export default userService;
