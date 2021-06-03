import PresentationService from "../services/presentations.service";
import {GET_PRESENTATIONS_SUCCESS, GET_PRESENTATIONS_FAIL, SET_MESSAGE} from "./types";

export const getPresentations = () => (dispatch) => {
  return PresentationService.getPresentationsBoard().then(
    (data) => {
            console.log(data.data.data)

      dispatch({
        type: GET_PRESENTATIONS_SUCCESS,
        payload: { presentations: data.data.data },
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
        type: GET_PRESENTATIONS_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};