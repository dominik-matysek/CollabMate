const Joi = require("joi");

const createProjectValidation = Joi.object({
	name: Joi.string().min(2).required(),
	description: Joi.string().min(5).required(),
});

const editProjectValidation = Joi.object({
	name: Joi.string().min(2).required(),
	description: Joi.string().min(5).required(),
});

module.exports = {
	createProjectValidation,
	editProjectValidation,
};
