const mongoose = require("mongoose");
const Joi = require("joi");

exports.Rental = mongoose.model(
  "Rental",
  mongoose.Schema({
    dateRented: {
      type: Date,
      required: true,
      default: Date.now,
    },
    customerSchema: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    movieSchema: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
  })
);

exports.validate = (rentals) => {
  const schema = Joi.object({
    customerId: Joi.string().required(),
    movieId: Joi.string().required(),
  });

  return schema.validate(rentals);
};
