import React, { useEffect } from "react";
import { Outlet, useLoaderData, useSubmit } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import { getTokenDuration } from "../utils/auth";

const Root = () => {
  const token = useLoaderData();
  const submit = useSubmit();

  useEffect(() => {
    if (!token) {
      delete axios.defaults.headers.common["Authorization"];
      return;
    }

    if (token === "TOKEN EXPIRED") {
      submit(null, { action: "/logout", method: "post" });
      delete axios.defaults.headers.common["Authorization"];
      return;
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const tokenDuration = getTokenDuration();

    setTimeout(() => {
      delete axios.defaults.headers.common["Authorization"];

      submit(null, { action: "/logout", method: "post" });
    }, tokenDuration);
  }, [token, submit]);

  const mainStyle = {
    margin: "0 auto",
    maxWidth: "1200px",
  };
  return (
    <React.Fragment>
      <Navbar />
      <main style={mainStyle}>
        <Outlet axios={axios} />
      </main>
    </React.Fragment>
  );
};

export default Root;
