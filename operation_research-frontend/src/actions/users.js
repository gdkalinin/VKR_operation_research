import UserService from "../services/user.service";
import {GET_USERS_FAIL, GET_USERS_SUCCESS, SET_MESSAGE} from "./types";

export const getUsers = () => (dispatch) => {
  return UserService.getUserBoard().then(
    (data) => {
      dispatch({
        type: GET_USERS_SUCCESS,
        payload: { users: data.data.data },
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: GET_USERS_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};