import { Route, Routes } from "react-router";
import "./App.css";
import { FaceRegistrationIndex } from "./components/FaceRegister";
import LoginPage from "./components/Authentication/Login";
import NoMatch from "./components/layouts/NoMatch";
import { AutoAttendanceCheck } from "./components/AutoAttendanceCheck";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<AutoAttendanceCheck />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/face" element={<FaceRegistrationIndex />}>
        <Route path="/face/registration" element={<h2>Face Registration</h2>} />
      </Route>
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
}

export default App;
