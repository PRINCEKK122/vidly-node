const express = require("express");

const { Genre, validate } = require('../models/genre');
const router = express.Router();

// Get All Genres
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("type").select("type");

  if (genres.length === 0) {
    return res.send("No genres in db!");
  }

  res.send(genres);
});

// Get a single Genre
router.get("/:id", async (req, res) => {
  const genre = await Genre.findOne({ _id: req.params.id });

  if (!genre) {
    return res
      .status(404)
      .send(`The genres with ID ${req.params.id} does not exists`);
  }

  res.send(genre);
});

// Creating a genre
router.post("/", async (req, res) => {
  const { error, value } = validate(req.body);

  if (error) {
    return res.send(error.details[0].message);
  }

  try {
    const newGenre = new Genre({ type: value.type });
    const genre = await newGenre.save();

    res.status(201).send(genre);
  } catch (ex) {
    if (ex.name === 'MongoServerError' && ex.code === 11000) {
      res.status(400).send('Genre must be unique!');
    }
  }
});

// Updating the genre
router.put("/:id", async (req, res) => {
  // Update First right in the DB
  /*   const genre = await Genre.updateOne(
    {
      _id: new mongoose.Types.ObjectId(req.params.id),
    },
    {
      $set: {
        type: req.body.type,
      },
    },
    {
      new: true,
    }
  );*/
  const { error, value } = validate(req.body);
  
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  
  // Query First
  const genre = await Genre.findByIdAndUpdate(
    (id = req.params.id),
    { type: value.type },
    { new: true }
  );

  if (!genre) {
    res.status(404).send(`The genre with the given ID ${req.params.id} does not exists!`);
  } else {
    res.send(genre);
  }
});

// Deleting a genre
router.delete("/:id", async (req, res) => {
  // Delete directly from the DB
  /* const genre = await Genre.deleteOne({ _id: req.params.id }); */

  // Query First
  const genre = await Genre.findByIdAndDelete(req.params.id);

  if (genre) {
    res.status(204).send(genre);
  } else {
    res.status(404).send(`The genre with ID ${req.params.id} does not exists`);
  }
  console.log(genre);
});

module.exports = router;
