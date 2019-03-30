const Validator = require("validator");
const isEmpty = require("../validation/is-empty");

//Validator docs https://www.npmjs.com/package/validator

module.exports = function validateEducationInputs(data) {
  let errors = {};
  let { school, degree, fieldofstudy, from } = data;

  school = !isEmpty(school) ? school : "";
  degree = !isEmpty(degree) ? degree : "";
  fieldofstudy = !isEmpty(fieldofstudy) ? fieldofstudy : "";
  from = !isEmpty(from) ? from : "";

  if (Validator.isEmpty(school)) {
    errors.school = "School field is required";
  }

  if (Validator.isEmpty(degree)) {
    errors.degree = "Degree field is required";
  }

  if (Validator.isEmpty(fieldofstudy)) {
    errors.fieldofstudy = "Field of study field is required";
  }

  if (Validator.isEmpty(from)) {
    errors.from = "From field is required";
  }

  //Return object with results of validation
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
