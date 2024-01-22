// Proste metody wykorzystywane w projekcie

import moment from "moment";

export const getAntdFormInputRules = [
	{
		required: true,
		message: "Pole wymagane",
	},
];

export const getDateFormat = (date) => {
	return moment(date).format("Do MMMM YYYY, h:mm A");
};

export const getSimpleDateFormat = (date) => {
	return moment(date).format("Do MMMM YYYY");
};
