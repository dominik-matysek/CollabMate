const { apiRequest } = require(".");

const commentAPI = "/api/comments";

const commentService = {
	createComment: async (taskId, content) => {
		return apiRequest("POST", `${commentAPI}/${taskId}/comments/create`, {
			content,
		});
	},

	getComments: async (taskId) => {
		return apiRequest("GET", `${commentAPI}/${taskId}/comments`);
	},

	deleteComment: async (taskId, commentId) => {
		return apiRequest(
			"DELETE",
			`${commentAPI}/${taskId}/comments/${commentId}`
		);
	},
};

export default commentService;
