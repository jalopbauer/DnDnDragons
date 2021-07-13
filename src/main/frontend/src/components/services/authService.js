import axios from "axios";

const API_URL = "http://localhost:8080/api";

const register = (username, email, password) => {
  return axios.post(`${API_URL}/auth/signup`, {
    username,
    email,
    password,
  });
};

const login = (username, password) => {
  return axios.post(`${API_URL}/auth/login`, {
    username,
    password,
  }, {'Content-Type': 'application/json'})
  .then((response) => {
    if (response.data.accessToken) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  })
  .catch((error) => {
    return error;
  });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
}

export default authService;

