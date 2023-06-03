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
  Spin,
  Tabs,
  Tooltip,
  Typography,
  notification,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import Webcam from "react-webcam";
import { useAuthState } from "../../Contexts/AuthContext";
import Config from "../../config";
import { LoadingDepartmentBE, LoadingEmployeeBE, RegisterFaceBE } from "./api";
import * as FaceApi from "face-api.js";
import {
  useFaceApiDispatch,
  useFaceApiState,
} from "../../Contexts/FaceApiContext";
import { loadModels } from "../../FaceApi";

const { Option } = Select;
const maximumImageRegister = Config.registrationImages;

let detectFace;
let interval;

const FaceRegistrationPage = function (props) {
  const { notify, adminRequired } = props;
  const navigate = useNavigate();
  const [pictureList, setPictureList] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const [tabKey, setTabKey] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userDetails = useAuthState();

  useEffect(() => {
    if (adminRequired) {
      if (!userDetails.token) {
        notify.warning({
          message: "Yêu cầu đăng nhập",
          description:
            "Vui lòng sử dụng tài khoản quản trị viên để đăng ký khuôn mặt.",
        });
        navigate("/login");
        return;
      }
    }
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
      handleErrorOfRequest({error, notify});
    } finally {
      setIsSubmitting(false);
    }
  };
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
              <CaptureFaceComponent
                maximumImageRegister={maximumImageRegister}
                setPictureList={setPictureList}
                pictureList={pictureList}
                active={tabKey === 2}
              />
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
  const userDetails = useAuthState();

  useEffect(() => {
    if (!userDetails.token) {
      return;
    }
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
        handleErrorOfRequest({error, notify});
      } finally {
        setLoadingDepartment(false);
      }
      return;
    };
    loadDepartment();
  }, []);
  useEffect(() => {
    if (!userDetails.token) {
      return;
    }
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
        handleErrorOfRequest({error, notify});
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

var takePhotoInterval;

function CaptureFaceComponent({
  maximumImageRegister,
  setPictureList,
  pictureList,
  active,
  ...rest
}) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const faceApiState = useFaceApiState();
  const { FaceApi, loadedNeededModels } = faceApiState;
  const faceApiDispatch = useFaceApiDispatch();
  const [imageList, setImageList] = useState(pictureList);
  const [notify, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (!active) return;
    const initial = async () => {
      try {
        if (!FaceApi) {
          await loadModels(faceApiDispatch);
        }
        startVideo();
      } catch (error) {
        handleErrorOfRequest({error, notify});
      }
    };
    initial();
    return () => {
      clearInterval(interval);
      clearInterval(takePhotoInterval);
    };
  }, [active]);

  useEffect(() => {
    if (imageList.length == 0) return;
    if (imageList.length >= maximumImageRegister) {
      console.log("stop!");
      setPictureList(imageList);
      return;
    }
    console.log("Auto capture");
    const newIntervalId = setInterval(() => autoTakePhoto(), 300);
    return () => clearInterval(newIntervalId);
  }, [imageList]);

  const autoTakePhoto = async () => {
    const video = webcamRef.current.video;
    if (webcamRef && webcamRef.current) {
      try {
        const detection = await FaceApi.detectSingleFace(
          video
          // new FaceApi.TinyFaceDetectorOptions()
        ).withFaceExpressions();
        if (detection) {
          // console.log(detection);
          var pictureSrcList = await extractFaceFromBox(
            video,
            detection.detection.box
          );
          console.log("pictureSrcList", pictureSrcList);
          if (pictureSrcList && pictureSrcList.length != 0) {
            setImageList([...imageList, pictureSrcList[0]]);
            clearInterval(takePhotoInterval);
          }
        }
      } catch (error) {
        handleErrorOfRequest({error, notify});
      }
    }
  };

  const extractFaceFromBox = async (inputImage, box) => {
    console.log(box);
    const regionsToExtract = [
      new FaceApi.Rect(box.x - 50, box.y - 50, box.width + 100, box.height + 100),
    ];

    let faceImages = await FaceApi.extractFaces(inputImage, regionsToExtract);
    console.log("faceImages", faceImages);
    return faceImages.map((faceImage) => faceImage.toDataURL());
  };

  const detectFace = () => {
    /*
    const video = webcamRef.current.video;
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(async () => {
      try {
        const canvas = canvasRef.current;
        const displaySize = {
          width: video.offsetWidth,
          height: video.offsetHeight,
        };
        FaceApi.matchDimensions(canvasRef.current, displaySize);
        const detection = await FaceApi.detectSingleFace(
          video,
          new FaceApi.TinyFaceDetectorOptions()
        ).withFaceExpressions();
        if (detection) {
          console.log(detection);
          const resizedDetections = FaceApi.resizeResults(
            detection,
            displaySize
          );
          canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
          FaceApi.draw.drawDetections(canvas, resizedDetections);
        }
      } catch (error) {
        console.log("detectFace", error);
      }

      // }, Config.AttendanceCheckSeconds * 1000);
    }, 100);
    */
  };

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then((stream) => {
        webcamRef.current.video.srcObject = stream;
        webcamRef.current.video.addEventListener("playing", () => detectFace());
      })
      .catch((error) => {
        handleErrorOfRequest({error, notify});
      });
  };

  return (
    <Spin spinning={!loadedNeededModels}>
      <Row
        justify="center"
        style={{
          padding: "5px",
        }}
      >
        {contextHolder}
        <Col key="col-1" md={14}>
          <div>
            <Webcam
              className="boxShadow89"
              style={{
                width: "100%",
              }}
              audio={false}
              ref={webcamRef} // height={600}
              screenshotFormat="image/png"
              videoConstraints={Config.videoConstraints} // onPlaying={detectFace}
            ></Webcam>
            <canvas
              ref={canvasRef}
              style={{
                zIndex: 999,
                position: "absolute",
              }}
            />
          </div>

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
                disabled={imageList.length >= maximumImageRegister}
              />
            </Tooltip>
            <Tooltip title="Chụp lại (Retake)">
              <Button
                type="primary"
                icon={<UndoOutlined />}
                onClick={() => setImageList([])}
                disabled={imageList.length == 0}
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
              {imageList.map((rec, index) => {
                return (
                  <Image
                    key={index}
                    height={100}
                    src={rec}
                    className="boxShadow89"
                    preview={true}
                  />
                );
              })}
              {Array(maximumImageRegister - imageList.length)
                .fill(0)
                .map((_, index) => {
                  return (
                    <Image
                      key={index + imageList.length}
                      height={100}
                      width={1600 / 9}
                      src={Config.ImagePlaceHolder}
                      className="boxShadow89"
                    />
                  );
                })}
            </Space>
          </Image.PreviewGroup>
          <div
            align="center"
            style={{
              padding: "5px",
            }}
          >
            <Typography.Text strong>
              Đã chụp {imageList.length}/{maximumImageRegister} ảnh
            </Typography.Text>
          </div>
        </Col>
      </Row>
    </Spin>
  );
}
