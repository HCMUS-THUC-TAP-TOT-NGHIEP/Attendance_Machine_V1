import {
  ArrowLeftOutlined,
  CameraFilled,
  UndoOutlined,
} from "@ant-design/icons";
import { Button, Col, Image, Layout, Row, Space, Tooltip, theme } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import Webcam from "react-webcam";

const WebcamComponent = () => <Webcam />;
const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: "user",
};

const FaceRegistrationPage = function (props) {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const [picture, setPicture] = useState([]);
  const webcamRef = useRef(null);
  const takePhoto = useCallback(() => {
    const pictureSrc = webcamRef.current.getScreenshot();
    setPicture([...picture, pictureSrc]);
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

  return (
    <Layout>
      <Header style={{ background: colorBgContainer, padding: "0 10px" }}>
        <Row wrap>
          <Col>
            <Tooltip title="Trở lại">
              <Button
                type="text"
                onClick={() => navigate(-1)}
                icon={<ArrowLeftOutlined />}
                shape="circle"
              />
            </Tooltip>
          </Col>
          <Col>
            <Space direction="horizontal">
              <Button
                type="primary"
                icon={<CameraFilled />}
                onClick={takePhoto}
              >
                Chụp ảnh
              </Button>
              <Button
                type="primary"
                icon={<UndoOutlined />}
                onClick={() => setPicture([])}
              >
                Chụp lại (Retake)
              </Button>
            </Space>
          </Col>
        </Row>
      </Header>
      <Content>
        <Row gutter={24}>
          <Col md={12}>
            <div className="camera">
              <Webcam
                style={{ height: "auto" }}
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
              />
            </div>
          </Col>
          <Col md={12}>
            {picture.map((rec, index) => {
              return <Image key={index} width={200} src={rec} />;
            })}
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};
export default FaceRegistrationPage;
