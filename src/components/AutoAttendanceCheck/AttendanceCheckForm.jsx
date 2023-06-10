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
  Form,
  Menu,
  Row,
  Select,
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
import { SearchEmployeeBE } from "./api";
import { handleErrorOfRequest } from "../../utils/Helpers";
dayjs.locale("vi");
dayjs.extend(LocalizedFormat);
let timeout;

const AttendanceCheckForm = ({ notify, ...rest }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const [openSidebar, setOpenSideBar] = useState(false);
  const dispatch = useAuthDispatch();
  const userDetails = useAuthState();
  const [employeeList, setEmployeeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const showDrawer = () => {
    setOpenSideBar(true);
  };
  const onClose = () => {
    setOpenSideBar(false);
  };

  const handleSearch = (value) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (!value) return;
    value = String(value).trim();
    function SearchEmployee() {
      setLoading(true);
      SearchEmployeeBE({ Keyword: value })
        .then((response) => {
          const { Status, ResponseData } = response;
          if (Status === 1) {
            console.log(response);
            setEmployeeList(ResponseData);
          }
        })
        .catch((error) => {
          handleErrorOfRequest({ error, notify });
        })
        .finally(() => {
          setLoading(false);
        });
    }
    if (value) {
      timeout = setTimeout(SearchEmployee, 200);
    } else {
      setEmployeeList([]);
    }
  };

  const onChecking = async (values) => {
    setProcessing(true);
    try {
    } catch (error) {
      handleErrorOfRequest({ error, notify });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <Typography.Text onClick={showDrawer}>
        Chấm công bằng mã nhân viên
      </Typography.Text>
      <Drawer
        title="Nhập mã nhân viên để chấm công"
        placement="right"
        onClose={onClose}
        open={openSidebar}
      >
        <Form layout="vertical" onFinish={onChecking}>
          <Form.Item
            label="Nhân viên"
            name="EmployeeId"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập từ khóa để tìm nhân viên!",
              },
            ]}
            hasFeedback
            tooltip="Cung cấp mã nhân viên để chấm công khi không nhận diện được khuôn mặt"
            help="Nhập mã hoặc tên nhân viên để tìm kiếm"
          >
            <Select
              size="large"
              showSearch={true}
              onSearch={handleSearch}
              options={(employeeList || []).map((employee) => ({
                label: `${employee.LastName} ${employee.FirstName} (Mã NV: ${employee.Id})`,
                value: employee.Id,
              }))}
              showArrow={false}
              filterOption={false}
              defaultActiveFirstOption={false}
              notFoundContent={null}
              loading={loading}
            />
          </Form.Item>
          <Form.Item>
            <Button
              key="submit"
              htmlType="submit"
              type="primary"
              loading={processing}
            >
              Chấm công
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};
export default AttendanceCheckForm;
