const express = require("express");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movies");
const { Rental, validate } = require("../models/rentals");

const router = express.Router();

router.get("/", async (req, res, next) => {
  res.send(await Rental.find().sort("dateRented"));
});

router.post("/", async (req, res, next) => {
  const { error, value } = validate(req.body);

  if (error) {
    console.log(error);
    return res.status(400).send(error.details[0].message);
  }

  // Get the customer
  const { customerId, movieId } = value;
  console.log(customerId, movieId);
  const customer = await Customer.findById(customerId);
  const movie = await Movie.findById(movieId);
  console.log(movie);

  if (!customer || !movie)
    return res.status(400).send("Provide either a valid customerId or movieId!");
  
  const newRental = new Rental({
    customerSchema: customer._id,
    movieSchema: movie._id
  });

  try {
    const rental = await newRental.save();
    res.status(201).send(rental);
  } catch (ex) {
    res.status(500).send('Something bad happened!');
  }
  console.log('Connecting');
});

module.exports = router;
