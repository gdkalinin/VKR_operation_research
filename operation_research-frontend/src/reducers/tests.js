import {
    GET_TESTS_FAIL,
    GET_TESTS_SUCCESS,
    GET_TEST_FAIL,
    GET_TEST_SUCCESS
} from "../actions/types";


const initialState = { tests: null, last_updated: undefined }

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_TESTS_SUCCESS:
      return {
        ...state,
        tests: payload.tests,
        last_updated: Date().toLocaleString()
      };
    case GET_TESTS_FAIL:
      return {
        ...state,
        tests: null,
        last_updated: undefined
      };
      case GET_TEST_SUCCESS:
      return {
        ...state,
        test: payload.test,
        last_updated: Date().toLocaleString()
      };
    case GET_TEST_FAIL:
      return {
        ...state,
        test: null,
        last_updated: undefined
      };
    default:
      return state;
  }
}
