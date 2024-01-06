const { apiRequest } = require(".");

const teamAPI = "/api/teams";

const teamService = {
  createTeam: async (teamData) => {
    return apiRequest("POST", `${teamAPI}/`, teamData);
  },

  getAllTeams: async () => {
    return apiRequest("GET", `${teamAPI}/`);
  },

  getTeamById: async (teamId) => {
    return apiRequest("GET", `${teamAPI}/team/${teamId}`);
  },

  editTeam: async (teamId, updatedData) => {
    return apiRequest("POST", `${teamAPI}/${teamId}/edit`, updatedData);
  },

  deleteTeam: async (teamId) => {
    return apiRequest("DELETE", `${teamAPI}/${teamId}`);
  },

  addMemberToTeam: async (teamId, memberData) => {
    return apiRequest("POST", `${teamAPI}/${teamId}/add-member`, memberData);
  },

  removeMemberFromTeam: async (teamId, memberId) => {
    return apiRequest("POST", `${teamAPI}/${teamId}/remove-member`, {
      memberId,
    });
  },

  getMembers: async (teamId) => {
    return apiRequest("GET", `${teamAPI}/${teamId}/get-members`);
  },

  getAllProjects: async (teamId) => {
    return apiRequest("GET", `${teamAPI}/${teamId}/get-projects`);
  },
};

export default teamService;
