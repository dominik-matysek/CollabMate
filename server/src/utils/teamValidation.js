const Joi = require("./joiExtensions");

const teamCreateValidation = Joi.object({
	name: Joi.string().min(2).required().messages({
		"string.base": "Team name should be a string.",
		"string.empty": "Team name cannot be empty.",
		"string.min": "Team name should have a minimum length of {#limit}.",
		"any.required": "Team name is required.",
	}),
	teamLeadIds: Joi.array()
		.items(
			Joi.string().required().messages({
				"string.base": "Each team leader ID should be a valid identifier.",
			})
		)
		.min(1)
		.required()
		.messages({
			"array.base": "Team leader IDs should be an array.",
			"array.min": "At least one team leader is required.",
			"any.required": "Team leader IDs are required.",
		}),
});

module.exports = teamCreateValidation;
