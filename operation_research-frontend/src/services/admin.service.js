import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:5000/api/admin/";

export const createUser = (name, secondName, email, password, permissions, group, active) => {
  return axios.post(API_URL + "user", {firstname: name, lastname: secondName, login: email, password: password, permission_id: permissions, is_active: active, group_id: group, }, { headers: authHeader() });
};

export default {
  createUser
};