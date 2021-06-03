import {
    GET_USERS_FAIL,
    GET_USERS_SUCCESS
} from "../actions/types";


const initialState = { users: null }

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_USERS_SUCCESS:
      console.log(payload)
      return {
        ...state,
        users: payload.users,
      };
    case GET_USERS_FAIL:
      return {
        ...state,
        users: null,
      };
    default:
      return state;
  }
}
