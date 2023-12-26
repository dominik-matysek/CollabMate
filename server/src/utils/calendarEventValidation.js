const Joi = require("./joiExtensions");

const eventValidation = Joi.object({
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

  date: Joi.date().required().messages({
    "date.base": "Date should be a valid date format.",
    "any.required": "Date is required.",
  }),

  timeStart: Joi.date().required().messages({
    "date.base": "Start time should be a valid date format.",
    "any.required": "Start time is required.",
  }),

  timeEnd: Joi.date().required().messages({
    "date.base": "End time should be a valid date format.",
    "any.required": "End time is required.",
  }),

  createdBy: Joi.string().required().messages({
    "string.base": "Created by should be a string.",
    "string.empty": "Created by cannot be empty.",
    "any.required": "Created by is required.",
  }),

  participants: Joi.array().items(Joi.string()).messages({
    "array.base": "Participants should be an array of strings.",
    "array.items": "Each participant should be a string.",
  }),
});

module.exports = eventValidation;
