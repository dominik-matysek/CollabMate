const Joi = require("./joiExtensions");

const projectCreateValidation = Joi.object({
	name: Joi.string()
		.min(2)
		.messages({
			"string.base": "Project name should be a string.",
			"string.empty": "Project name cannot be empty.",
			"string.min": "Project name should have a minimum length of {#limit}.",
			"any.required": "Project name is required.",
		})
		.required(),

	description: Joi.string()
		.min(5)
		.max(50)
		.messages({
			"string.base": "Description should be a string.",
			"string.empty": "Description cannot be empty.",
			"string.min": "Description should have a minimum length of {#limit}.",
			"string.max": "Description should have a maximum length of {#limit}.",
			"any.required": "Description is required.",
		})
		.required(),
	memberIds: Joi.array()
		.items(
			Joi.string().required().messages({
				"string.base": "Each team member ID should be a valid identifier.",
			})
		)
		.min(1)
		.required()
		.messages({
			"array.base": "Team member IDs should be an array.",
			"array.min": "At least one team member is required.",
			"any.required": "Team member IDs are required.",
		}),
});

module.exports = projectCreateValidation;
