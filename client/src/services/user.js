const { apiRequest } = require(".");

const userAPI = "/api/users";

const userService = {
  register: async (userData) => {
    console.log("Registration data:", userData);
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

  updateProfile: async (userId, updatedProfile) => {
    return apiRequest("POST", `${userAPI}/profile/${userId}`, updatedProfile);
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
};

export default userService;
