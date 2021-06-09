import TestsService from "../services/tests.service";
import {GET_TESTS_FAIL, GET_TESTS_SUCCESS, GET_TEST_FAIL, GET_TEST_SUCCESS, SET_MESSAGE} from "./types";

export const getTests = () => (dispatch) => {
  return TestsService.getTestsBoard().then(
    (data) => {

      dispatch({
        type: GET_TESTS_SUCCESS,
        payload: { tests: data.data.data },
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
        type: GET_TESTS_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const getCurrentTest = (id: number) => (dispatch) => {
  return TestsService.getTest(id).then(
    (data) => {

      dispatch({
        type: GET_TEST_SUCCESS,
        payload: { test: data.data.data },
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
        type: GET_TEST_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};