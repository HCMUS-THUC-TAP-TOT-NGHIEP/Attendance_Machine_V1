import React, { useEffect, useRef, useState } from "react";
import { loadModels } from "../../FaceApi";
import { useFaceApiDispatch, useFaceApiState } from "../../Contexts";
import {
  Button,
  Col,
  Descriptions,
  Image,
  Space,
  Spin,
  Table,
  Upload,
} from "antd";
import useNotification from "antd/es/notification/useNotification";
import { handleErrorOfRequest } from "../../utils/Helpers";
import { UploadOutlined } from "@ant-design/icons";
import "./style.css";
import { AutoFaceRecognitionBE } from "./api";
import Column from "antd/es/table/Column";
export const RecognitionByImagesComponent = (props) => {
  const faceApiDispatch = useFaceApiDispatch();
  const faceApiState = useFaceApiState();
  const { FaceApi, loadedNeededModels } = faceApiState;
  const [imageList, setImageList] = useState([]);
  const [source, setSource] = useState([]);
  const [notify, contextHolder] = useNotification({ placement: "bottom" });
  const [loading, setLoading] = useState(false);
  const [recogProcessing, setRecogProcessing] = useState(false);
  const [detectProcessing, setDetectProcessing] = useState(false);
  const inputRef = useRef();
  const imgRef = useRef();
  const canvasRef = useRef();
  const [result, setResult] = useState([]);
  useEffect(() => {
    document.title = "Máy chấm công";
    setLoading(false);
    const initial = async () => {
      try {
        if (!FaceApi) {
          await loadModels(faceApiDispatch);
        }
      } catch (error) {
        handleErrorOfRequest({ error, notify });
      }
    };
    initial();
  }, []);

  const onChangeImage = (info) => {
    console.log(info);
    setImageList(info.fileList);
  };

  async function uploadImage() {
    try {
      const imgFile = document.getElementById("myFileUpload").files[0];
      const img = await FaceApi.bufferToImage(imgFile);
      setSource(img.src);
    } catch (error) {
      console.error(error);
    }
  }

  async function detectionFace() {
    setDetectProcessing(false);
    try {
      const imgElement = imgRef.current;
      const canvas = canvasRef.current;
      const displaySize = {
        width: imgElement.width,
        height: imgElement.height,
      };
      FaceApi.matchDimensions(canvas, displaySize);
      const detections = await FaceApi.detectAllFaces(
        imgElement,
        new FaceApi.TinyFaceDetectorOptions()
      );
      if (detections && detections.length > 0) {
        const resizedDetections = FaceApi.resizeResults(
          detections,
          displaySize
        );
        FaceApi.draw.drawDetections(canvas, resizedDetections);
        var list = [];
        detections.forEach(async (detection) => {
          const box = detection.box;
          const regionsToExtract = [
            new FaceApi.Rect(box.x, box.y, box.width, box.height),
          ];
          let faceImages = await FaceApi.extractFaces(
            imgElement,
            regionsToExtract
          );
          faceImages.map((faceImage) => list.push(faceImage.toDataURL()));
        });
        setImageList(list);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDetectProcessing(false);
    }
  }

  const recognitionFace = async () => {
    if (imageList.length == 0) return;
    // var pictureSrc = imageList[0];
    setRecogProcessing(true);
    imageList.forEach(async (pictureSrc) => {
      var res = {
        src: pictureSrc,
      };
      var date0 = new Date();
      try {
        var response = await AutoFaceRecognitionBE(pictureSrc);
        if (response.Status === 1) {
          const { Id, Name, Img } = response.ResponseData;
          console.log(Id, Name);
          res["result"] = `${Id} - ${Name}`;
          notify.info({
            message: "Ok",
            description: `${Id}, ${Name}`,
          });
          return;
        }
        res["result"] = response.Description;

        notify.error({
          message: "Bad",
          description: response.Description,
        });
      } catch (error) {
        handleErrorOfRequest({ notify, error });
      } finally {
        var date1 = new Date();
        res["date0"] = date0.toLocaleString();
        res["date1"] = date1.toLocaleString();
        res["total"] = date1 - date0;
        setResult([res, ...result]);
        setRecogProcessing(false);
      }
    });
    setRecogProcessing(false);
  };

  return (
    <Spin spinning={loading}>
      <Space direction="horizontal" align="start">
        <Space direction="vertical" style={{ margin: 10 }}>
          {contextHolder}
          <Space style={{ margin: 10 }}>
            <input
              id="myFileUpload"
              type="file"
              onChange={uploadImage}
              accept=".jpg, .jpeg, .png, .heic"
              ref={inputRef}
            />
            <Button onClick={detectionFace} loading={detectProcessing}>
              Phát hiện khuôn mặt
            </Button>
            <Button
              type="primary"
              onClick={recognitionFace}
              loading={recogProcessing}
            >
              Nhận diện khuôn mặt
            </Button>
            <Button onClick={() => setResult([])}>Clear Table</Button>
          </Space>
          <Space>
            <div id="container">
              <img src={source} width={300} id="img-element" ref={imgRef} />
              <canvas
                ref={canvasRef}
                style={{ zIndex: 101, position: "absolute" }}
              />
            </div>
          </Space>
          <Image.PreviewGroup>
            <Space direction="vertical">
              {imageList.map((src, index) => (
                <Image src={src} key={index} width={100} />
              ))}
            </Space>
          </Image.PreviewGroup>
        </Space>
        <div>
          <Table
            dataSource={result}
            rowKey={"start"}
            // scroll={{ x: 600, y: 600 }}
            bordered
            pagination={{
              pageSize: 5,
            }}
          >
            <Column
              key={"index"}
              title=""
              render={(_, __, index) => index}
              width={40}
            />
            <Column key="start" title="start" dataIndex={"date0"} width={120} />
            <Column
              key="finish"
              title="finish"
              dataIndex={"date1"}
              width={120}
            />
            <Column
              key="total (ms)"
              title="total (ms)"
              dataIndex={"total"}
              width={100}
            />
            <Column
              key="result"
              title="result"
              dataIndex={"result"}
              width={400}
            />
            <Column
              key="img"
              title=""
              width={100}
              render={(_, rec) => <Image src={rec.src} width={80} />}
              fixed="right"
            />
          </Table>
        </div>
      </Space>
    </Spin>
  );
};
