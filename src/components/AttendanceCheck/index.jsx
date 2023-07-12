import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Image,
  Layout,
  List,
  Modal,
  Row,
  Select,
  Spin,
  Typography,
  message,
  notification,
  theme,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
// import * as FaceApi from "face-api.js";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import Webcam from "react-webcam";
import Config from "../../config";
import { MyClock } from "../layouts/Clock";
import { AutoFaceRecognitionBE, SearchEmployeeBE } from "./api";
import {
  useFaceApiDispatch,
  useFaceApiState,
} from "../../Contexts/FaceApiContext";
import { loadModels } from "../../FaceApi";
import { handleErrorOfRequest } from "../../utils/Helpers";
dayjs.locale("vi");
dayjs.extend(LocalizedFormat);
const { Content } = Layout;

let timeout;
let interval;

const AutoAttendanceCheck = ({ webcamRef, props }) => {
  const [notify, contextHolder] = notification.useNotification({
    maxCount: 3,
  });
  const navigate = useNavigate();
  // const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [videoswitch, setVideo] = useState(true);
  const [stream, setStream] = useState(null);
  const [employeeList, setEmployeeList] = useState([]);
  const {
    token: { colorInfoActive },
  } = theme.useToken();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [responseList, setResponseList] = useState([]);
  const faceApiState = useFaceApiState();
  const { FaceApi, loadedNeededModels, LabeledDescriptors } = faceApiState;
  const faceApiDispatch = useFaceApiDispatch();
  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!videoswitch) {
      if (interval) clearInterval(interval);
      return;
    }
    handlePlayEvent();
  }, [videoswitch]);
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
        .catch((error) => {
          handleErrorOfRequest({ error, notify });
        })
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
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(async () => {
      if (!FaceApi) return;
      const canvas = canvasRef.current;
      const displaySize = {
        width: video.offsetWidth,
        height: video.offsetHeight,
      };
      FaceApi.matchDimensions(canvas, displaySize);
      const detections = await FaceApi.detectAllFaces(
        video,
        new FaceApi.TinyFaceDetectorOptions()
      );
      if (detections && detections.length > 0) {
        const resizedDetections = FaceApi.resizeResults(
          detections,
          displaySize
        );
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        // canvas
        //   .getContext("2d")
        //   .clearRect(0, 0, canvas.width + 50, canvas.height + 50);
        FaceApi.draw.drawDetections(canvas, resizedDetections);
        detections.forEach(async (detection) => {
          var pictureSrcList = await extractFaceFromBox(video, detection.box);
          await recognitionBE(detection.descriptor, pictureSrcList[0]);
        });
        // var pictureSrcList = await extractFaceFromBox(video, detections[0].box);
        // await recognitionBE(detections[0].descriptor, pictureSrcList[0]);
      }
    }, 2000);
  };

  // This function extract a face from video frame with giving bounding box and display result into outputimage
  async function extractFaceFromBox(inputImage, box) {
    const regionsToExtract = [
      new FaceApi.Rect(box.x, box.y, box.width, box.height),
    ];
    let faceImages = await FaceApi.extractFaces(inputImage, regionsToExtract);
    return faceImages.map((faceImage) => faceImage.toDataURL());
  }

  const recognitionBE = async (descriptor, pictureSrc) => {
    try {
      let attendanceTime = dayjs().locale("vi");
      var response = await AutoFaceRecognitionBE({
        pictureSrc,
        attendanceTime: attendanceTime.toISOString().replace("Z", ""),
      });
      console.log(responseList);

      if (response.Status === 1) {
        const { Id, Name, Img } = response.ResponseData;
        setResponseList((responseList) => [
          {
            Id,
            Name,
            Img: pictureSrc,
            AttendanceTime: attendanceTime.toLocaleString(),
            Success: true,
          },
          ...responseList.filter((element, index) => index < 19),
        ]);
        // notify.open({
        //   description: (
        //     <List key={Id} itemLayout="horizontal">
        //       <List.Item>
        //         <List.Item.Meta
        //           avatar={
        //             <Avatar
        //               shape="square"
        //               // src={`data:image/png;base64,${Img}`}
        //               src={pictureSrc}
        //               size={{
        //                 xs: 24,
        //                 sm: 32,
        //                 md: 40,
        //                 lg: 64,
        //                 xl: 80,
        //                 xxl: 100,
        //               }}
        //             />
        //           }
        //           title={"Xin chào, " + Name}
        //           description={Name}
        //         />
        //       </List.Item>
        //     </List>
        //   ),
        //   placement: "bottomLeft",
        //   duration: 60,
        // });
      } else {
        console.error(response.Description);
        setResponseList((responseList) => [
          {
            Id: "",
            Name: "",
            Img: pictureSrc,
            AttendanceTime: attendanceTime.toLocaleString(),
            Success: false,
            Description: response.Description,
          },
          ...responseList.filter((element, index) => index < 19),
        ]);
      }
    } catch (error) {
      handleErrorOfRequest({ error, notify });
    } finally {
    }
  };
  useEffect(() => {
    document.title = "Máy chấm công";
    setLoading(false);
    const initial = async () => {
      try {
        if (!FaceApi) {
          await loadModels(faceApiDispatch);
        }
        navigator.mediaDevices
          .getUserMedia({ audio: false, video: true })
          .then((stream) => {
            webcamRef.current.video.srcObject = stream;
            setStream(stream);
          })
          .catch((error) => {
            throw error;
          });
      } catch (error) {
        handleErrorOfRequest({ error, notify });
      }
    };
    initial();
    return () => clearInterval(interval);
  }, []);

  const handleVideo = () => {
    if (videoswitch) {
      setVideo(false);
      stream.getTracks().forEach(function (track) {
        if (track.readyState === "live" && track.kind === "video") {
          track.enabled = false;
        }
      });
    } else {
      setVideo(true);
      stream.getTracks().forEach(function (track) {
        if (track.readyState === "live" && track.kind === "video") {
          track.enabled = true;
        }
      });
    }
  };

  return (
    <Spin spinning={!loadedNeededModels}>
      <Layout>
        {contextHolder}
        <Content
          style={{
            padding: 10,
            overflowX: "hidden",
          }}
        >
          <Row gutter={[24, 24]} wrap style={{ height: "100vh" }}>
            <Col
              xs={24}
              md={16}
              lg={16}
              xl={16}
              xxl={16}
              style={{
                position: "relative",
                overflowY: "hidden",
                overflowX: "hidden",
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
              <canvas
                ref={canvasRef}
                style={{ zIndex: 101, position: "absolute" }}
              />
              <Button
                onClick={handleVideo}
                className="boxShadow89"
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  zIndex: 102,
                }}
                type="primary"
                size="large"
              >
                {videoswitch ? "Tắt camera" : "Mở camera"}
              </Button>
            </Col>
            <Col xs={24} md={8} lg={8} xl={8} xxl={8}>
              <Card
                className="boxShadow0 rounded"
                id="scrollableDiv"
                style={{ overflowY: "hidden" }}
              >
                <List
                  dataSource={responseList}
                  size="small"
                  header={
                    <Typography.Title
                      level={3}
                      style={{ margin: 0, textAlign: "center", fontSize: "30" }}
                    >
                      Chấm công
                    </Typography.Title>
                  }
                  pagination={{
                    defaultPageSize: 5,
                    align: "center",
                    hideOnSinglePage: true,
                  }}
                  style={{ overflowY: "auto", height: 600 }}
                  renderItem={(item, index) => (
                    <List.Item key={index}>
                      <List.Item.Meta
                        style={{ alignItems: "center" }}
                        avatar={<Image width={50} preview src={item.Img} />}
                        title={
                          <Typography.Paragraph
                            style={{ color: item.Success ? "black" : "red" }}
                          >
                            {item.Success ? item.Name : "Unknown"}
                          </Typography.Paragraph>
                        }
                        description={
                          "Thời gian: " + (item.AttendanceTime || "")
                        }
                      />
                    </List.Item>
                  )}
                ></List>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Spin>
  );
  // return (
  //   <Spin spinning={!loadedNeededModels}>
  //     <Layout>
  //       {contextHolder}
  //       <Content
  //         style={{
  //           padding: "10px",
  //           position: "relative",
  //           overflowY: "hidden",
  //           height: "100vh",
  //         }}
  //       >
  //         <MyClock
  //           containerStyle={{
  //             padding: "10px",
  //             position: "absolute",
  //             top: 0,
  //             left: 0,
  //             background: colorInfoActive,
  //             zIndex: 100,
  //           }}
  //         />
  //         <Webcam
  //           id="video"
  //           className="boxShadow89"
  //           style={{ width: "100%", position: "absolute", top: 0, left: 0 }}
  //           audio={false}
  //           ref={webcamRef}
  //           screenshotFormat="image/png"
  //           videoConstraints={Config.videoConstraints}
  //           onPlaying={handlePlayEvent}
  //         ></Webcam>

  //         <canvas
  //           ref={canvasRef}
  //           style={{ zIndex: 101, position: "absolute" }}
  //         />
  //         <Button
  //           onClick={handleVideo}
  //           className="boxShadow89"
  //           style={{
  //             position: "absolute",
  //             top: "10px",
  //             right: "10px",
  //             zIndex: 102,
  //           }}
  //           type="primary"
  //           size="large"
  //         >
  //           {videoswitch ? "Tắt camera" : "Mở camera"}
  //         </Button>

  //         <Modal
  //           open={open}
  //           title={<div level={5}>Cung cấp mã nhân viên </div>}
  //           onCancel={handleCancel}
  //           maskClosable={true}
  //           footer={[
  //             <Button key="submit" htmlType="submit" type="primary">
  //               Chấm công
  //             </Button>,
  //             <Button key="back" onClick={handleCancel}>
  //               Trở lại
  //             </Button>,
  //           ]}
  //         >
  //           <Form layout="vertical">
  //             <Form.Item
  //               label="Nhân viên"
  //               name="EmployeeId"
  //               rules={[
  //                 {
  //                   required: true,
  //                   message: "Vui lòng nhập từ khóa để tìm nhân viên!",
  //                 },
  //               ]}
  //               hasFeedback
  //               tooltip="Cung cấp mã nhân viên để chấm công khi không nhận diện được khuôn mặt"
  //               help="Nhập mã hoặc tên nhân viên để tìm kiếm"
  //             >
  //               <Select
  //                 size="large"
  //                 showSearch={true}
  //                 onSearch={handleSearch}
  //                 options={(employeeList || []).map((employee) => ({
  //                   label: `${employee.LastName} ${employee.FirstName} (Mã NV: ${employee.Id})`,
  //                   value: employee.Id,
  //                 }))}
  //                 showArrow={false}
  //                 filterOption={false}
  //                 defaultActiveFirstOption={false}
  //                 notFoundContent={null}
  //               />
  //             </Form.Item>
  //           </Form>
  //         </Modal>
  //       </Content>
  //     </Layout>
  //   </Spin>
  // );
};

export { AutoAttendanceCheck };
export * from "./UploadImages";
