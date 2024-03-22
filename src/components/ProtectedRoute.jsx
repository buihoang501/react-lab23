import React from "react";

import { getAuthToken } from "../utils/auth";
import { Navigate } from "react-router-dom";

const ProtectedRoute = (props) => {
  const token = getAuthToken();

  if (token && token !== "TOKEN EXPIRED") {
    // return navigate("/");
    return <Navigate to="/"></Navigate>;
  }

  return <React.Fragment>{props.children}</React.Fragment>;
};

export default ProtectedRoute;
