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
  var requestData = {
    Picture: pictureSrc,
    AttendanceTime: new Date(),
  };
  var response = await AxiosInstance.post("api/face/recognition", requestData);
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
