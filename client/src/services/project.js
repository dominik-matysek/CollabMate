const { apiRequest } = require(".");

const projectAPI = "/api/projects";

const projectService = {
  createProject: async (teamId, projectData) => {
    return apiRequest("POST", `${projectAPI}/${teamId}/create`, projectData);
  },

  getProjectById: async (projectId) => {
    return apiRequest("GET", `${projectAPI}/${projectId}`);
  },

  editProject: async (projectId, projectData) => {
    return apiRequest("POST", `${projectAPI}/${projectId}/edit`, projectData);
  },

  deleteProject: async (projectId) => {
    return apiRequest("DELETE", `${projectAPI}/${projectId}`);
  },

  addMemberToProject: async (projectId, userId) => {
    return apiRequest(
      "POST",
      `${projectAPI}/${projectId}/add-member/${userId}`
    );
  },

  removeMemberFromProject: async (projectId, userId) => {
    return apiRequest(
      "POST",
      `${projectAPI}/${projectId}/remove-member/${userId}`
    );
  },

  getAllTasksForProject: async (projectId) => {
    return apiRequest("GET", `${projectAPI}/${projectId}/get-tasks`);
  },
};

export default projectService;
