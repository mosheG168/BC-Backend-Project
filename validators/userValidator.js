import Joi from 'joi';

// Regex for password: min 9 chars, uppercase, lowercase, digit, special char
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*-]).{9,}$/;

// Regex for Israeli phone number (e.g., 05XXXXXXXX)
const israeliPhonePattern = /^05\d{8}$/;

// Nested schema for name
const nameSchema = Joi.object({
  first: Joi.string().min(2).max(256).required(),
  middle: Joi.string().allow('').max(256),
  last: Joi.string().min(2).max(256).required(),
}).required();

// Image schema (optional)
const imageSchema = Joi.object({
  url: Joi.string().uri().allow(''),
  alt: Joi.string().allow(''),
}).optional();

// Address schema
const addressSchema = Joi.object({
  state: Joi.string().min(2).max(256).required(),
  country: Joi.string().min(2).max(256).required(),
  city: Joi.string().min(2).max(256).required(),
  street: Joi.string().min(2).max(256).required(),
  houseNumber: Joi.number().min(1).max(9999).required(),
  zip: Joi.number().required(),
}).required();

// Register schema
export const registerSchema = Joi.object({
  name: nameSchema,
  phone: Joi.string().pattern(israeliPhonePattern).required()
    .messages({ 'string.pattern.base': 'Phone must be a valid Israeli number (e.g., 05XXXXXXXX)' }),
  email: Joi.string().email().min(5).required(),
  password: Joi.string().pattern(passwordPattern).required()
    .messages({ 'string.pattern.base': 'Password must be at least 9 chars, include uppercase, lowercase, number, and a special character (!@#$%^&*-)' }),
  image: imageSchema,
  address: addressSchema,
  isBusiness: Joi.boolean().required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const validateUser = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};
