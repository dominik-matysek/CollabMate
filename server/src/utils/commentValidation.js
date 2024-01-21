const Joi = require("./joiExtensions");

const commentValidation = Joi.object({
	content: Joi.string()
		.messages({
			"string.base": "Content should be a string.",
			"string.empty": "Content cannot be empty.",
			"any.required": "Content is required.",
		})
		.required(),
});

module.exports = commentValidation;
