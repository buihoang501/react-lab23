import React from "react";

const ErrorPage = () => {
  const errorPageStyle = {
    display: "flex",
    width: "100%",
    height: "100vh",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  };

  const errorContainer = {
    maxWidth: "1200px",

    border: "1px solid #157080",
    borderRadius: "6px",
    width: "300px",
    padding: "10px 5px",
    textAlign: "center",
  };
  return (
    <div style={errorPageStyle}>
      <div style={errorContainer}>
        <p>Something went wrong!</p> <h2>Page not found!</h2>
      </div>
    </div>
  );
};

export default ErrorPage;
