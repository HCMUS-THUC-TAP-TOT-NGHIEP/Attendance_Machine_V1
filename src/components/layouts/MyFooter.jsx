import { Space, Typography } from "antd";
import { Footer } from "antd/es/layout/layout";
import React from "react";

function MyFooter(props) {
  return (
    <Footer>
      <Space direction="vertical" align="center" style={{ width: "100%" }}>
        <Typography.Text type="secondary">Make by</Typography.Text>
        <Typography.Text type="secondary">
          Nguyen Tuan Khanh & Nguyen Quoc Anh
        </Typography.Text>
      </Space>
    </Footer>
  );
}

export default MyFooter;
