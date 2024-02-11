const mongoose = require('mongoose');
const Joi = require('joi');

const { genreSchema } = require('./genre');
const movieSchema = mongoose.Schema({
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
    min: 0,
    max: 255
  },
  dailyRentalRate: {
    type: Number,
    default: 0,
    min: 0.00,
    max: 255
  },
  genre: {
    type: genreSchema,
    required: true
  }
});

exports.movieSchema = movieSchema;
exports.Movie = mongoose.model('Movie', movieSchema);
exports.validateMovie = (movie) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).trim().required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().positive().min(0).integer(),
    dailyRentalRate: Joi.number().positive().precision(2).min(0.00)
  });

  return schema.validate(movie);
};
