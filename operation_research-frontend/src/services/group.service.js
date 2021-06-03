import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:5000/api/";

const getGroupsBoard = () => {
  return axios.get(API_URL + "groups", { headers: authHeader() });
};

export default {
  getGroupsBoard,
};