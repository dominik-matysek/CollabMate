const {apiRequest} = require(".");

const logAPI = "/api/logs";

const logService = {
    getAllLogs: async () => {
        return apiRequest("GET", `${logAPI}/logs`);
    },
}
export default logService;