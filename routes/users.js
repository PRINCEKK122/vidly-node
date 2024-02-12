const express = require("express");
const bcrypt = require('bcrypt');
const _ = require("lodash");
const router = express.Router();

const { User, validate } = require("../models/users");

router.post("/", async (req, res, next) => {
  const { error, value } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { email } = value;
  let user = await User.findOne({ email });

  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  res.send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
