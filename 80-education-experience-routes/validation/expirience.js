const Validator = require("validator");
const isEmpty = require("../validation/is-empty");

//Validator docs https://www.npmjs.com/package/validator

module.exports = function validateExperienceInputs(data) {
  let errors = {};
  let { title, company, from } = data;

  title = !isEmpty(title) ? title : "";
  company = !isEmpty(company) ? company : "";
  from = !isEmpty(from) ? from : "";

  if (Validator.isEmpty(title)) {
    errors.title = "Job title field is required";
  }

  if (Validator.isEmpty(from)) {
    errors.from = "From field is required";
  }

  if (Validator.isEmpty(company)) {
    errors.company = "Company field is required";
  }

  //Return object with results of validation
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
