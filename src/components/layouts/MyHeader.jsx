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
  Space,
  Tooltip,
  Typography,
  theme,
} from "antd";
import { Header } from "antd/es/layout/layout";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthDispatch, useAuthState } from "../../Contexts/AuthContext";
import { Logout2 } from "../Authentication/api";
import AttendanceCheckForm from "../AttendanceCheck/AttendanceCheckForm";
import useNotification from "antd/es/notification/useNotification";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck } from "@fortawesome/free-regular-svg-icons";
import { ReactComponent as Logo } from "../../logo.svg";

dayjs.locale("vi");
dayjs.extend(LocalizedFormat);

const MyHeader = ({ webcamRef, ...props }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const [openSidebar, setOpenSideBar] = useState(false);
  const dispatch = useAuthDispatch();
  const userDetails = useAuthState();
  const [notify, contextHolder] = useNotification();
  const showDrawer = () => {
    setOpenSideBar(true);
  };
  const onClose = () => {
    setOpenSideBar(false);
  };
  const LogoutHandle = () => {
    Logout2(dispatch);
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
            <Row align="middle">
              <Logo style={{ width: 31, height: 31, marginRight: 10 }} />
              <Typography.Title level={2} style={{ margin: 0 }}>
                Máy chấm công
              </Typography.Title>
            </Row>
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
              key: "AttendanceCheckForm",
              // icon: <PlusCircleOutlined style={{ fontSize: "16px" }} />,
              icon: <FontAwesomeIcon icon={faCalendarCheck} fontSize={18} />,
              label: (
                <AttendanceCheckForm notify={notify} webcamRef={webcamRef} />
              ),
            },
            menuItems,
          ]}
        />
      </Drawer>
      {contextHolder}
    </>
  );
};
export default MyHeader;
