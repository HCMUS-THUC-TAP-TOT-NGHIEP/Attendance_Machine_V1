var Config = {
  ServerApiUrl: process.env.REACT_APP_SERVER_API_URL,
  Timeout: 6000,
  dateFormat: "DD/MM/YYYY",
  timeFormat: "HH:mm:ss",
  timestampFormat: "DD/MM/YYYY HH:mm:ss",
  registrationImages: 5,
  videoConstraints: {
    height: 600,
    facingMode: "user",
  },
};

export default Config;
