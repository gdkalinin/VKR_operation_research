import {
    GET_GROUPS_FAIL,
    GET_GROUPS_SUCCESS
} from "../actions/types";


const initialState = { groups: null, last_updated: undefined }

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_GROUPS_SUCCESS:
      return {
        ...state,
        groups: payload.groups,
        last_updated: Date().toLocaleString()
      };
    case GET_GROUPS_FAIL:
      return {
        ...state,
        groups: null,
        last_updated: undefined
      };
    default:
      return state;
  }
}
