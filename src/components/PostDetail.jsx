import React from "react";
import axios from "axios";
import { useLoaderData } from "react-router-dom";
import classes from "./Posts.module.css";
import { getAuthToken } from "../utils/auth";
import API_URL from "../utils/url";

const PostDetail = () => {
  const data = useLoaderData();
  const createdPost = new Date(data.post.createdAt);

  return (
    <div className={classes["post-detail"]}>
      <div>
        <h2>{data.post.title}</h2>
        <p>{`Created by on ${createdPost.getDate()}/${
          createdPost.getMonth() + 1
        }/${createdPost.getFullYear()}`}</p>
        <div></div>
        <img src={`${API_URL}/${data.post.imageUrl}`} alt="Post View" />
        <p>{data.post.content}</p>
      </div>
    </div>
  );
};

export default PostDetail;

export const loader = async ({ request, params }) => {
  const token = getAuthToken();
  const feedId = params.feedId;
  try {
    const response = await axios.get(`${API_URL}/feed/` + feedId, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
  return null;
};

export const action = async ({ request, params }) => {
  const token = getAuthToken();

  const feedId = params.feedId;

  try {
    const response = await axios.delete(`${API_URL}/feed/` + feedId, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
    if (error.response.status === 403) {
      alert("You are not allowed to delete this post!");
    }
  }
  return null;
};
