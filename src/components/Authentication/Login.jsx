import {
  Button,
  Col,
  Form,
  Input,
  Layout,
  Row,
  notification,
  theme,
  Typography,
} from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { LoginAccount } from "./api";
const { Title } = Typography;

const LoginPage = (props) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [notify, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Đăng nhập";
  }, []);
  const onSubmit = (values) => {
    setLoading(true);
    var requestData = {
      email: values.email,
      password: values.password,
    };
    LoginAccount(values)
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status !== 1) {
          notify.error({
            message: "Đăng nhập không thành công",
            description: Description,
          });
          return;
        }
        localStorage.setItem("access_token", ResponseData.access_token);
        navigate("/dashboard"); // redirect to home page
      })
      .catch((error) => {
        if (error.response) {
          notify.error({
            message: "Có lỗi ở response.",
            description: `[${error.response.statusText}]`,
          });
        } else if (error.request) {
          notify.error({
            message: "Có lỗi ở request.",
            description: error,
          });
        } else {
          notify.error({
            message: "Có lỗi ở máy khách",
            description: error.message,
          });
        }
      })
      .finally((done) => {
        setLoading(false);
      });
  };
  return (
    <Layout style={{ height: "100vh" }}>
      {contextHolder}
      <Row
        style={{
          height: "inherit",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Col xs={2} sm={6} xl={8} />
        <Col xs={20} sm={12} xl={8}>
          <Title level={1} style={{ textAlign: "center" }}>
            Đăng nhập
          </Title>
          <Content
            style={{
              background: colorBgContainer,
              margin: "auto",
              padding: 40,
            }}
          >
            <Form
              name="basic"
              onFinish={onSubmit}
              autoComplete="off"
              layout="vertical"
              style={{ background: colorBgContainer }}
            >
              <Form.Item
                label="Username hoặc email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập username hoặc email của bạn!",
                  },
                ]}
                hasFeedback
              >
                <Input size="large" />
              </Form.Item>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu của bạn!",
                  },
                ]}
                hasFeedback
              >
                <Input.Password size="large" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                  size="large"
                  loading={loading}
                >
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>
          </Content>
        </Col>
        <Col xs={2} sm={6} xl={8} />
      </Row>
    </Layout>
  );
};

export default LoginPage;
