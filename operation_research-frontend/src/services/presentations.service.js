import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:5000/api/";

const getPresentationsBoard = () => {
  return axios.get(API_URL + "presentation", { headers: authHeader() });
};

export default {
  getPresentationsBoard,
};