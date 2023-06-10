import { Layout, notification } from "antd";
import { Content } from "antd/es/layout/layout";
import { Route, Routes } from "react-router";
import { AuthProvider, FaceApiProvider } from "./Contexts";
import LoginPage from "./components/Authentication/Login";
import { AutoAttendanceCheck } from "./components/AutoAttendanceCheck";
import {
  FaceRegistrationIndex,
  FaceRegistrationPage,
} from "./components/FaceRegister";
import MyFooter from "./components/layouts/MyFooter";
import MyHeader from "./components/layouts/MyHeader";
import NoMatch from "./components/layouts/NoMatch";

function App() {
  const [notify, contextHolder] = notification.useNotification({
    maxCount: 5,
  });

  return (
    <AuthProvider>
      <FaceApiProvider>
        <Layout style={{ height: "100vh" }}>
          <MyHeader />
          <Content>
            <Routes>
              <Route
                exact
                path="/"
                element={<AutoAttendanceCheck notify={notify} />}
              />
              <Route path="/login" element={<LoginPage notify={notify} />} />
              <Route
                path="/face"
                element={
                  <FaceRegistrationIndex notify={notify} adminRequired={true} />
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
              <Route path="*" element={<NoMatch notify={notify} />} />
            </Routes>
          </Content>
          <MyFooter />
          {contextHolder}
        </Layout>
      </FaceApiProvider>
    </AuthProvider>
  );
}
export default App;
