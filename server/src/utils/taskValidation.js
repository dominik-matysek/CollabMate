const Joi = require("./joiExtensions");

const taskValidation = Joi.object({
  name: Joi.string()
    .min(2)
    .messages({
      "string.base": "Task name should be a string.",
      "string.empty": "Task name cannot be empty.",
      "string.min": "Task name should have a minimum length of {#limit}.",
      "any.required": "Task name is required.",
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

  dueDate: Joi.date()
    .iso()
    .messages({
      "date.base": "Due date should be a valid date format.",
      "date.iso": "Due date should be in ISO format.",
      "any.required": "Due date is required.",
    })
    .required(),
});

module.exports = taskValidation;
