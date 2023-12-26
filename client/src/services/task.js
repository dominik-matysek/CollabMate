const { apiRequest } = require(".");

const taskAPI = "/api/tasks";

const taskService = {
  createTask: async (projectId, taskData) => {
    return apiRequest("POST", `${taskAPI}/${projectId}/create`, taskData);
  },

  getTaskById: async (taskId) => {
    return apiRequest("GET", `${taskAPI}/${taskId}`);
  },

  editTask: async (taskId, updatedTaskData) => {
    return apiRequest("POST", `${taskAPI}/${taskId}/edit`, updatedTaskData);
  },

  deleteTask: async (taskId) => {
    return apiRequest("DELETE", `${taskAPI}/${taskId}`);
  },

  getCommentsForTask: async (taskId) => {
    return apiRequest("GET", `${taskAPI}/${taskId}/get-comments`);
  },
};

module.exports = taskService;
