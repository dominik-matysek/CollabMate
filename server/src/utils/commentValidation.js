const Joi = require("./joiExtensions");

const commentValidation = Joi.object({
  content: Joi.string()
    .min(5)
    .messages({
      "string.base": "Content should be a string.",
      "string.empty": "Content cannot be empty.",
      "string.min": "Content should have a minimum length of {#limit}.",
      "any.required": "Content is required.",
    })
    .required(),
});

module.exports = commentValidation;
