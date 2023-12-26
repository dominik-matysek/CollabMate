const { apiRequest } = require(".");

const commentAPI = "/api/comments";

const commentService = {
  createComment: async (taskId, commentData) => {
    return apiRequest("POST", `${commentAPI}/${taskId}/create`, commentData);
  },

  editComment: async (commentId, updatedData) => {
    return apiRequest("PUT", `${commentAPI}/${commentId}/edit`, updatedData);
  },

  deleteComment: async (commentId) => {
    return apiRequest("DELETE", `${commentAPI}/${commentId}`);
  },
};

export default commentService;
