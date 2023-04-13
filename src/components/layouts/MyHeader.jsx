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
  Layout,
  Menu,
  Row,
  Space,
  Tooltip,
  Typography,
  theme,
} from "antd";
import { Header } from "antd/es/layout/layout";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import Config from "../../config";
dayjs.locale("vi");
dayjs.extend(LocalizedFormat);

const MyHeader = (props) => {
  const { notify } = props;
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const [openSidebar, setOpenSideBar] = useState(false);
  const [dateState, setDateState] = useState(dayjs());
  const showDrawer = () => {
    setOpenSideBar(true);
  };
  const onClose = () => {
    setOpenSideBar(false);
  };
  useEffect(() => {
    setInterval(() => setDateState(dayjs()), 1000);
  }, []);
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
