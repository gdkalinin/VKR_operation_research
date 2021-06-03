import {
    GET_PRESENTATIONS_FAIL,
    GET_PRESENTATIONS_SUCCESS
} from "../actions/types";


const initialState = { presentations: null, last_updated: undefined }

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PRESENTATIONS_SUCCESS:
      return {
        ...state,
        presentations: payload.presentations,
        last_updated: Date().toLocaleString()
      };
    case GET_PRESENTATIONS_FAIL:
      return {
        ...state,
        presentation: null,
        last_updated: undefined
      };
    default:
      return state;
  }
}
