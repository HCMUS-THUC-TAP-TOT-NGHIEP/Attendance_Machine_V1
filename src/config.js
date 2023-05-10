const Config = {
  ServerApiUrl: process.env.REACT_APP_SERVER_API_URL,
  Timeout: 6000,
  dateFormat: "DD/MM/YYYY",
  timeFormat: "HH:mm:ss",
  timestampFormat: "DD/MM/YYYY HH:mm:ss",
  fullTimestampFormat: "dddd, DD - MM - YYYY HH:mm:ss",
  registrationImages: 10,
  videoConstraints: {
    width: { min: 480 },
    height: { min: 720 },
    facingMode: "user",
    // aspectRatio: 16 / 9,
  },
  AttendanceCheckSeconds: 10,
  ImagePlaceHolder: "/assets/img/cbimage.png",
  FaceApiModelFolder: "/models",
};

export default Config;
