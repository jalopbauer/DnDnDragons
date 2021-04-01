import axios from "axios";
import authHeader from "./authHeader";

const API_URL = "http://localhost:8080/api/";

const getAllCharacters = () => {
  return axios.get(API_URL + "character/");
};

const getUserCharacters = (userId) => {
  return axios.get(API_URL + `user/${userId}/character/`, { headers: authHeader() });
};

// const getUserBoard = () => {
//   return axios.get(API_URL + "user", { headers: authHeader() });
// };

// const getModeratorBoard = () => {
//   return axios.get(API_URL + "mod", { headers: authHeader() });
// };

// const getAdminBoard = () => {
//   return axios.get(API_URL + "admin", { headers: authHeader() });
// };

const userService = {
  getAllCharacters,
  getUserCharacters,
  // getUserBoard,
  // getModeratorBoard,
  // getAdminBoard,
};

export default userService