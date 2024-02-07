const express = require("express");
const router = express.Router();
const { Customer, validate } = require('../models/customer');

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
  const { error, value } = validate(req.body);

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
  const { error, value } = validate(req.body);
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

module.exports = router;
