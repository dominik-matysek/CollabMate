import axios from "axios";

export const apiRequest = async (method, url, payload) => {
	try {
		const response = await axios({
			method,
			url,
			data: payload,
			withCredentials: true,
		});

		return response.data;
	} catch (error) {
		if (error.response) {
			console.error("Response error:", error.response.data);
			return error.response.data;
		} else if (error.request) {
			// Request pozostał bez odpowiedzi
			console.error("Brak odpowiedzi:", error.request);
			return { error: "Brak odpowiedzi" };
		} else {
			// Błąd podczas tworzenia requestu
			console.error("Error setting up the request:", error.message);
			return { error: "Błąd podczas tworzenia zapytania" };
		}
	}
};
