import axios from "axios";
import AuthServices from "./authServices.js";
import Router from "../router/index.js";
import { useLoginStore } from "../stores/LoginStore.js";

var baseurl = "";
if (process.env.NODE_ENV === "development") {
  baseurl = "http://localhost:3028/";
} else {
  baseurl = "/";
}

const apiClient = axios.create({
  baseURL: baseurl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Access-Control-Allow-Origin": "*",
    crossDomain: true,
  },
  transformRequest: (data, headers) => {
    const loginStore = useLoginStore();
    let user = loginStore.user;
    if (user != null) {
      let token = user.token;
      let authHeader = "";
      if (token != null && token != "") authHeader = "Bearer " + token;
      headers["Authorization"] = authHeader;
    }
    return JSON.stringify(data);
  },
  transformResponse: function (data) {
    const loginStore = useLoginStore();

    data = JSON.parse(data);
    // if (!data.success && data.code == "expired-session") {
    //   localStorage.deleteItem("user");
    // }
    if (data.message !== undefined && data.message.includes("Unauthorized")) {
      AuthServices.logoutUser(loginStore.user)
        .then((response) => {
          console.log(response);
          loginStore.clearLoginUser();
          Router.push({ name: "login" });
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
    return data;
  },
});

export default apiClient;
