import {
  CameraOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  PlusCircleOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { Button, Col, Drawer, Menu, Row, Tooltip, theme } from "antd";
import { Header } from "antd/es/layout/layout";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const MyHeader = (props) => {
  const { notify } = props;
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const [openSidebar, setOpenSideBar] = useState(false);

  const showDrawer = () => {
    setOpenSideBar(true);
  };
  const onClose = () => {
    setOpenSideBar(false);
  };
  return (
    <>
      <Header style={{ background: colorBgContainer }} className="boxShadow17">
        <Row wrap>
          <Col flex="auto">
            <Tooltip title="Quay lại">
              <Button
                type="text"
                onClick={() => navigate(-1)}
                icon={<RollbackOutlined style={{ fontSize: "20px" }} />}
                shape="round"
              />
            </Tooltip>
          </Col>
          <Col flex="none">
            <Tooltip title="Menu">
              <Button
                type="text"
                onClick={showDrawer}
                icon={<MenuUnfoldOutlined style={{ fontSize: "20px" }} />}
                shape="round"
              ></Button>
            </Tooltip>
          </Col>
        </Row>
      </Header>
      <Drawer
        title="Menu"
        placement="right"
        onClose={onClose}
        open={openSidebar}
      >
        <div className="logo" />
        <Menu
          items={[
            {
              key: "0",
              icon: <CameraOutlined style={{ fontSize: "16px" }} />,
              label: <Link to="/">Chấm công khuôn mặt</Link>,
            },
            {
              key: "1",
              icon: <PlusCircleOutlined style={{ fontSize: "16px" }} />,
              label: <Link to="/face/registration">Đăng ký khuôn mặt</Link>,
            },
            {
              key: "2",
              icon: <LoginOutlined style={{ fontSize: "16px" }} />,
              label: <Link to="/login">Đăng nhập</Link>,
            },
            {
              key: "3",
              icon: <LogoutOutlined style={{ fontSize: "16px" }} />,
              label: <Link to="">Đăng xuất</Link>,
            },
          ]}
        />
      </Drawer>
    </>
  );
};
export default MyHeader;
