// import nodejs bindings to native tensorflow,
// not required, but will speed up things drastically (python required)
// import "@tensorflow/tfjs-node";

// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
// import * as canvas from "canvas";

import * as FaceApi from "face-api.js";
import Config from "../config";

// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement
// const { Canvas, Image, ImageData } = canvas;
// FaceApi.env.monkeyPatch({ Canvas, Image, ImageData });

const loadModels = async (dispatch) => {
  try {
    console.log(new Date());
    dispatch({ type: "REQUEST_LOADING" });
    console.log("Loading models...");
    await Promise.all([
      // FaceApi.nets.ssdMobilenetv1.loadFromUri("/models"),
      FaceApi.nets.tinyFaceDetector.loadFromUri("/models"),
      // FaceApi.nets.tinyYolov2.loadFromUri("/models")
      // FaceApi.nets.faceExpressionNet.loadFromUri("/models"),
      // FaceApi.nets.faceLandmark68Net.loadFromUri("/models"),
      // FaceApi.nets.faceRecognitionNet.loadFromUri("/models"),
    ]);

    dispatch({ type: "LOADING_SUCCESS", payload: { FaceApi: FaceApi } });
  } catch (err) {
    console.error("loadModels", err);
    dispatch({ type: "LOADING_ERROR", error: err });
  } finally {
    console.log("Finish Loading models...");
    console.log(new Date());
  }
};
export { loadModels };
