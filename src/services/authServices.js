import apiClient from "./services.js";

export default {
  loginUser(user) {
    return apiClient.post("performanceapi/login", user);
  },
  authorizeUser(code) {
    return apiClient.post("performanceapi/authorize", code);
  },
  logoutUser(token) {
    return apiClient.post("performanceapi/logout", token);
  },
};
