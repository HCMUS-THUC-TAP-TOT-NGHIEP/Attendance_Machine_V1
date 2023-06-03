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
    dispatch({ type: "REQUEST_LOADING" });
    console.log("Loading models...");
    await FaceApi.nets.tinyFaceDetector.loadFromUri("/models");
    await FaceApi.nets.faceExpressionNet.loadFromUri("/models");
    await FaceApi.nets.faceLandmark68Net.loadFromUri("/models");
    await FaceApi.nets.ssdMobilenetv1.loadFromUri("/models");
    await FaceApi.nets.faceRecognitionNet.loadFromUri("/models");

    // await FaceApi.loadTinyFaceDetectorModel(Config.FaceApiModelFolder);
    // await FaceApi.loadSsdMobilenetv1Model(Config.FaceApiModelFolder);
    // await FaceApi.loadFaceExpressionModel(Config.FaceApiModelFolder);
    // await FaceApi.loadFaceLandmarkTinyModel(Config.FaceApiModelFolder);
    // await FaceApi.loadFaceLandmarkModel(Config.FaceApiModelFolder);
    // await FaceApi.loadFaceDetectionModel(Config.FaceApiModelFolder);
    // await FaceApi.loadFaceRecognitionModel(Config.FaceApiModelFolder);

    dispatch({ type: "LOADING_SUCCESS", payload: { FaceApi: FaceApi } });
  } catch (err) {
    console.error("loadModels", err);
    dispatch({ type: "LOADING_ERROR", error: err });
  } finally {
    console.log("Finish Loading models...");
  }
};
export { loadModels };
