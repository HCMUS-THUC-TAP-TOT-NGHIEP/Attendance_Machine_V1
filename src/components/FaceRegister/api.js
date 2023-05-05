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

const RegisterFaceBE = async (requestData) => {
  var access_token = localStorage.getItem("access_token");
  var response = await AxiosInstance.post("api/face/register", requestData, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + access_token,
    },
  });
  return response.data;
};

const LoadingDepartmentBE = async () => {
  var access_token = localStorage.getItem("access_token");
  var response = await AxiosInstance.get(
    "api/attendance_machine/department/load",
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + access_token,
      },
    }
  );
  return response.data;
};

const LoadingEmployeeBE = async (requestData) => {
  var access_token = localStorage.getItem("access_token");
  var response = await AxiosInstance.post(
    "api/attendance_machine/employee/load",
    requestData,
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + access_token,
      },
    }
  );
  return response.data;
};

export { RegisterFaceBE, LoadingDepartmentBE, LoadingEmployeeBE };
