import * as FaceApi from "face-api.js";

const loadModels = async (dispatch) => {
  try {
    dispatch({ type: "REQUEST_LOADING" });
    console.log("Loading models...");
    await Promise.all([FaceApi.nets.tinyFaceDetector.loadFromUri("/models")]);
    dispatch({ type: "LOADING_SUCCESS", payload: { FaceApi: FaceApi } });
  } catch (err) {
    console.error("loadModels", err);
    dispatch({ type: "LOADING_ERROR", error: err });
  } finally {
    console.log("Finish Loading models...");
  }
};
export { loadModels };
