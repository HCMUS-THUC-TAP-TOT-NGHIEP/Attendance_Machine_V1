import {
  ArrowLeftOutlined,
  CameraFilled,
  RollbackOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { Button, Col, Image, Layout, Row, Space, Tooltip, theme } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import Webcam from "react-webcam";
import Config from "../../config";

const maximumImageRegister = Config.registrationImages;

const FaceRegistrationPage = function (props) {
  const { notify } = props;
  const navigate = useNavigate();
  const [pictureList, setPictureList] = useState([]);
  const webcamRef = useRef(null);
  const takePhoto = useCallback(() => {
    for (var i = 0; i < maximumImageRegister; i++) {
      const pictureSrc = webcamRef.current.getScreenshot();
      if (pictureList.length < maximumImageRegister) {
        setPictureList([...pictureList, pictureSrc]);
      }
    }
  });
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  useEffect(() => {
    document.title = "Đăng ký khuôn mặt";
  }, []);

  useEffect(() => {
    console.log(webcamRef.current.width);
  }, [webcamRef]);

  const registerFaceBE = () => {
    // todo: call api to register
    notify.success({
      message: "Thành công",
    });
  };

  return (
    <>
      <Row justify={"center"} style={{ paddingTop: "20px" }}>
        <Col key="col-1" md={16}>
          <Webcam
            style={{ width: "100%" }}
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={Config.videoConstraints}
          ></Webcam>
        </Col>
        <Col key="col-2" md={8}>
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
                return <Image key={index} width={200} src={rec} />;
              })}
            </Space>
          </Image.PreviewGroup>
        </Col>
      </Row>
      <Row justify="center" gutter={24}>
        <Space direction="horizontal" style={{ paddingTop: "15px" }}>
          <Button
            type="primary"
            icon={<CameraFilled />}
            onClick={takePhoto}
            disabled={pictureList.length >= maximumImageRegister}
          >
            Chụp ảnh
          </Button>
          <Button
            type="primary"
            icon={<CameraFilled />}
            onClick={takePhoto}
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
          <Button type="primary" onClick={registerFaceBE}>
            Đăng ký khuôn mặt
          </Button>
        </Space>
      </Row>
    </>
  );
};
export default FaceRegistrationPage;
