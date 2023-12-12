const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
	type: "string",
	base: joi.string(),
	messages: {
		"string.escapeHTML": "{{#label}} must not include HTML!",
	},
	rules: {
		escapeHTML: {
			validate(value, helpers) {
				const clean = sanitizeHtml(value, {
					allowedTags: [],
					allowedAttributes: {},
				});
				if (clean !== value)
					return helpers.error("string.escapeHTML", { value });
				return clean;
			},
		},
	},
});

const Joi = BaseJoi.extend(extension);

// Validation schema for user registration
const registerValidation = Joi.object({
	firstName: Joi.string().min(2).required(),
	lastName: Joi.string().min(2).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
	profilePic: Joi.string(),
});

// Validation schema for user login
const loginValidation = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
});

// Validation schema for profile updating
const updateValidation = Joi.object({
	firstName: Joi.string().min(2),
	lastName: Joi.string().min(2),
	email: Joi.string().email(),
	profilePic: Joi.string(),
});

module.exports = {
	registerValidation,
	loginValidation,
	updateValidation,
};
