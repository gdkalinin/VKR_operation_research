import { combineReducers } from "redux";
import auth from "./auth";
import message from "./message";
import users from './users'
import groups from './groups'
import presentations from "./presentations";
import tests from "./tests";

export default combineReducers({
  auth,
  message,
  users,
  groups,
  presentations,
  tests
});
