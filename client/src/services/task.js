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

	getAllTasks: async (projectId) => {
		return apiRequest("GET", `${taskAPI}/projects/${projectId}/tasks`);
	},

	getTaskById: async (taskId) => {
		return apiRequest("GET", `${taskAPI}/tasks/${taskId}`);
	},

	deleteTask: async (taskId) => {
		return apiRequest("DELETE", `${taskAPI}/tasks/${taskId}`);
	},

	addMembersToTask: async (taskId, memberData) => {
		return apiRequest(
			"PATCH",
			`${taskAPI}/tasks/${taskId}/add-member`,
			memberData
		);
	},

	removeMemberFromTask: async (taskId, memberId) => {
		return apiRequest("PATCH", `${taskAPI}/tasks/${taskId}/remove-member`, {
			memberId,
		});
	},

	changeTaskPriority: async (taskId) => {
		return apiRequest("PATCH", `${taskAPI}/tasks/${taskId}/change-priority`);
	},

	changeTaskStatus: async (taskId, status) => {
		return apiRequest("PATCH", `${taskAPI}/tasks/${taskId}/change-status`, {
			status,
		});
	},

	changeTaskDescription: async (taskId, description) => {
		return apiRequest(
			"PATCH",
			`${taskAPI}/tasks/${taskId}/change-description`,
			{ description }
		);
	},

	uploadAttachments: async (taskId, formData) => {
		return apiRequest(
			"POST",
			`${taskAPI}/tasks/${taskId}/upload-attachments`,
			formData
		);
	},

	removeAttachment: async (taskId, attachmentId) => {
		const encodedUrl = encodeURIComponent(attachmentId);
		return apiRequest(
			"DELETE",
			`${taskAPI}/tasks/${taskId}/remove-attachment?url=${encodedUrl}`
		);
	},
};

module.exports = taskService;
