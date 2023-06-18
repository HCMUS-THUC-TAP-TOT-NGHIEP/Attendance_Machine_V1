import { Layout, notification } from "antd";
import { Content } from "antd/es/layout/layout";
import { Route, Routes } from "react-router";
import { AuthProvider, FaceApiProvider } from "./Contexts";
import LoginPage from "./components/Authentication/Login";
import {
  AutoAttendanceCheck,
  RecognitionByImagesComponent,
} from "./components/AttendanceCheck";
import {
  FaceRegistrationIndex,
  FaceRegistrationPage,
} from "./components/FaceRegister";
import MyFooter from "./components/layouts/MyFooter";
import MyHeader from "./components/layouts/MyHeader";
import NoMatch from "./components/layouts/NoMatch";
import { useRef } from "react";

function App() {
  const [notify, contextHolder] = notification.useNotification({
    maxCount: 5,
  });
  const webcamRef = useRef(null);
  return (
    <AuthProvider>
      <FaceApiProvider>
        <Layout style={{ height: "100vh" }}>
          <MyHeader webcamRef={webcamRef} />
          <Layout>
            <Content>
              <Routes>
                <Route
                  exact
                  path="/"
                  element={
                    <AutoAttendanceCheck
                      notify={notify}
                      webcamRef={webcamRef}
                    />
                  }
                />
                <Route path="/login" element={<LoginPage notify={notify} />} />
                <Route
                  path="/face"
                  element={
                    <FaceRegistrationIndex
                      notify={notify}
                      adminRequired={true}
                    />
                  }
                >
                  <Route
                    path="/face/registration"
                    element={
                      <FaceRegistrationPage
                        notify={notify}
                        adminRequired={true}
                      />
                    }
                  />
                </Route>
                <Route
                  path="/recognition/image"
                  element={<RecognitionByImagesComponent />}
                ></Route>
                <Route path="*" element={<NoMatch notify={notify} />} />
              </Routes>
            </Content>
          </Layout>
          <MyFooter />
          {contextHolder}
        </Layout>
      </FaceApiProvider>
    </AuthProvider>
  );
}
export default App;
