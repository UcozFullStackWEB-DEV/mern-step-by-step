const Validator = require("validator");
const isEmpty = require("../validation/is-empty");

//Validator docs https://www.npmjs.com/package/validator

module.exports = function validatePostInputs(data) {
  let errors = {};
  let { text } = data;

  text = isEmpty(text) ? "" : text;

  if (Validator.isEmpty(text)) {
    errors.text = "text field is required";
  }

  if (!Validator.isLength(text, { min: 2, max: 300 })) {
    errors.length = "Post must be beetween 2 and 300 characters";
  }
  //Return object with results of validation
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
