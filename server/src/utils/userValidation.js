const Joi = require("./joiExtensions");

// Validation schema for user registration
const registerValidation = Joi.object({
  firstName: Joi.string().min(2).required().messages({
    "string.base": "First name should be a string.",
    "string.empty": "First name cannot be empty.",
    "string.min": "First name should have a minimum length of {#limit}.",
    "any.required": "First name is required.",
  }),
  lastName: Joi.string().min(2).required().messages({
    "string.base": "Last name should be a string.",
    "string.empty": "Last name cannot be empty.",
    "string.min": "Last name should have a minimum length of {#limit}.",
    "any.required": "Last name is required.",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email should be a string.",
    "string.empty": "Email cannot be empty.",
    "string.email": "Invalid email format.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "Password should be a string.",
    "string.empty": "Password cannot be empty.",
    "string.min": "Password should have a minimum length of {#limit}.",
    "any.required": "Password is required.",
  }),
  profilePic: Joi.string(),
});

// Validation schema for user login
const loginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Email should be a string.",
    "string.empty": "Email cannot be empty.",
    "string.email": "Invalid email format.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "Password should be a string.",
    "string.empty": "Password cannot be empty.",
    "string.min": "Password should have a minimum length of {#limit}.",
    "any.required": "Password is required.",
  }),
});

// Validation schema for profile updating
const updateValidation = Joi.object({
  firstName: Joi.string().min(2).required().messages({
    "string.base": "First name should be a string.",
    "string.empty": "First name cannot be empty.",
    "string.min": "First name should have a minimum length of {#limit}.",
    "any.required": "First name is required.",
  }),
  lastName: Joi.string().min(2).required().messages({
    "string.base": "Last name should be a string.",
    "string.empty": "Last name cannot be empty.",
    "string.min": "Last name should have a minimum length of {#limit}.",
    "any.required": "Last name is required.",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email should be a string.",
    "string.empty": "Email cannot be empty.",
    "string.email": "Invalid email format.",
    "any.required": "Email is required.",
  }),
  profilePic: Joi.string(),
});

module.exports = {
  registerValidation,
  loginValidation,
  updateValidation,
};
