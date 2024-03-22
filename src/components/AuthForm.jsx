import React from "react";

import { Form, useActionData, json, redirect } from "react-router-dom";
import classes from "./AuthForm.module.css";
import API_URL from "../utils/url";

const AuthForm = ({ login }) => {
  const data = useActionData();
  const emailErrors = data?.errors?.filter((error) => error.path === "email");
  const usernameErrors = data?.errors?.filter(
    (error) => error.path === "username"
  );
  const passwordErrors = data?.errors?.filter(
    (error) => error.path === "password"
  );

  return (
    <div className={classes.auth}>
      <Form action={`${login ? "/login" : "/signup"}`} method="post" noValidate>
        {data?.message && <p className={classes.error}>{data?.message}</p>}
        <div className={classes["form-control"]}>
          <label htmlFor="email">Your E-Mail</label>
          <input type="email" id="email" name="email" />
          {emailErrors && emailErrors.length > 0 && (
            <p className={classes.error}>{emailErrors[0].msg}</p>
          )}
        </div>

        {!login && (
          <div className={classes["form-control"]}>
            <label htmlFor="username">Your Name</label>
            <input type="text" id="username" name="username" defaultValue="" />
            {usernameErrors && usernameErrors.length > 0 && (
              <p className={classes.error}>{usernameErrors[0].msg}</p>
            )}
          </div>
        )}

        <div className={classes["form-control"]}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            defaultValue=""
          />
          {passwordErrors && passwordErrors.length > 0 && (
            <p className={classes.error}>{passwordErrors[0].msg}</p>
          )}
        </div>
        <button type="submit">{login ? "Login" : "Signup"}</button>
      </Form>
    </div>
  );
};

export default AuthForm;

export const action = async ({ request, params }) => {
  const data = await request.formData();
  const path = window.location.href.includes("/login") ? "login" : "signup";
  const dataSend = {
    email: data.get("email"),
    password: data.get("password"),
    username: data.get("username"),
  };

  const emailInput = document.querySelector('[name="email"');
  const usernameInput = document.querySelector('[name="username"');
  const passwordInput = document.querySelector('[name="password"');

  try {
    const response = await fetch(`${API_URL}/auth/` + path, {
      headers: {
        "Content-Type": "application/json",
      },
      method: request.method,

      body: JSON.stringify(dataSend),
    });
    if (!response.ok && !response.status === 422) {
      return json({ message: "Internal Server Error" }, { status: 500 });
    }

    if (response.status === 201) {
      emailInput.value = "";
      if (usernameInput) {
        usernameInput.value = "";
      }
      passwordInput.value = "";
      const data = await response.json();
      const token = data.token;
      localStorage.setItem("token", token);
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 1);
      localStorage.setItem("expiration", expiration);
      return redirect("/");
    } else {
      return response;
    }
  } catch (error) {
    console.log(error);
  }

  return null;
};
