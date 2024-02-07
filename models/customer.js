const mongoose = require('mongoose');
const Joi = require('joi');

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

function validateCustomer(customer) {
  const schema = Joi.object({
    isGold: Joi.boolean(),
    name: Joi.string().min(3).max(20).required(),
    phone: Joi.string().length(10),
  });

  return schema.validate(customer);
}

// creating the model
const Customer = mongoose.model("Customer", customerSchema);

exports.Customer = Customer;
exports.validate = validateCustomer;