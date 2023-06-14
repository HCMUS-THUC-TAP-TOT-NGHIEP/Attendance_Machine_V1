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
  Image,
  InputNumber,
  Menu,
  Modal,
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
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthDispatch, useAuthState } from "../../Contexts/AuthContext";
import { Logout2 } from "../Authentication/api";
import { CheckinWithEmployeeId, SearchEmployeeBE } from "./api";
import { handleErrorOfRequest } from "../../utils/Helpers";
import Webcam from "react-webcam";
dayjs.locale("vi");
dayjs.extend(LocalizedFormat);
let timeout;

const AttendanceCheckForm = ({ notify, ...rest }) => {
  const navigate = useNavigate();
  const [openSidebar, setOpenSideBar] = useState(false);
  const dispatch = useAuthDispatch();
  const userDetails = useAuthState();
  const [employeeList, setEmployeeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [form] = Form.useForm();
  const showDrawer = () => {
    setOpenSideBar(true);
  };
  const onClose = () => {
    setEmployeeList([]);
    setImgSrc(null);
    setOpenSideBar(false);
    form.resetFields(["EmployeeId"]);
  };

  const onChecking = useCallback(
    async (values) => {
      console.log(values);
      setProcessing(true);
      try {
        if (!webcamRef.current) {
          throw new Error("Không thể chụp hình của nhân viên.");
        }
        console.log(webcamRef.current);
        values["Image"] = webcamRef.current.getScreenshot();
        setImgSrc(values["Image"]);

        console.log(values);
        const response = await CheckinWithEmployeeId(values);
        if (response.Status == 1) {
          notify.success({
            description: "Đã chấm công",
          });
          return;
        }
        throw new Error(response.Description);
      } catch (error) {
        handleErrorOfRequest({ error, notify });
      } finally {
        setProcessing(false);
      }
    },
    [webcamRef]
  );

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

  const onChecking_ = async (values) => {
    setProcessing(true);
    try {
      if (!webcamRef.current) {
        throw new Error("Không thể chụp hình của nhân viên.");
      }
      console.log(webcamRef.current);
      values["Image"] = webcamRef.current.getScreenshot();
      setImgSrc(values["Image"]);

      console.log(values);
      const response = await CheckinWithEmployeeId(values);
      if (response.Status == 1) {
        notify.success({
          description: "Đã chấm công",
        });
        return;
      }
      throw new Error(response.Description);
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
        <Webcam
          height={600}
          width={600}
          ref={webcamRef}
          autoPlay={true}
          screenshotFormat="image/png"
          // hidden
        />
        <Form layout="vertical" onFinish={onChecking} form={form}>
          <Form.Item
            label="Phương thức chấm công"
            name="Method"
            initialValue={2}
            hidden
          >
            <InputNumber value={2} />
          </Form.Item>
          <Form.Item
            label="Nhân viên"
            name="EmployeeId"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập từ khóa để tìm nhân viên!",
              },
            ]}
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
        <Image src={imgSrc} width={100} />
      </Drawer>
    </>
  );
};
export default AttendanceCheckForm;
