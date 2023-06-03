import { Button, Col, Form, Input, Layout, Row, Typography, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthDispatch } from "../../Contexts/AuthContext";
import { LoginAccount2 } from "./api";
import { handleErrorOfRequest } from "../../utils/Helpers";
const { Title } = Typography;

const LoginPage = (props) => {
  const { notify } = props;
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useAuthDispatch();
  useEffect(() => {
    document.title = "Đăng nhập";
  }, []);
  const onSubmit = (values) => {
    setLoading(true);
    LoginAccount2(dispatch, values)
      .then((response) => {
        const { Status, Description, ResponseData } = response;
        if (Status !== 1) {
          notify.error({
            message: "Đăng nhập không thành công",
            description: Description,
          });
          return;
        }
        // localStorage.setItem("access_token", ResponseData.access_token);
        navigate("/"); // redirect to home page
      })
      .catch((error) => {
        handleErrorOfRequest({error, notify});
      })
      .finally((done) => {
        setLoading(false);
      });
  };
  return (
    <Layout
      style={{
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
      }}
    >
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
