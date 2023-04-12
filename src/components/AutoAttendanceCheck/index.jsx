import { Col, Divider, Layout, Row } from "antd";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import Webcam from "react-webcam";
import Config from "../../config";
const { Content, Footer, Header } = Layout;
const AutoAttendanceCheck = (props) => {
  const { notify } = props;
  const navigate = useNavigate();
  const webcamRef = useRef(null);

  useEffect(() => {
    document.title = "Máy chấm công";
  }, []);

  return (
    <Row wrap={false}>
      <Col md={16}>
        <Webcam
          style={{ width: "100%" }}
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={Config.videoConstraints}
        ></Webcam>
      </Col>
      <Divider type="vertical" />
      <Col md={8}>
        <Content>Form UI</Content>
      </Col>
    </Row>
  );
};

export { AutoAttendanceCheck };
