import { CameraFilled, UndoOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Form,
  Image,
  Row,
  Select,
  Space,
  Tabs,
  Tooltip,
  Typography,
  theme,
} from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import Webcam from "react-webcam";
import Config from "../../config";
import { MyClock } from "../layouts/Clock";
import { LoadingDepartmentBE, LoadingEmployeeBE, RegisterFaceBE } from "./api";
const { Option } = Select;
const maximumImageRegister = Config.registrationImages;

const FaceRegistrationPage = function (props) {
  const { notify } = props;
  const navigate = useNavigate();
  const [pictureList, setPictureList] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const webcamRef = useRef(null);
  const [tabKey, setTabKey] = useState(1);
  // const takePhoto = useCallback(async () => {
  //   if (webcamRef && webcamRef.current) {
  //     const pictureSrc = await webcamRef.current.getScreenshot();
  //     setPictureList([...pictureList, pictureSrc]);
  //   }
  //   return;
  // }, []);
  const {
    token: { colorBgContainer, colorInfoActive, colorSuccessActive },
  } = theme.useToken();
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    document.title = "Đăng ký khuôn mặt";
  }, []);

  const registerFaceBE = async () => {
    setIsSubmitting(true);
    try {
      var requestData = {
        PictureList: pictureList,
        EmployeeId: employeeId,
      };
      var res = await RegisterFaceBE(requestData);
      if (res.Status === 1) {
        notify.success({
          message: "Thành công",
        });
        return;
      }
      notify.error({
        message: "Đăng ký không thành công",
        description: res.Description,
      });
    } catch (error) {
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const autoTakePhoto = () => {
    if (webcamRef && webcamRef.current) {
      const pictureSrc = webcamRef.current.getScreenshot();
      setPictureList((pictureList) => [...pictureList, pictureSrc]);
    }
  };

  useEffect(() => {
    if (pictureList.length == 0) return;
    if (pictureList.length >= maximumImageRegister) {
      console.log("stop!");
      // clearInterval(intervalId);
      return;
    }
    console.log("Auto capture");
    const newIntervalId = setInterval(() => autoTakePhoto(), 300);
    return () => clearInterval(newIntervalId);
  }, [pictureList]);

  return (
    <>
      <Tabs
        activeKey={tabKey}
        type="card"
        centered
        tabBarStyle={{ marginTop: "5px" }}
        onChange={(activeKey) => {
          setTabKey(activeKey);
        }}
        items={[
          {
            key: 1,
            label: "Nhân viên",
            children: (
              <SelectUserForm
                setEmployeeForRegisterFace={setEmployeeId}
                notify={notify}
              />
            ),
          },
          {
            key: 2,
            label: "Khuôn mặt",
            children: (
              <Row justify="center" style={{ padding: "5px" }}>
                <Col key="col-1" md={14}>
                  <MyClock
                    containerStyle={{
                      padding: "10px",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      background: colorInfoActive,
                    }}
                  />
                  <Webcam
                    className="boxShadow89"
                    style={{ width: "100%" }}
                    audio={false}
                    ref={webcamRef}
                    // height={600}
                    screenshotFormat="image/png"
                    videoConstraints={Config.videoConstraints}
                  ></Webcam>
                  <Space
                    direction="horizontal"
                    style={{
                      paddingTop: "15px",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <Tooltip title="Bắt đầu chụp ảnh tự động">
                      <Button
                        type="primary"
                        icon={<CameraFilled />}
                        shape="circle"
                        onClick={autoTakePhoto}
                        disabled={pictureList.length >= maximumImageRegister}
                      />
                    </Tooltip>
                    <Tooltip title="Chụp lại (Retake)">
                      <Button
                        type="primary"
                        icon={<UndoOutlined />}
                        onClick={() => setPictureList([])}
                        disabled={pictureList.length == 0}
                      />
                    </Tooltip>
                  </Space>
                </Col>
                <Col key="col-2" md={10}>
                  <Image.PreviewGroup>
                    <Space
                      size={[8, 16]}
                      align="center"
                      style={{
                        width: "100%",
                        justifyContent: "center",
                        WebkitJustifyContent: "center",
                      }}
                      wrap
                    >
                      {pictureList.map((rec, index) => {
                        return (
                          <Image
                            key={index}
                            height={100}
                            src={rec}
                            className="boxShadow89"
                          />
                        );
                      })}
                      {Array(maximumImageRegister - pictureList.length)
                        .fill(0)
                        .map((_, index) => {
                          return (
                            <Image
                              key={index + pictureList.length}
                              height={100}
                              width={1600 / 9}
                              src={Config.ImagePlaceHolder}
                              className="boxShadow89"
                            />
                          );
                        })}
                    </Space>
                  </Image.PreviewGroup>
                  <div align="center" style={{ padding: "5px" }}>
                    <Typography.Text strong>
                      Đã chụp {pictureList.length}/{maximumImageRegister} ảnh
                    </Typography.Text>
                  </div>
                </Col>
              </Row>
            ),
          },
        ]}
      />
      <Divider />
      <div style={{ textAlign: "center" }}>
        <Space>
          {tabKey == 1 ? (
            <Button
              type="primary"
              onClick={() => {
                setTabKey(2);
              }}
            >
              Chuyển sang đăng ký khuôn mặt
            </Button>
          ) : (
            <>
              <Button
                type="primary"
                onClick={() => {
                  setTabKey(1);
                }}
              >
                Quay lại
              </Button>
              <Button
                type="primary"
                onClick={registerFaceBE}
                loading={isSubmitting}
                disabled={
                  pictureList.length < maximumImageRegister || !employeeId
                }
              >
                Đăng ký khuôn mặt
              </Button>
            </>
          )}
          <Button
            type="primary"
            danger
            onClick={() => {
              navigate(-1);
            }}
          >
            Hủy
          </Button>
        </Space>
      </div>
    </>
  );
};

const SelectUserForm = (props) => {
  const { setEmployeeForRegisterFace, notify } = props;
  const [departmentId, setDepartmentId] = useState(null);
  const [departmentList, setDepartmentList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [loadingDepartment, setLoadingDepartment] = useState(false);
  const [loadingEmployee, setLoadingEmployee] = useState(false);
  useEffect(() => {
    const loadDepartment = async () => {
      setLoadingDepartment(true);
      try {
        var res1 = await LoadingDepartmentBE();
        if (res1.Status === 1) {
          setDepartmentList(res1.ResponseData);
          return;
        }
        notify.error({
          message: "Không lấy được dữ liệu phòng ban",
          description: res1.Description,
        });
      } catch (error) {
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
      } finally {
        setLoadingDepartment(false);
      }
      return;
    };
    loadDepartment();
  }, []);
  useEffect(() => {
    const loadEmployeeList = async () => {
      setLoadingEmployee(true);
      try {
        var requestData = {
          DepartmentId: departmentId,
        };
        var res1 = await LoadingEmployeeBE(requestData);
        if (res1.Status === 1) {
          setEmployeeList(res1.ResponseData);
          return;
        }
        notify.error({
          message: "Không lấy được dữ liệu nhân viên",
          description: res1.Description,
        });
      } catch (error) {
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
      } finally {
        setLoadingEmployee(false);
      }
      return;
    };
    loadEmployeeList();
  }, [departmentId]);
  return (
    <div>
      <Row key="1" justify={"center"}>
        <Typography.Title level={2}>Nhân viên</Typography.Title>
      </Row>
      <Row key="2" justify={"center"}>
        <Form style={{ width: "600px", maxWidth: "100%" }}>
          <Form.Item label="Phòng ban" name="DepartmentId">
            <Select
              showSearch={true}
              loading={loadingDepartment}
              onChange={(value, option) => {
                setDepartmentId(option.label);
              }}
            >
              <Option key={-1} label={null} value="Tất cả" />
              {departmentList.map((department, index) => (
                <Option
                  key={index}
                  label={department.Id}
                  value={`${department.Id} - ${department.Name}`}
                ></Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Nhân viên"
            name="EmployeeId"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn nhân viên",
              },
            ]}
          >
            <Select
              showSearch
              loading={loadingEmployee}
              onChange={(value, option) => {
                setEmployeeForRegisterFace(option.label);
              }}
            >
              {employeeList.map((employee, index) => (
                <Option
                  key={index}
                  label={employee.Id}
                  value={`${employee.Id} - ${employee.LastName} ${employee.FirstName}`}
                ></Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Row>
    </div>
  );
};

export default FaceRegistrationPage;
