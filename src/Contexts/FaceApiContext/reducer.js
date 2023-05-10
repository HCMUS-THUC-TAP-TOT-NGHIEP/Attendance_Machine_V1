import { LabeledFaceDescriptors } from "face-api.js";
var jlabeledDescriptors = localStorage.getItem("labeledDescriptors")
  ? JSON.parse(localStorage.getItem("labeledDescriptors"))
  : [];
var labeledDescriptors = jlabeledDescriptors.map(
  (jObject) =>
    new LabeledFaceDescriptors(
      jObject.label,
      jObject.descriptors.map((d) => new Float32Array(d))
    )
);

export const initialState = {
  FaceApi: null,
  LabeledDescriptors: labeledDescriptors,
  loadedNeededModels: false,
  loading: false,
  errorMessage: null,
};

export const FaceApiReducer = (initialState, action) => {
  switch (action.type) {
    case "REQUEST_LOADING":
      return {
        ...initialState,
        loading: true,
      };
    case "LOADING_SUCCESS":
      return {
        ...initialState,
        FaceApi: action.payload.FaceApi,
        loadedNeededModels: true,
        loading: false,
      };
    case "LOADING_ERROR":
      return {
        ...initialState,
        loading: false,
        errorMessage: action.error,
      };
    case "MODIFY_LABELED_DESCRIPTORS":
      return {
        ...initialState,
        FaceApi: action.payload.FaceApi,
        LabeledDescriptors: action.payload.labeledDescriptors,
        loadedNeededModels: true,
        loading: false,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
