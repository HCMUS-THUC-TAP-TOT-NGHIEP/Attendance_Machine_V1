import {
  CameraOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  PlusCircleOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Drawer,
  Menu,
  Row,
  Tooltip,
  Typography,
  theme
} from "antd";
import { Header } from "antd/es/layout/layout";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthDispatch, useAuthState } from "../../Contexts/AuthContext";
import { Logout2 } from "../Authentication/api";
dayjs.locale("vi");
dayjs.extend(LocalizedFormat);

const MyHeader = (props) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const [openSidebar, setOpenSideBar] = useState(false);
  const dispatch = useAuthDispatch();
  const userDetails = useAuthState();
  const showDrawer = () => {
    setOpenSideBar(true);
  };
  const onClose = () => {
    setOpenSideBar(false);
  };
  const LogoutHandle = () => {
    const accessToken = localStorage.getItem("access_token");
    localStorage.removeItem("access_token");
    Logout2(dispatch, accessToken);
    navigate("/login");
  };
  const menuItems = userDetails.token
    ? {
        key: "3",
        icon: <LogoutOutlined style={{ fontSize: "16px" }} />,
        label: (
          <Link to="" onClick={LogoutHandle}>
            Đăng xuất
          </Link>
        ),
      }
    : {
        key: "2",
        icon: <LoginOutlined style={{ fontSize: "16px" }} />,
        label: <Link to="/login">Đăng nhập</Link>,
      };

  return (
    <>
      <Header
        style={{
          background: colorBgContainer,
          zIndex: 10,
        }}
        className="boxShadow89"
      >
        <Row wrap align="middle">
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
          <Col flex="auto">
            <Typography.Title level={2} style={{ margin: 0 }}>
              Máy chấm công
            </Typography.Title>
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
            menuItems,
          ]}
        />
      </Drawer>
    </>
  );
};
export default MyHeader;
