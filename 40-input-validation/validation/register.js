const Validator = require("validator");
const isEmpty = require("../validation/is-empty");

module.exports = function validateInput(data) {
  let errors = {};
  //Check input string length
  if (!Validator.isLength(data.name, { min: 2, max: 40 })) {
    errors.name = "Name must be between 2 and 30 characters";
  }
  //Return object with results of validation
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
