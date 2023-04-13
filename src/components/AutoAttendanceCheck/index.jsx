import { Col, Divider, Layout, Row, theme } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import Webcam from "react-webcam";
import Config from "../../config";
import { MyClock } from "../layouts/Clock";
dayjs.locale("vi");
dayjs.extend(LocalizedFormat);
const { Content } = Layout;

const AutoAttendanceCheck = (props) => {
  const { notify } = props;
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const {
    token: { colorInfoActive },
  } = theme.useToken();
  useEffect(() => {
    document.title = "Máy chấm công";
  }, []);

  return (
    <Row wrap={false}>
      <Col md={16}>
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

export { AutoAttendanceCheck };
