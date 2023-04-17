import { Layout, notification } from "antd";
import { Content } from "antd/es/layout/layout";
import { Route, Routes } from "react-router";
import LoginPage from "./components/Authentication/Login";
import { AutoAttendanceCheck } from "./components/AutoAttendanceCheck";
import {
  FaceRegistrationIndex,
  FaceRegistrationPage,
} from "./components/FaceRegister";
import MyFooter from "./components/layouts/MyFooter";
import NoMatch from "./components/layouts/NoMatch";
import MyHeader from "./components/layouts/MyHeader";

function App() {
  const [notify, contextHolder] = notification.useNotification();
  return (
    <Layout style={{ minHeight: "100vh" }}>
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
            element={<FaceRegistrationIndex notify={notify} />}
          >
            <Route
              path="/face/registration"
              element={<FaceRegistrationPage notify={notify} />}
            />
          </Route>
          <Route path="*" element={<NoMatch notify={notify} />} />
        </Routes>
      </Content>
      <MyFooter />
      {contextHolder}
    </Layout>
  );
}
export default App;
