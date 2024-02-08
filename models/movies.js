const mongoose = require('mongoose');
const Joi = require('joi');

const { genreSchema } = require('./genre');

exports.Movie = mongoose.model('Movie', mongoose.Schema({
  title: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    minlength: 5,
    maxlength: 50
  },
  numberInStock: {
    type: Number,
    default: 0,
    min: 0
  },
  dailyRentalRate: {
    type: Number,
    default: 0,
    min: 0.00
  },
  genre: {
    type: genreSchema,
    required: true
  }
}));

exports.validateMovie = (movie) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).trim().required(),
    numberInStock: Joi.number().positive().min(0),
    dailyRentalRate: Joi.number().positive().precision(2)
  });

  return schema.validate(movie);
};