const Joi = require("joi");

const createTaskValidation = Joi.object({
	name: Joi.string().min(2).required(),
	description: Joi.string().min(5).required(),
	dueDate: Joi.date().iso().required(),
});

const editTaskValidation = Joi.object({
	name: Joi.string().min(2).required(),
	description: Joi.string().min(5).required(),
	dueDate: Joi.date().iso().required(),
});

module.exports = {
	createTaskValidation,
	editTaskValidation,
};
