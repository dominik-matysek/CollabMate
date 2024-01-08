const { apiRequest } = require(".");

const taskAPI = "/api/tasks";

const taskService = {
	createTask: async (projectId, taskData) => {
		return apiRequest(
			"POST",
			`${taskAPI}/projects/${projectId}/tasks/create`,
			taskData
		);
	},

	getAllTasks: async (projectId, taskId) => {
		return apiRequest("GET", `${taskAPI}/projects/${projectId}/tasks`);
	},

	getTaskById: async (taskId) => {
		return apiRequest("GET", `${taskAPI}/tasks/${taskId}`);
	},

	editTask: async (taskId, updatedTaskData) => {
		return apiRequest("PATCH", `${taskAPI}/tasks/${taskId}`, updatedTaskData);
	},

	deleteTask: async (taskId) => {
		return apiRequest("DELETE", `${taskAPI}/tasks/${taskId}`);
	},

	getCommentsForTask: async (taskId) => {
		return apiRequest("GET", `${taskAPI}/tasks/${taskId}/comments`);
	},
};

module.exports = taskService;
