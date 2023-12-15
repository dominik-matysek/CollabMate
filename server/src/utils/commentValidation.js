const Joi = require("joi");

const createCommentValidation = Joi.object({
	content: Joi.string().min(5).required(),
});

const editCommentValidation = Joi.object({
	content: Joi.string().min(5).required(),
});

module.exports = {
	createCommentValidation,
	editCommentValidation,
};
