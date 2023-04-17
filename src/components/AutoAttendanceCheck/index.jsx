import { Col, Divider, Layout, Row, theme } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import Webcam from "react-webcam";
import Config from "../../config";
import { MyClock } from "../layouts/Clock";
import { AutoFaceRecognitionBE } from "./api";
dayjs.locale("vi");
dayjs.extend(LocalizedFormat);
const { Content } = Layout;

const AutoAttendanceCheck = (props) => {
  const { notify } = props;
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [picture, setPicture] = useState(null);
  const [stopped, setStopped] = useState(false);
  const {
    token: { colorInfoActive },
  } = theme.useToken();
  // const takePhoto = useRef(() => {
  //   if (webcamRef && webcamRef.current) {
  //     const pictureSrc = webcamRef.current.getScreenshot();
  //     setPicture(pictureSrc);
  //   }
  // }, [picture]);
  const autoTakePhoto = async () => {
    if (!stopped) {
      if (webcamRef && webcamRef.current) {
        const pictureSrc = webcamRef.current.getScreenshot();
        setPicture(pictureSrc);
        try {
          if (pictureSrc) {
            var response = await AutoFaceRecognitionBE({ Picture: pictureSrc });
            if (response.Status === 1) {
              console.log(response.ResponseData);
              const { Id, Name } = response.ResponseData;
              notify.success({
                message: "Thành công",
                description: `Nhân viên ${Id} - ${Name}`,
              });
            } else {
              notify.error({
                message: "Có lỗi",
                description: response.Description,
              });
            }
          }
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
        }
      }
    }
    setTimeout(autoTakePhoto, 10000); //10s
    // setTimeout(autoTakePhoto, 1000);
  };

  useEffect(() => {
    document.title = "Máy chấm công";
    autoTakePhoto();
  }, []);

  // useEffect(() => {
  // }, [picture, notify]);

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
          screenshotFormat="image/png"
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
