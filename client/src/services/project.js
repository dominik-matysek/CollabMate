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

	getAllProjects: async (teamId) => {
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

	addMembersToProject: async (projectId, memberData) => {
		return apiRequest(
			"PATCH",
			`${projectAPI}/projects/${projectId}/add-member`,
			memberData
		);
	},

	removeMemberFromProject: async (projectId, memberId) => {
		return apiRequest(
			"PATCH",
			`${projectAPI}/projects/${projectId}/remove-member`,
			{ memberId }
		);
	},

	changeProjectStatus: async (projectId) => {
		return apiRequest(
			"PATCH",
			`${projectAPI}/projects/${projectId}/change-status`
		);
	},

	changeProjectDescription: async (projectId, description) => {
		return apiRequest(
			"PATCH",
			`${projectAPI}/projects/${projectId}/change-description`,
			{ description }
		);
	},
};

export default projectService;
