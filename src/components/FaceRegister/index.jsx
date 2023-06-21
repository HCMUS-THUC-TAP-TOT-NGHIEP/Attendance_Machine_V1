import React from "react";
import { Outlet } from "react-router";
import FaceRegistrationPage from "./FaceRegistrationPage";
import { Layout } from "antd";

const FaceRegistrationIndex = (props) => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export  {FaceRegistrationIndex,  FaceRegistrationPage} ;

