const mongoose = require('mongoose');
const Joi = require('joi');

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

function validateGenre(genre) {
  const schema = Joi.object({
    type: Joi.string().min(3).max(20).required(),
  });

  return schema.validate(genre);
}

exports.Genre = Genre;
exports.validate = validateGenre;