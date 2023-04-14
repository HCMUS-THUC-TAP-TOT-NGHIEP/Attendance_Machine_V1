import { CameraFilled, UndoOutlined } from "@ant-design/icons";
import { Button, Col, Image, Row, Space, theme } from "antd";
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
  });
  const {
    token: { colorBgContainer, colorInfoActive },
  } = theme.useToken();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Đăng ký khuôn mặt";
  }, []);

  useEffect(() => {
    console.log(webcamRef.current.width);
  }, [webcamRef]);

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
      notify.error({
        message: "FAILED",
      });
    } finally {
      setIsSubmitting(false);
    }
    // setTimeout(() => {
    //   for (const based64Img of pictureList) {
    //     console.log(based64Img);
    //   }
    //   setIsSubmitting(false);
    //   notify.success({
    //     message: "Thành công",
    //   });
    // }, 2000);
  };

  const autoTakePhoto = async () => {
    var tempList = [];
    var takePhotoInterval = setInterval(() => {
      console.log("AutoTakePhoto");
      if (tempList.length < maximumImageRegister - pictureList.length) {
        let pictureSrc = webcamRef.current.getScreenshot();
        tempList.push(pictureSrc);
        return;
      }
      setPictureList(tempList);
      clearInterval(takePhotoInterval);
    }, 100);
  };
  const manualTakePhoto = () => {};

  return (
    <Row justify="center">
      <Col key="col-1" md={16}>
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
        <Space
          direction="horizontal"
          style={{
            paddingTop: "15px",
            justifyContent: "center",
            width: "100%",
          }}
        >
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
          >
            Đăng ký khuôn mặt
          </Button>
        </Space>
      </Col>
      <Col key="col-2" md={8} style={{ paddingTop: "20px" }}>
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
