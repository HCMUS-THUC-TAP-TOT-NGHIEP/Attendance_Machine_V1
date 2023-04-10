import axios from "axios";
import Config from "../../config";
let AxiosInstance = axios.create({
  baseURL: Config.ServerApiUrl,
  timeout: Config.Timeout || 6000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Accept: "application/json",
  },
});

export const LoginAccount = async (requestData) => {
  var bodyData = {
    email: requestData.email,
    password: requestData.password,
  };
  var response = await AxiosInstance.post("api/auth/login", bodyData, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
  return response.data;
};

export const Logout = async (access_token) => {
  var response = await AxiosInstance.post("api/auth/logout", null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + access_token,
    },
  });
  return response.data;
};
