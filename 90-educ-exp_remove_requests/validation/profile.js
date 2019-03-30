const Validator = require("validator");
const isEmpty = require("../validation/is-empty");

//Validator docs https://www.npmjs.com/package/validator

module.exports = function validateProfileInputs(data) {
  let errors = {};
  let {
    handle,
    status,
    skills,
    website,
    youtube,
    twitter,
    facebook,
    linkedin,
    instagram
  } = data;

  handle = !isEmpty(handle) ? handle : "";
  status = !isEmpty(status) ? status : "";
  skills = !isEmpty(skills) ? skills : "";

  if (!Validator.isLength(handle, { min: 2, max: 40 })) {
    errors.handle = "Handle must be beetween 2 and 40 characters";
  }

  if (Validator.isEmpty(handle)) {
    errors.handle = "Profile handle is required";
  }

  if (Validator.isEmpty(status)) {
    errors.status = "Status field is required";
  }

  if (Validator.isEmpty(skills)) {
    errors.skills = "Skills is required";
  }

  if (!isEmpty(website)) {
    if (!Validator.isURL(website)) {
      errors.website = "Not a valid URL";
    }
  }

  if (!isEmpty(youtube)) {
    if (!Validator.isURL(youtube)) {
      errors.youtube = "Not a valid URL";
    }
  }

  if (!isEmpty(twitter)) {
    if (!Validator.isURL(twitter)) {
      errors.twitter = "Not a valid URL";
    }
  }

  if (!isEmpty(facebook)) {
    if (!Validator.isURL(facebook)) {
      errors.facebook = "Not a valid URL";
    }
  }

  if (!isEmpty(linkedin)) {
    if (!Validator.isURL(linkedin)) {
      errors.linkedin = "Not a valid URL";
    }
  }

  if (!isEmpty(instagram)) {
    if (!Validator.isURL(instagram)) {
      errors.instagram = "Not a valid URL";
    }
  }
  //Return object with results of validation
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
