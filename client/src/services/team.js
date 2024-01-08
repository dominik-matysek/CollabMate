const { apiRequest } = require(".");

const teamAPI = "/api/teams";

const teamService = {
	createTeam: async (teamData) => {
		return apiRequest("POST", `${teamAPI}/teams`, teamData);
	},

	getAllTeams: async () => {
		return apiRequest("GET", `${teamAPI}/teams`);
	},

	getTeamById: async (teamId) => {
		return apiRequest("GET", `${teamAPI}/teams/${teamId}`);
	},

	editTeam: async (teamId, updatedData) => {
		return apiRequest("PATCH", `${teamAPI}/teams/${teamId}`, updatedData);
	},

	deleteTeam: async (teamId) => {
		return apiRequest("DELETE", `${teamAPI}/teams/${teamId}`);
	},

	addMemberToTeam: async (teamId, memberData) => {
		return apiRequest(
			"PATCH",
			`${teamAPI}/teams/${teamId}/add-member`,
			memberData
		);
	},

	removeMemberFromTeam: async (teamId, memberId) => {
		return apiRequest("PATCH", `${teamAPI}/teams/${teamId}/remove-member`, {
			memberId,
		});
	},

	getMembers: async (teamId) => {
		return apiRequest("GET", `${teamAPI}/teams/${teamId}/get-members`);
	},
};

export default teamService;
