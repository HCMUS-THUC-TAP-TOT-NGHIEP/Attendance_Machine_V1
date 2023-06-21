import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const NoMatch = (props) => {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Trang bạn đang truy cập không tồn tại."
      extra={
        <Button
          type="primary"
          onClick={() => {
            navigate("/dashboard");
          }}
        >
          Trở về trang chủ
        </Button>
      }
    />
  );
};

export default NoMatch;
