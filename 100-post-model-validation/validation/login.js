const Validator = require("validator");
const isEmpty = require("../validation/is-empty");

//Validator docs https://www.npmjs.com/package/validator

module.exports = function validateLoginInputs(data) {
  let errors = {};
  let { email, password } = data;

  email = !isEmpty(email) ? email : "";
  password = !isEmpty(password) ? password : "";

  if (Validator.isEmpty(email)) {
    errors.name = "email field is required";
  }

  if (!Validator.isEmail(email)) {
    errors.email = "email is invalid";
  }

  //Validator have method with the same name as our function
  if (Validator.isEmpty(password)) {
    errors.password = "password field is required";
  }

  if (!Validator.isLength(password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }

  //Return object with results of validation
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
