import { redirect } from "react-router-dom";

export const getTokenDuration = () => {
  const expiration = new Date(localStorage.getItem("expiration"));
  const now = new Date();
  const duration = expiration.getTime() - now.getTime();
  return duration;
};

export const getAuthToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }
  const tokenDuration = getTokenDuration();
  if (tokenDuration < 0) {
    return "TOKEN EXPIRED";
  }
  return token;
};

export const tokenLoader = () => {
  return getAuthToken();
};

export const checkAuthToken = () => {
  const token = getAuthToken();
  if (!token) {
    return redirect("/login");
  }
  return null;
};
