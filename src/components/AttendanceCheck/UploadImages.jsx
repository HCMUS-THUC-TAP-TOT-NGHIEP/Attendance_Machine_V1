import { Button, Image, Space, Spin, Table } from "antd";
import useNotification from "antd/es/notification/useNotification";
import Column from "antd/es/table/Column";
import React, { useEffect, useRef, useState } from "react";
import { useFaceApiDispatch, useFaceApiState } from "../../Contexts";
import { loadModels } from "../../FaceApi";
import { handleErrorOfRequest } from "../../utils/Helpers";
import { AutoFaceRecognitionBE } from "./api";
import "./style.css";
export const RecognitionByImagesComponent = (props) => {
  const faceApiDispatch = useFaceApiDispatch();
  const faceApiState = useFaceApiState();
  const { FaceApi, loadedNeededModels } = faceApiState;
  const [imageList, setImageList] = useState([]);
  const [source, setSource] = useState([]);
  const [notify, contextHolder] = useNotification({ placement: "bottomRight" });
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
      setImageList([]);
      const imgFile = document.getElementById("myFileUpload").files[0];
      FaceApi.bufferToImage(imgFile)
        .then((img) => {
          setSource(img.src);
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      console.error(error);
    }
  }

  async function detectionFace() {
    setDetectProcessing(false);
    try {
      console.log("start detecting");
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
        notify.info({
          message: (
            <div>
              Phát hiện <b> {detections.length} </b> khuôn mặt
            </div>
          ),
          placement: "top",
        });
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
      } else {
        setImageList([]);
        notify.warning({
          message: "Không tìm thấy khuôn mặt nào.",
          placement: "top",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDetectProcessing(false);
    }
  }

  const recognitionFace = async () => {
    if (imageList.length == 0) return;
    setRecogProcessing(true);
    var res = [];
    for (var i = 0; i < imageList.length; i++) {
      try {
        let pictureSrc = imageList[i];

        var temp = {
          src: pictureSrc,
        };
        var date0 = new Date();
        var response = await AutoFaceRecognitionBE(pictureSrc);
        if (response.Status === 1) {
          const { Id, Name, Img } = response.ResponseData;
          temp["result"] = `${Id} - ${Name}`;
          notify.info({
            message: "Ok",
            description: `${Id}, ${Name}`,
          });
        } else {
          temp["result"] = response.Description;
          notify.error({
            message: "Bad",
            description: response.Description,
          });
        }
      } catch (error) {
        handleErrorOfRequest({ notify, error });
      } finally {
        var date1 = new Date();
        temp["date0"] = date0.toLocaleString();
        temp["date1"] = date1.toLocaleString();
        temp["total"] = date1 - date0;
        setRecogProcessing(false);
        res.push(temp);
      }
    }
    setResult([...res, ...result]);
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
            rowKey="start"
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
