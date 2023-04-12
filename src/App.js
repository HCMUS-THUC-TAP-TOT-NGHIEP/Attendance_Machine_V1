import { Layout } from "antd";
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

function App() {
  return (
    <Layout style={{ height: "100vh" }}>
      <Content>
        <Routes>
          <Route exact path="/" element={<AutoAttendanceCheck />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/face" element={<FaceRegistrationIndex />}>
            <Route
              path="/face/registration"
              element={<FaceRegistrationPage />}
            />
          </Route>
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </Content>
      <MyFooter />
    </Layout>
  );
}

export default App;
