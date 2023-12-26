const { apiRequest } = require(".");

const userAPI = "/api/users";

// export const RegisterUser = async (payload) => {
// 	console.log("Registration data:", payload);
// 	return apiRequest("post", "/api/users/register", payload);
// };

const userService = {
  register: async (userData) => {
    console.log("Registration data:", userData);
    return apiRequest("POST", `${userAPI}/register`, userData);
  },

  login: async (userData) => {
    return apiRequest("POST", `${userAPI}/login`, userData);
  },

  authenticate: async () => {
    return apiRequest("GET", `${userAPI}/authenticate`);
  },

  updateProfile: async (userId, updatedProfile) => {
    return apiRequest(
      "POST",
      `${userAPI}/profile/${userId}/update`,
      updatedProfile
    );
  },
};

export default userService;
