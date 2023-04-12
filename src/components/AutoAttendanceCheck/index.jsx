import React, { useEffect } from "react";
import { Button, Col, Divider, Layout, Row, Space } from "antd";
import { useNavigate } from "react-router";
const { Content, Footer, Header } = Layout;
const AutoAttendanceCheck = (props) => {
  const navigate = useNavigate();
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
              <Button onClick={() => navigate("/login")}>Đăng nhập</Button>
              <Button onClick={null}>Đăng xuất</Button>
              <Button onClick={()=>{navigate("/face/registration")}}>Đăng ký khuôn mặt</Button>
            </Space>
          </Footer>
        </Col>
      </Row>
    </Layout>
  );
};

export { AutoAttendanceCheck };
