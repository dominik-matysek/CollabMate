const Joi = require("./joiExtensions");

const teamValidation = Joi.object({
  name: Joi.string().min(2).required().messages({
    "string.base": "Team name should be a string.",
    "string.empty": "Team name cannot be empty.",
    "string.min": "Team name should have a minimum length of {#limit}.",
    "any.required": "Team name is required.",
  }),
  teamLeadId: Joi.string().required().messages({
    "string.base": "Team leader ID should be a valid identifier.",
    "any.required": "Team leader is required.",
  }),
  memberIds: Joi.array().items(Joi.string()).messages({
    "array.base": "Members should be an array of user identifiers.",
  }),
});

module.exports = teamValidation;
