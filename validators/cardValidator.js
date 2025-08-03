import Joi from 'joi';

const imageSchema = Joi.object({
  url: Joi.string().uri().min(14).required(),
  alt: Joi.string().min(2).max(256).required(),
}).required();

const addressSchema = Joi.object({
  state: Joi.string().min(2).max(256).required(),
  country: Joi.string().min(2).max(256).required(),
  city: Joi.string().min(2).max(256).required(),
  street: Joi.string().min(2).max(256).required(),
  houseNumber: Joi.number().min(1).required(),
  zip: Joi.number().required(),
}).required();

export const cardSchema = Joi.object({
  title: Joi.string().min(2).max(256).required(),
  subtitle: Joi.string().min(2).max(256).required(),
  description: Joi.string().min(2).max(1024).required(),
  phone: Joi.string().pattern(/^[0-9]{9,11}$/).required()
    .messages({ 'string.pattern.base': 'Phone must have 9–11 digits' }),
  email: Joi.string().email().min(5).required(),
  web: Joi.string().uri().optional(),
  image: imageSchema,
  address: addressSchema,
});

export const bizNumberSchema = Joi.object({
  bizNumber: Joi.number().integer().min(100000).max(999999).required()
});

export const validateCard = (req, res, next) => {
  const { error } = cardSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

export const validateBizNumber = (req, res, next) => {
  const { error } = bizNumberSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};
