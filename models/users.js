const mongoose = require("mongoose");
const Joi = require("joi");

module.exports.User = mongoose.model(
  "User",
  mongoose.Schema({
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      minlength: 5,
      maxlength: 55,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      minlength: 5,
      maxlength: 255,
    },
    password: {
      type: String,
      minlength: 8,
      maxlength: 1024,
    },
  })
);

module.exports.User = User;
module.exports.validate = function (user) {
  const schema = Joi.object({
    name: Joi.string().required().min(5).max(55),
    email: Joi.string().trim().lowercase().min(5).max(255).email().required(),
    password: Joi.string().min(8).max(255).required(),
  });

  return schema.validate(user);
};
