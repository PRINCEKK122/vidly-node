const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');

const { User } = require('../models/users');

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { error, value } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { email, password } = value;
  let user = await User.findOne({ email });

  if (!user) return res.status(400).send('Invalid email or password');

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password');

  res.send(true);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  });

  return schema.validate(req);
}

module.exports = router;
