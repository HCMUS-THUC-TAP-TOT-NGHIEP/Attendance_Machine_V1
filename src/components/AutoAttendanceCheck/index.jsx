import {
  Avatar,
  Button,
  Form,
  Layout,
  List,
  Modal,
  Select,
  message,
  notification,
  theme,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import * as FaceApi from "face-api.js";
// import * as canvas_pack from "canvas";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import Webcam from "react-webcam";
import Config from "../../config";
import { MyClock } from "../layouts/Clock";
import { AutoFaceRecognitionBE, SearchEmployeeBE } from "./api";
// import { FaceApi, detectFaces, loadModels } from "../../FaceApi";
dayjs.locale("vi");
dayjs.extend(LocalizedFormat);
const { Content } = Layout;
// const { Canvas, Image, ImageData } = canvas_pack;
// FaceApi.env.monkeyPatch({ Canvas, Image, ImageData });
let timeout;

const AutoAttendanceCheck = (props) => {
  const [notify, contextHolder] = notification.useNotification({
    maxCount: 3,
  });
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  // const [picture, setPicture] = useState(null);
  const [stopped, setStopped] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const {
    token: { colorInfoActive },
  } = theme.useToken();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const autoTakePhoto = async () => {
    /*  if (stopped) return;
    if (timeout) {
      clearTimeout(timeout);
    }
    if (webcamRef && webcamRef.current) {
      const pictureSrc = webcamRef.current.getScreenshot();
      setPicture(pictureSrc);
    }
          try {
        if (pictureSrc) {
          var response = await AutoFaceRecognitionBE(pictureSrc);
          if (response.Status === 1) {
            const { Id, Name, Img } = response.ResponseData;
            notify.open({
              description: (
                <List key={Id} itemLayout="horizontal">
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          shape="square"
                          src={`data:image/png;base64,${Img}`}
                          size={{
                            xs: 24,
                            sm: 32,
                            md: 40,
                            lg: 64,
                            xl: 80,
                            xxl: 100,
                          }}
                        />
                      }
                      title={"Xin chào, " + Name}
                      description={Name}
                    />
                  </List.Item>
                </List>
              ),
              placement: "bottomLeft",
              duration: 60,
            });
          } else {
            setPicture(null);
          }
        }
      } catch (error) {
        if (error.response) {
          notify.error({
            message: "Có lỗi ở response.",
            description: `[${error.response.statusText}]`,
            placement: "bottomLeft",
          });
        } else if (error.request) {
          notify.error({
            message: "Có lỗi ở request.",
            description: error,
            placement: "bottomLeft",
          });
        } else {
          notify.error({
            message: "Có lỗi ở máy khách",
            description: error.message,
            placement: "bottomLeft",
          });
        }
        setPicture(null);
      } finally {
      }

    console.log("Take photo");
    timeout = setTimeout(function () {
      if (stopped) return;
      autoTakePhoto();
    }, Config.AttendanceCheckSeconds * 1000);
    */
  };
  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const handleSearch = (value) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (!value) return;
    value = String(value).trim();
    function SearchEmployee() {
      SearchEmployeeBE({ Keyword: value })
        .then((response) => {
          const { Status, ResponseData } = response;
          if (Status === 1) {
            console.log(response);
            setEmployeeList(ResponseData);
          }
        })
        .catch((error) => {})
        .finally({});
    }
    if (value) {
      timeout = setTimeout(SearchEmployee, 200);
    } else {
      setEmployeeList([]);
    }
  };
  const handlePlayEvent = () => {
    const video = webcamRef.current.video;
    setInterval(async () => {
      const canvas = canvasRef.current;
      const displaySize = {
        width: video.offsetWidth,
        height: video.offsetHeight,
      };
      FaceApi.matchDimensions(canvasRef.current, displaySize);
      const detections = await FaceApi.detectAllFaces(
        video,
        new FaceApi.TinyFaceDetectorOptions()
      ).withFaceExpressions();
      const resizedDetections = FaceApi.resizeResults(detections, displaySize);
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      FaceApi.draw.drawDetections(canvas, resizedDetections);
      console.log("detections", detections);
      if (detections.length > 0) {
        var pictureSrcList = extractFaceFromBox(
          video,
          detections[0].detection.box
        );
        recognitionBE(pictureSrcList);
      }
    }, Config.AttendanceCheckSeconds * 1000);
  };
  
  // This function extract a face from video frame with giving bounding box and display result into outputimage
  async function extractFaceFromBox(inputImage, box) {
    console.log(box);
    const regionsToExtract = [
      new FaceApi.Rect(box.x, box.y, box.width, box.height),
    ];

    let faceImages = await FaceApi.extractFaces(inputImage, regionsToExtract);
    return faceImages.map((faceImage) => faceImage.toDataURL());
  }

  const recognitionBE = async (pictureSrcList) => {
    try {
      if (pictureSrcList.length > 0) {
        var pictureSrc = pictureSrcList[0];
        var response = await AutoFaceRecognitionBE(pictureSrc);
        if (response.Status === 1) {
          const { Id, Name, Img } = response.ResponseData;
          notify.open({
            description: (
              <List key={Id} itemLayout="horizontal">
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        shape="square"
                        src={`data:image/png;base64,${Img}`}
                        size={{
                          xs: 24,
                          sm: 32,
                          md: 40,
                          lg: 64,
                          xl: 80,
                          xxl: 100,
                        }}
                      />
                    }
                    title={"Xin chào, " + Name}
                    description={Name}
                  />
                </List.Item>
              </List>
            ),
            placement: "bottomLeft",
            duration: 60,
          });
        }
      }
    } catch (error) {
      if (error.response) {
        notify.error({
          message: "Có lỗi ở response.",
          description: `[${error.response.statusText}]`,
          placement: "bottomLeft",
        });
      } else if (error.request) {
        notify.error({
          message: "Có lỗi ở request.",
          description: error,
          placement: "bottomLeft",
        });
      } else {
        notify.error({
          message: "Có lỗi ở máy khách",
          description: error.message,
          placement: "bottomLeft",
        });
      }
    } finally {
    }
  };
  useEffect(() => {
    document.title = "Máy chấm công";
    setLoading(false);
    const loadModels = async () => {
      Promise.all([
        FaceApi.nets.tinyFaceDetector.loadFromUri("/models"),
        FaceApi.nets.faceExpressionNet.loadFromUri("/models"),
        FaceApi.nets.faceLandmark68Net.loadFromUri("/models"),
        FaceApi.nets.faceRecognitionNet.loadFromUri("/models"),
      ])
        .then(startVideo)
        .catch((error) => {
          notify.error({ message: error });
        });
    };
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then((stream) => {
        webcamRef.current.video.srcObject = stream;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Layout>
      {contextHolder}
      <Content
        style={{
          padding: "10px",
          position: "relative",
          overflowY: "hidden",
          height: "100vh",
        }}
      >
        <MyClock
          containerStyle={{
            padding: "10px",
            position: "absolute",
            top: 0,
            left: 0,
            background: colorInfoActive,
            zIndex: 100,
          }}
        />
        <Webcam
          id="video"
          className="boxShadow89"
          style={{ width: "100%", position: "absolute", top: 0, left: 0 }}
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/png"
          videoConstraints={Config.videoConstraints}
          onPlaying={handlePlayEvent}
        ></Webcam>

        <canvas ref={canvasRef} style={{ zIndex: 999, position: "absolute" }} />
        <Button
          onClick={showModal}
          className="boxShadow89"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
          }}
          type="primary"
          size="large"
        >
          Chấm công bằng mã nhân viên
        </Button>
        <Modal
          open={open}
          title={<div level={5}>Cung cấp mã nhân viên </div>}
          onCancel={handleCancel}
          maskClosable={true}
          footer={[
            <Button key="submit" htmlType="submit" type="primary">
              Chấm công
            </Button>,
            <Button key="back" onClick={handleCancel}>
              Trở lại
            </Button>,
          ]}
        >
          <Form layout="vertical">
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
              />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export { AutoAttendanceCheck };
