const { apiRequest } = require(".");

const projectAPI = "/api/projects";

const projectService = {
	createProject: async (teamId, projectData) => {
		return apiRequest(
			"POST",
			`${projectAPI}/teams/${teamId}/projects/create`,
			projectData
		);
	},

	getAllProjects: async (teamId, projectId) => {
		return apiRequest("GET", `${projectAPI}/teams/${teamId}/projects`);
	},

	getProjectById: async (projectId) => {
		return apiRequest("GET", `${projectAPI}/projects/${projectId}`);
	},

	editProject: async (projectId, projectData) => {
		return apiRequest(
			"PATCH",
			`${projectAPI}/projects/${projectId}`,
			projectData
		);
	},

	deleteProject: async (projectId) => {
		return apiRequest("DELETE", `${projectAPI}/projects/${projectId}`);
	},

	addMemberToProject: async (projectId, userId) => {
		return apiRequest(
			"PATCH",
			`${projectAPI}/projects/${projectId}/add-member/${userId}`
		);
	},

	removeMemberFromProject: async (projectId, userId) => {
		return apiRequest(
			"PATCH",
			`${projectAPI}/projects/${projectId}/remove-member/${userId}`
		);
	},
};

export default projectService;
