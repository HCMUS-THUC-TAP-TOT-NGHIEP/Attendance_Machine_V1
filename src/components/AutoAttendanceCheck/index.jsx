import {
  Avatar,
  Button,
  Form,
  Input,
  Layout,
  List,
  Typography,
  notification,
  theme
} from "antd";
import Sider from "antd/es/layout/Sider";
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
  // const { notify } = props;
  const [notify, contextHolder] = notification.useNotification({
    maxCount: 3,
  });
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [picture, setPicture] = useState(null);
  const [stopped, setStopped] = useState(false);
  const {
    token: { colorInfoActive },
  } = theme.useToken();
  const autoTakePhoto = async () => {
    if (stopped) return;
    if (webcamRef && webcamRef.current) {
      const pictureSrc = webcamRef.current.getScreenshot();
      setPicture(pictureSrc);
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
    }
    setTimeout(function () {
      if (stopped) return;
      autoTakePhoto();
    }, Config.AttendanceCheckSeconds * 1000);
  };

  useEffect(() => {
    document.title = "Máy chấm công";
    // autoTakePhoto();
  }, []);

  useEffect(() => {
    if (stopped) return;
    autoTakePhoto();
  }, [stopped]);

  return (
    <Layout>
      {contextHolder}
      <Content style={{ padding: "10px", position: "relative" }}>
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
          className="boxShadow89"
          style={{ width: "100%", position: "absolute", top: 0, left: 0 }}
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/png"
          videoConstraints={Config.videoConstraints}
        ></Webcam>
      </Content>
      <Sider
        theme="light"
        breakpoint="lg"
        collapsedWidth="0"
        width={400}
        style={{ padding: "10px" }}
      >
        <Typography.Title
          level={2}
          style={{ textAlign: "center", wordWrap: "break-word" }}
        >
          Cung cấp mã nhân viên
        </Typography.Title>
        <Form layout="vertical">
          <Form.Item
            label="Mã nhân viên"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mã nhân viên!",
              },
            ]}
            hasFeedback
            tooltip="Cung cấp mã nhân viên để chấm công khi không nhận diện được khuôn mặt"
            help={
              <Typography.Text type="danger">
                Cung cấp mã nhân viên để chấm công khi không nhận diện được
                khuôn mặt
              </Typography.Text>
            }
          >
            <Input placeholder="Mã nhân viên" size="large" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" style={{ width: "100%" }}>
              Nhận
            </Button>
          </Form.Item>
        </Form>
      </Sider>
    </Layout>
  );
};

export { AutoAttendanceCheck };

