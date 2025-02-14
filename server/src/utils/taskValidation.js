const Joi = require("./joiExtensions");
const dateExtensions = require("@joi/date");
const JoiExtendend = Joi.extend(dateExtensions);

const taskCreateValidation = JoiExtendend.object({
	name: JoiExtendend.string()
		.min(2)
		.messages({
			"string.base": "Task name should be a string.",
			"string.empty": "Task name cannot be empty.",
			"string.min": "Task name should have a minimum length of {#limit}.",
			"any.required": "Task name is required.",
		})
		.required(),

	description: JoiExtendend.string()
		.min(5)
		.max(250)
		.messages({
			"string.base": "Description should be a string.",
			"string.empty": "Description cannot be empty.",
			"string.min": "Description should have a minimum length of {#limit}.",
			"string.max": "Description should have a maximum length of {#limit}.",
			"any.required": "Description is required.",
		})
		.required(),

	dueDate: JoiExtendend.date()
		.iso()
		.greater("now")
		.messages({
			"date.base": "Due date should be a valid date format.",
			"date.iso": "Due date should be in ISO format.",
			"date.greater": "Due date must be a future date.",
			"any.required": "Due date is required.",
		})
		.required(),
	memberIds: JoiExtendend.array()
		.items(
			JoiExtendend.string().required().messages({
				"string.base": "Each task member ID should be a valid identifier.",
			})
		)
		.messages({
			"array.base": "Task member IDs should be an array.",
			"array.min": "At least one task member is required.",
			"any.required": "Task member IDs are required.",
		}),
	priority: JoiExtendend.string()
		.valid("low", "medium", "high")
		.required()
		.messages({
			"string.base": "Priority should be a string.",
			"any.required": "Priority is required.",
			"any.only": "Priority must be one of ['low', 'medium', 'high'].",
		}),
});

module.exports = taskCreateValidation;
