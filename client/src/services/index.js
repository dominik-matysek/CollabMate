import axios from "axios";

export const apiRequest = async (method, url, payload) => {
	try {
		const response = await axios({
			method,
			url,
			data: payload,
			headers: {
				authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		});
		console.log("Request url:", response.method);
		console.log("Request payload:", payload);
		return response.data;
	} catch (error) {
		if (error.response) {
			// The request was made, and the server responded with a status code
			// that falls out of the range of 2xx
			console.error("Response error:", error.response.data);
			return error.response.data;
		} else if (error.request) {
			// The request was made, but no response was received
			console.error("No response received:", error.request);
			return { error: "No response received" };
		} else {
			// Something happened in setting up the request that triggered an Error
			console.error("Error setting up the request:", error.message);
			return { error: "Error setting up the request" };
		}
	}
};
