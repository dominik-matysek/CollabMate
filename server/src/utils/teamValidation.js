const Joi = require("joi");

const createTeamValidation = Joi.object({
	name: Joi.string().min(2).required(),
});

const editTeamValidation = Joi.object({
	name: Joi.string().min(2).required(),
});

module.exports = {
	createTeamValidation,
	editTeamValidation,
};
