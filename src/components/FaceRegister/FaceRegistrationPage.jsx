import { CameraFilled, UndoOutlined } from "@ant-design/icons";
import { Button, Col, Image, Row, Space, theme, Typography } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import Webcam from "react-webcam";
import Config from "../../config";
import { MyClock } from "../layouts/Clock";
import { RegisterFaceBE } from "./api";

const maximumImageRegister = Config.registrationImages;

const FaceRegistrationPage = function (props) {
  const { notify } = props;
  const navigate = useNavigate();
  const [pictureList, setPictureList] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const webcamRef = useRef(null);
  const takePhoto = useCallback(async () => {
    const pictureSrc = await webcamRef.current.getScreenshot();
    setPictureList([...pictureList, pictureSrc]);
  }, [pictureList]);
  const {
    token: { colorBgContainer, colorInfoActive },
  } = theme.useToken();
  const [isSubmitting, setIsSubmitting] = useState(false);
  let takePhotoInterval;
  useEffect(() => {
    document.title = "Đăng ký khuôn mặt";
  }, []);

  const registerFaceBE = async () => {
    // todo: call api to register
    setIsSubmitting(true);
    try {
      var requestData = {
        PictureList: pictureList,
        EmployeeId: employeeId,
      };
      var res = await RegisterFaceBE(requestData);
      notify.success({
        message: "Thành công",
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
    // var tempList = [];
    takePhotoInterval =
      !takePhotoInterval &&
      setInterval(() => {
        console.log("AutoTakePhoto");
        takePhoto();
      }, 300);
    if (pictureList.length >= maximumImageRegister) {
      console.log("stop!");
      clearInterval(takePhotoInterval);
    }
  };

  useEffect(() => {
    autoTakePhoto();
    return () => clearInterval(takePhotoInterval);
  }, [pictureList]);

  return (
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
          {/* <Button
            type="primary"
            icon={<CameraFilled />}
            onClick={takePhoto}
            disabled={pictureList.length >= maximumImageRegister}
          >
            Chụp ảnh
          </Button> */}
          <Button
            type="primary"
            icon={<CameraFilled />}
            onClick={autoTakePhoto}
            disabled={pictureList.length >= maximumImageRegister}
          >
            Chụp ảnh tự động
          </Button>
          <Button
            type="primary"
            icon={<UndoOutlined />}
            onClick={() => setPictureList([])}
            disabled={pictureList.length == 0}
          >
            Chụp lại (Retake)
          </Button>
          <Button
            type="primary"
            onClick={registerFaceBE}
            loading={isSubmitting}
            disabled={pictureList.length < maximumImageRegister}
          >
            Đăng ký khuôn mặt
          </Button>
        </Space>
      </Col>
      <Col key="col-2" md={10}>
        <div align="center" style={{ padding: "5px" }}>
          <Typography.Text strong>
            {pictureList.length}/{maximumImageRegister}
          </Typography.Text>
        </div>
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
      </Col>
    </Row>
  );
};

/*
          <Space
            direction="vertical"
            align="center"
            style={{
              padding: "10px",
              position: "absolute",
              top: 0,
              left: 0,
              background: colorInfoActive,
            }}
          >
            <Typography.Title
              level={5}
              style={{
                margin: 0,
                textTransform: "capitalize",
                color: "white",
              }}
            >
              {dateState.format("DD - MM - YYYY")}
            </Typography.Title>
            <Typography.Title
              level={2}
              style={{
                margin: 0,
                fontWeight: "bold",
                textTransform: "capitalize",
                color: "white",
              }}
            >
              {dateState.format("HH:mm:ss")}
            </Typography.Title>
            <Typography.Title
              level={3}
              style={{
                margin: 0,
                fontWeight: "bold",
                textTransform: "capitalize",
                color: "white",
              }}
            >
              {dateState.format("dddd")}
            </Typography.Title>
          </Space>

*/
export default FaceRegistrationPage;
