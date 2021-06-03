import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:5000/api/";

const getTestsBoard = () => {
  return axios.get(API_URL + "tests", { headers: authHeader() });
};

const getTest = (id: number) => {
  return axios.get(API_URL + "test/" + id, { headers: authHeader() });
};

export const createTest = (assignee, start_at, finish_until, is_rating, description, tasks) => {
  return axios.post(API_URL + "tests", {assignee: assignee, start_at: start_at, finish_until: finish_until, is_rating: is_rating, description: description, tasks: tasks }, { headers: authHeader() });
};

export default {
  getTestsBoard,
  getTest
};