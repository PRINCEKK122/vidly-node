const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");

const router = express.Router();

const genreSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 20,
    lowercase: true,
    validate: {
      validator: function (v) {
        return new Promise(async (resolve, reject) => {
          const genreInDB = await Genre.findOne({ type: v });

          if (!genreInDB) {
            resolve(v);
          } else {
            reject("Duplicate genre, it already exists in the database.");
          }
        });
      },
    },
  },
});

const Genre = mongoose.model("Genre", genreSchema);

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
  const { error, value } = validateGenre(req.body);

  if (error) {
    return res.send(error.details[0].message);
  }

  try {
    const newGenre = new Genre({ type: value.type });
    const genre = await newGenre.save();

    res.status(201).send(genre);
  } catch (ex) {
    res.status(400).send(ex.errors.type.reason);
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
  const { error, value } = validateGenre(req.body);
  
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

function validateGenre(genre) {
  const schema = Joi.object({
    type: Joi.string().min(3).max(20).required(),
  });

  return schema.validate(genre);
}

module.exports = router;
