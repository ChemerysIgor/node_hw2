const { Schema, model } = require("mongoose");

const Joi = require("joi");

const { handleMongooseError } = require("../helpers/index");
const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleMongooseError);

const addSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .required(),
  phone: Joi.string().required(),
  favourite: Joi.boolean(),
});

const updateSchema = Joi.object({
  id: Joi.string(),
  name: Joi.string(),
  email: Joi.string().email({
    minDomainSegments: 2,
  }),
  phone: Joi.string(),
});

const updateFavoureteSchema = Joi.object({
  favourite: Joi.boolean().required(),
});

const schemas = { addSchema, updateSchema, updateFavoureteSchema };
const Contact = model("contact", contactSchema);

module.exports = { Contact, schemas };
