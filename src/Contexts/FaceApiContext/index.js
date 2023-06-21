import { LabeledFaceDescriptors } from "face-api.js";
import React, { useContext, useReducer } from "react";
import { FaceApiReducer } from "./reducer";
const FaceApiStateContext = React.createContext();
const FaceApiDispatchContext = React.createContext();

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

export const initialFaceApiState = {
  FaceApi: null,
  LabeledDescriptors: labeledDescriptors,
  loadedNeededModels: false,
  loading: false,
  errorMessage: null,
};

export function useFaceApiState() {
  const context = useContext(FaceApiStateContext);
  if (context === undefined) {
    throw new Error("useFaceApiState must be used within a FaceApiProvider");
  }
  return context;
}

export function useFaceApiDispatch() {
  const context = useContext(FaceApiDispatchContext);
  if (context === undefined) {
    throw new Error("useFaceApiDispatch must be used within a FaceApiProvider");
  }
  return context;
}

export const FaceApiProvider = ({ children }) => {
  const [FaceApi, FaceApiDispatch] = useReducer(
    FaceApiReducer,
    initialFaceApiState
  );

  return (
    <FaceApiStateContext.Provider value={FaceApi}>
      <FaceApiDispatchContext.Provider value={FaceApiDispatch}>
        {children}
      </FaceApiDispatchContext.Provider>
    </FaceApiStateContext.Provider>
  );
};
