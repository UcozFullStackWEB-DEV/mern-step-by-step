import { USER_REGISTER_FAILURE } from "../actions/types";
const initialState = {};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_REGISTER_FAILURE:
      //return object with errors
      return action.payload;
    default:
      return state;
  }
};

export default authReducer;
