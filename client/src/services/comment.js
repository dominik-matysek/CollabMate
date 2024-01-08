const { apiRequest } = require(".");

const commentAPI = "/api/comments";

const commentService = {
	createComment: async (taskId, commentData) => {
		return apiRequest(
			"POST",
			`${commentAPI}/${taskId}/comments/create`,
			commentData
		);
	},

	editComment: async (taskId, commentId, updatedData) => {
		return apiRequest(
			"PATCH",
			`${commentAPI}/${taskId}/comments/${commentId}`,
			updatedData
		);
	},

	deleteComment: async (taskId, commentId) => {
		return apiRequest(
			"DELETE",
			`${commentAPI}/${taskId}/comments/${commentId}`
		);
	},
};

export default commentService;
