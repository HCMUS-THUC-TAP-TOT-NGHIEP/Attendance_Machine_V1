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

const AutoFaceRecognitionBE = async ({ pictureSrc, attendanceTime }) => {
  var requestData = {};
  if (process.env.NODE_ENV !== "production") {
    const uuid = require("uuid");
    const id = uuid.v4();
    requestData["uuid"] = id;
  }
  requestData["Picture"] = pictureSrc;
  requestData["AttendanceTime"] = attendanceTime || new Date().toISOString();
  var response = await AxiosInstance.post("api/face/recognition", requestData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

const SearchEmployeeBE = async (request) => {
  var access_token = localStorage.getItem("access_token");
  var response = await AxiosInstance.post(
    "api/attendance_machine/employee/load2",
    request,
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + access_token,
      },
    }
  );
  return response.data;
};

const CheckinWithEmployeeId = async (request) => {
  let formData = new FormData();
  formData.append("Image", request.Image);
  formData.append("Method", request.Method);
  formData.append("EmployeeId", request.EmployeeId);
  formData.append(
    "AttendanceTime",
    request.AttendanceTime || new Date().toISOString()
  );

  var response = await AxiosInstance.post("api/checkin/new", formData, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export { AutoFaceRecognitionBE, CheckinWithEmployeeId, SearchEmployeeBE };
