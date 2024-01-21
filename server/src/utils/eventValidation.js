const Joi = require("./joiExtensions");
const dateExtensions = require("@joi/date");
const JoiExtendend = Joi.extend(dateExtensions);

const createEventValidation = Joi.object({
	title: Joi.string()
		.min(3)
		.messages({
			"string.base": "Title should be a string.",
			"string.empty": "Title cannot be empty.",
			"string.min": "Title should have a minimum length of {#limit}.",
			"any.required": "Title is required.",
		})
		.required(),

	description: Joi.string().min(5).messages({
		"string.base": "Description should be a string.",
		"string.empty": "Description cannot be empty.",
		"string.min": "Description should have a minimum length of {#limit}.",
	}),

	date: JoiExtendend.date()
		.iso()
		.greater("now")
		.messages({
			"date.base": "Due date should be a valid date format.",
			"date.iso": "Due date should be in ISO format.",
			"date.greater": "Due date must be a future date.",
			"any.required": "Due date is required.",
		})
		.required(),
});

const editEventValidation = Joi.object({
	title: Joi.string()
		.min(3)
		.messages({
			"string.base": "Title should be a string.",
			"string.empty": "Title cannot be empty.",
			"string.min": "Title should have a minimum length of {#limit}.",
			"any.required": "Title is required.",
		})
		.required(),

	description: Joi.string().min(5).messages({
		"string.base": "Description should be a string.",
		"string.empty": "Description cannot be empty.",
		"string.min": "Description should have a minimum length of {#limit}.",
	}),
});

module.exports = { createEventValidation, editEventValidation };
