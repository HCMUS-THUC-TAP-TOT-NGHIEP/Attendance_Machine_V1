export const handleErrorOfRequest = ({ error, notify, ...rest }) => {
  try {
    const errorList = ["ECONNABORTED", "ERR_NETWORK"];
    if (error && error.code && errorList.includes(error.code)) {
      notify.error({
        message: <b>Thông báo</b>,
        description:
          "Không nhận được phản hồi của máy chủ. Hãy kiểm tra lại kết nối Internet.",
      });
      return;
    }
    if (error.response) {
      switch (error.response.status) {
        case 401:
          notify.error({
            message: <b>Thông báo</b>,
            description: error.response.data.Description,
          });
          break;
        default:
          notify.error({
            message: <b>Thông báo</b>,
            description: error.response.data.Description,
          });
          break;
      }
    } else if (error.request) {
      notify.error({
        message: <b>Thông báo</b>,
        description: error,
      });
    } else {
      notify.error({
        message: <b>Thông báo</b>,
        description: `${error.message}`,
      });
    }
  } catch (error) {
    console.error(error.message);
  }
};
