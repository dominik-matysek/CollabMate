const Joi = require("joi");

const createEventValidation = Joi.object({
	title: Joi.string().min(3).required(),
	description: Joi.string().min(5),
	date: Joi.date().required(),
	timeStart: Joi.date().required(),
	timeEnd: Joi.date().required(),
	createdBy: Joi.string().required(),
	participants: Joi.array().items(Joi.string()),
});

const editEventValidation = Joi.object({
	title: Joi.string().min(3).required(),
	description: Joi.string().min(5),
	date: Joi.date().required(),
	timeStart: Joi.date().required(),
	timeEnd: Joi.date().required(),
	createdBy: Joi.string().required(),
	participants: Joi.array().items(Joi.string()),
});

module.exports = {
	createEventValidation,
	editEventValidation,
};
