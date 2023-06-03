export const handleErrorOfRequest = ({ error, notify, ...rest }) => {
  try {
    if (error.code === "ECONNABORTED") {
      notify.error({
        message: <b>Thông báo</b>,
        description:
          "Không nhận được phản hồi của máy chủ. Hãy kiểm tra lại kết nối Internet.",
      });
      return;
    }
    if (error.response) {
      notify.error({
        message: <b>Thông báo</b>,
        description: `[${error.response.statusText}]`,
      });
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
