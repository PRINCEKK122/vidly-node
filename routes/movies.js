const express = require("express");

const { Movie, validateMovie } = require("../models/movies");
const { Genre } = require("../models/genre");

const router = express.Router();

router.get("/", async (req, res, next) => {
  res.send(await Movie.find().sort("title").select('title'));
});

router.get("/:id", async (req, res, next) => {
  const movieId = req.params.id;
  const movie = await Movie.findById(movieId);

  if (!movie) return res.status(404).send('Movie does not exists!');

  res.send(movie);
});

router.post("/", async (req, res, next) => {
  const { error, value } = validateMovie(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { title, genreId, dailyRentalRate, numberInStock } = value;
  
  const genre = await Genre.findById(genreId);
  if (!genre) return res.status(400).send('Invalid genre');
  
  const { _id, type } = genre;

  const newMovie = new Movie({
    title,
    genre: {
      _id,
      type
    },
    dailyRentalRate,
    numberInStock,
  });

  try {
    const result = await newMovie.save();
    res.status(201).send(newMovie);
    console.log(result);
  } catch (ex) {
    console.log(ex);
    res.status(400).send("Bad Request, try again later!");
  }
});

router.put('/:id', async (req, res, next) => {
  const { error, value } = validateMovie(req.body);

  console.log(error);
  if (error) return res.status(400).send(error.details[0].message);

  const movieId = req.params.id;
  let movie = await Movie.findById(movieId);
  
  if (!movie) return res.status(404).send(`Movie with ID: ${movieId} does not exists!`);
  
  const { title, numberInStock, dailyRentalRate, genreId } = value;
  const genre = await Genre.findById(genreId);
  if (!genre) return res.status(404).send('Invalid genre id!');

  movie.title = title || movie.title;
  movie.numberInStock = numberInStock || movie.numberInStock;
  movie.dailyRentalRate = dailyRentalRate || movie.dailyRentalRate;
  movie.genre = genre || movie.genre;
  movie = await movie.save();

  res.send(movie);
});

router.delete('/:id', async (req, res, next) => {
  let movie = await Movie.findById(req.params.id);

  if (!movie) return res.status(404).send(`Movie with ID ${req.params.id} does not exist!`);

  movie = await movie.deleteOne();
  res.status(204);
});

module.exports = router;
