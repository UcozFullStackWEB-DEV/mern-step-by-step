import axios from "axios";
import { USER_REGISTER_FAILURE, SET_CURRENT_USER, USER_LOG_OUT } from "./types";
import setAuthToken from "../utils/setAuthToken";
import parseJwt from "../utils/parseJWT";

const get_errors = errors => {
  return {
    type: USER_REGISTER_FAILURE,
    payload: errors
  };
};

export const userRegister = (userInfo, history) => dispatch => {
  axios
    .post("/api/users/register", userInfo)
    .then(user => history.push("/login"))
    .catch(err => dispatch(get_errors(err.response.data)));
};

export const userLogin = userInfo => dispatch => {
  axios
    .post("/api/users/login", userInfo)
    .then(res => {
      const { token } = res.data;
      const decodedUser = parseJwt(token);
      localStorage.setItem("jwtToken", token);
      setAuthToken(token);
      dispatch(setCurrentUser(decodedUser));
    })
    .catch(err => dispatch(get_errors(err.response.data)));
};

export const setCurrentUser = decodedUser => {
  return {
    type: SET_CURRENT_USER,
    payload: decodedUser
  };
};

export const logOutUser = () => dispatch => {
  localStorage.removeItem("jwtToken");
  //Remove headers from axios
  setAuthToken(null);
  dispatch({ type: USER_LOG_OUT });
};
