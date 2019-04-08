const Validator = require("validator");
const isEmpty = require("../validation/is-empty");

//Validator docs https://www.npmjs.com/package/validator

module.exports = function validateRegisterInput(data) {
  let errors = {};
  let { name, email, password, password2 } = data;

  name = !isEmpty(name) ? name : "";
  email = !isEmpty(email) ? email : "";
  password = !isEmpty(password) ? password : "";
  password2 = !isEmpty(password2) ? password2 : "";

  //Check input string length
  if (!Validator.isLength(name, { min: 2, max: 40 })) {
    errors.name = "Name must be between 2 and 30 characters";
  }

  //Validator have method with the same name as our function
  if (Validator.isEmpty(name)) {
    errors.name = "Name field is required";
  }

  //Validator have method with the same name as our function
  if (!Validator.isEmail(email)) {
    errors.email = "email field is required";
  }

  //Validator have method with the same name as our function
  if (Validator.isEmpty(password)) {
    errors.password = "password field is required";
  }

  if (!Validator.isLength(password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }

  if (Validator.isEmpty(password2)) {
    errors.password2 = "Passwords confirm is required";
  }

  if (!Validator.equals(password, password2)) {
    errors.password2 = "Passwords must match";
  }

  //Return object with results of validation
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
