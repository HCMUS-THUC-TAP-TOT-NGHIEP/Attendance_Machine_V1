import dayjs from "dayjs";
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

const AutoFaceRecognitionBE = async (pictureSrc) => {
  var requestData = {};
  if (process.env.NODE_ENV !== "production") {
    const uuid = require("uuid");
    const id = uuid.v4();
    requestData["uuid"] = id;
  }
  requestData["Picture"] = pictureSrc;
  requestData["AttendanceTime"] = new Date();
  var response = await AxiosInstance.post("api/face/recognition", requestData, {
    headers: {
      "Content-Type": "application/json"
    }
  });

  // let formData = new FormData();

  // const file = new File([pictureSrc], "webcam-frame.png", {
  //   type: "image/png",
  // });
  // formData.append("Picture", file);
  // formData.append("AttendanceTime", new Date());
  // if (process.env.NODE_ENV !== "production") {
  //   const uuid = require("uuid");
  //   const id = uuid.v4();
  //   formData.append("uuid", id);
  // }
  // var response = await AxiosInstance.post("api/face/recognition", formData, {
  //   headers: {
  //     "Content-Type": "multipart/form-data",
  //   },
  // });

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

export { AutoFaceRecognitionBE, SearchEmployeeBE };
