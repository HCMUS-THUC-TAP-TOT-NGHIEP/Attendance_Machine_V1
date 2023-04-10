import React, { useEffect } from "react";
import { Button, Col, Divider, Layout, Row, Space } from "antd";
const { Content, Footer, Header } = Layout;
const AutoAttendanceCheck = (props) => {
  useEffect(() => {
    document.title = "Máy chấm công";
  }, []);

  return (
    <Layout style={{ height: "100vh", minWidth: "1000px" }}>
      <Row wrap={false}>
        <Col flex="auto">
          <Content>Camera</Content>
        </Col>
        <Divider type="vertical" />
        <Col flex="none">
          <Header></Header>
          <Content>Form UI</Content>
          <Footer>
            <Space>
              <Button>Chấm công mã NV</Button>
              <Button>Đăng nhập</Button>
              <Button>Đăng xuất</Button>
              <Button>Đăng ký khuôn mặt</Button>
            </Space>
          </Footer>
        </Col>
      </Row>
    </Layout>
  );
};

export { AutoAttendanceCheck };
