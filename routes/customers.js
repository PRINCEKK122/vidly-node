const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");

const router = express.Router();

// creating the schema
const customerSchema = mongoose.Schema({
  isGold: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    lowercase: true,
    minlength: 3,
    maxlength: 20,
    required: true,
  },
  phone: {
    type: String,
    minlength: 10,
    maxlength: 10,
    default: '1'.repeat(10),
  },
});

// creating the model
const Customer = mongoose.model("Customer", customerSchema);

router.get("/", async (req, res) => {
  res.send(await Customer.find().sort('-name'));
});

router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      res.status(404).send(`The customer with ID ${req.params.id} was not found!`);
    } else {
      res.send(customer);
    } 
  } catch (ex) {
    res.status(500).send('Something went wrong!');
  }
});

router.post("/", async (req, res) => {
  const { error, value } = validateCustomer(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
  }

  const { name, phone, isGold } = value;
  const customer = new Customer({
    name,
    phone,
    isGold,
  });

  try {
    const newCustomer = await customer.save();
    res.status(201).send(customer);
  } catch (ex) {
    res.status(400).send(ex.errors.type.reason);
  }
});

router.put('/:id', async (req, res) => {
  const { error, value } = validateCustomer(req.body);
  const { isGold, name, phone } = value;

  if (error) {
    res.status(400).send(error.details[0].message);
  }

  const updateCustomer = await Customer.findByIdAndUpdate(req.params.id, {
    isGold,
    name,
    phone
  }, { new: true });

  if (!updateCustomer) {
    return res.status(404).send(`The customer with ID ${req.params.id} does not exists`);
  } else {
    res.send(updateCustomer);
  }
});

router.delete('/:id', async (req, res) => {
  console.log(req.params.id);
  const customer = await Customer.findByIdAndDelete(req.params.id);

  if (!customer) {
    return res.status(404).send('Customer does not exists');
  }

  res.status(204);
});

function validateCustomer(customer) {
  const schema = Joi.object({
    isGold: Joi.boolean(),
    name: Joi.string().min(3).max(20).required(),
    phone: Joi.string().length(10),
  });

  return schema.validate(customer);
}

module.exports = router;
