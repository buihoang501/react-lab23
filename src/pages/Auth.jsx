import React from "react";
import AuthForm from "../components/AuthForm";

const Auth = ({ login }) => {
  return (
    <React.Fragment>
      <AuthForm login={login}></AuthForm>
    </React.Fragment>
  );
};

export default Auth;
