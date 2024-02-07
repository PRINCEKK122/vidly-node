const express = require("express");
const genres = require('./routes/genres');
const mongoose = require('mongoose');
const app = express();


mongoose.connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error('Could not connect to MongoDB...', err));

app.use(express.json());
app.use('/api/genres', genres);

app.get("/", (req, res) => {
  res.send("Genres under construction");
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));
