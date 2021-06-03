import GroupService from "../services/group.service";
import {GET_GROUPS_FAIL, GET_GROUPS_SUCCESS, SET_MESSAGE} from "./types";

export const getGroups = () => (dispatch) => {
  return GroupService.getGroupsBoard().then(
    (data) => {
      dispatch({
        type: GET_GROUPS_SUCCESS,
        payload: { groups: data.data.data },
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
        type: GET_GROUPS_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};