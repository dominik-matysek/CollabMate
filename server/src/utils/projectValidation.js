const Joi = require("./joiExtensions");

const projectValidation = Joi.object({
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
    .messages({
      "string.base": "Description should be a string.",
      "string.empty": "Description cannot be empty.",
      "string.min": "Description should have a minimum length of {#limit}.",
      "any.required": "Description is required.",
    })
    .required(),
});

module.exports = projectValidation;
