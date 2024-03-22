import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import {
  Form,
  json,
  useActionData,
  useLoaderData,
  useNavigation,
  Link,
  useSearchParams,
  useFetcher,
} from "react-router-dom";
import axios from "axios";
import { getAuthToken } from "../utils/auth";
import classes from "./FeedForm.module.css";
import Posts from "./Posts";
import socket from "../utils/open-socket";
import API_URL from "../utils/url";

const FeedOverlay = ({ setShowFeedForm }) => {
  const clickOverlayHandler = () => {
    setShowFeedForm(false);
  };
  return (
    <div
      onClick={clickOverlayHandler}
      className={classes["feed-overlay"]}
    ></div>
  );
};

const FeedPopup = ({ method, setShowFeedForm, feedId, posts }) => {
  const data = useActionData();
  const navigation = useNavigation();
  const fetch = useFetcher();

  const [formValue, setFormValue] = useState({
    content: "",
    image: null,
    title: "",
  });

  let post;

  post =
    posts && posts?.length > 0 && posts.find((post) => post._id === feedId);

  let formValid = false;
  if (formValue.content && formValue.image && formValue.title) {
    formValid = true;
  }

  if (formValue.content && formValue.title && method === "patch") {
    formValid = true;
  }

  useEffect(() => {
    if (post) {
      setFormValue({
        content: post.content,
        title: post.title,
      });
    }
  }, []);

  const clickCancelHandler = () => {
    setShowFeedForm(false);
  };
  return (
    <div className={classes["feed-popup"]}>
      <fetch.Form
        action="/feed"
        method={method}
        encType="multipart/form-data"
        onSubmit={() => {
          if (formValid) {
            setShowFeedForm(false);
          }
        }}
      >
        <h1>New Post</h1>
        <div className={classes["form-group"]}>
          <div className={classes["form-control"]}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={method === "patch" ? post?.title : ""}
              onChange={(e) => {
                setFormValue((prevState) => {
                  return {
                    ...prevState,
                    title: e.target.value,
                  };
                });
              }}
            />
          </div>

          <div className={classes["form-control"]}>
            <label htmlFor="image">Image</label>
            <input
              accept="image/jpeg, image/jpg, image/png"
              type="file"
              id="image"
              name="image"
              defaultValue=""
              onChange={(e) => {
                setFormValue((prevState) => {
                  return {
                    ...prevState,
                    image: e.target.files[0],
                  };
                });
              }}
            />
            <p>Please choose an image</p>
          </div>
          <div className={classes.space}>
            {data &&
              data?.errors &&
              data?.errors?.length > 0 &&
              data?.errors?.map((error) => {
                return (
                  <p key={Math.random.toString()} className={classes.error}>
                    {error.msg}
                  </p>
                );
              })}
          </div>
          <div className={classes["form-control"]}>
            <label htmlFor="content">Content</label>
            <textarea
              name="content"
              id="content"
              cols="30"
              rows="5"
              defaultValue={method === "patch" ? post?.content : ""}
              onChange={(e) => {
                setFormValue((prevState) => {
                  return {
                    ...prevState,
                    content: e.target.value,
                  };
                });
              }}
            ></textarea>
          </div>
        </div>
        <div className={classes.actions}>
          <button type="button" onClick={clickCancelHandler}>
            Cancel
          </button>
          <button
            disabled={navigation.state === "submitting"}
            className={!formValid ? `${classes.disabled}` : ""}
            type="submit"
          >
            {post && post?._id && (
              <input type="hidden" name="feedId" value={post._id} />
            )}
            Accept
          </button>
        </div>
      </fetch.Form>
    </div>
  );
};

const FeedForm = () => {
  const [showFeedForm, setShowFeedForm] = useState(false);
  const [feedId, setFeedId] = useState("");
  const [method, setMethod] = useState("post");
  const data = useLoaderData();
  const [posts, setPosts] = useState(data?.posts || []);
  const [pageQuery, setPageQuery] = useSearchParams();
  let pageNumber = useRef(
    pageQuery.get("page") ? Number(pageQuery.get("page")) : 1
  );

  useEffect(() => {
    setPageQuery({
      page: pageQuery.get("page")
        ? Number(pageQuery.get("page"))
        : pageNumber.current,
    });
    const handleListener = (data) => {
      setPageQuery({
        page: pageQuery.get("page")
          ? Number(pageQuery.get("page"))
          : pageNumber.current,
      });

      if (data.action === "CREATE") {
        setPosts((prevPosts) => {
          if (prevPosts && prevPosts?.length > 0) {
            const rawPosts = [...prevPosts, data.post];

            const newPosts = rawPosts
              .sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
              })
              .slice(0, 2);
            return newPosts;
          } else {
            return [data.post];
          }
        });
      }
      if (data.action === "DELETE") {
        setPosts((prevPosts) => {
          return prevPosts.filter((post) => post._id !== data.id);
        });
      }

      if (data.action === "UPDATE") {
        setPosts((prevPosts) => {
          const updatedPosts = prevPosts.map((post) => {
            if (post._id === data.post._id) {
              post = data.post;
            }
            return post;
          });
          return updatedPosts;
        });
      }
    };
    socket.on("posts", handleListener);

    return () => {
      socket.off(("posts", handleListener));
    };
  }, []);
  const clickNewPostHandler = () => {
    setShowFeedForm(true);
    setMethod("post");
  };

  const handleNextPage = () => {
    if (pageNumber.current >= data?.pageSize) {
      return;
    }
    pageNumber.current += 1;
    setPageQuery({ page: pageNumber.current });
  };
  const handlePreviousPage = () => {
    if (pageNumber.current <= 1) {
      return;
    }
    pageNumber.current = pageNumber.current - 1;
    setPageQuery({ page: pageNumber.current });
  };

  useEffect(() => {
    setPosts(data?.posts);
  }, [data?.posts]);
  useEffect(() => {
    if (posts.length > 0) {
      setPageQuery({ page: pageNumber.current });
    }
  }, [posts.length, setPageQuery]);
  console.log(data?.posts);
  return (
    <div className={classes.feed}>
      <div className={classes.default}>
        <input type="text" defaultValue="I am new!" />
        <button>Update</button>
      </div>
      <button onClick={clickNewPostHandler}>New Post</button>
      {showFeedForm &&
        ReactDOM.createPortal(
          <FeedOverlay setShowFeedForm={setShowFeedForm} />,
          document.getElementById("feed-overlay")
        )}
      {showFeedForm &&
        ReactDOM.createPortal(
          <FeedPopup
            feedId={feedId}
            setShowFeedForm={setShowFeedForm}
            method={method}
            posts={posts}
          />,
          document.getElementById("feed-popup")
        )}
      <div className={classes.post}>
        {!posts && posts?.length === 0 ? (
          <p>No posts found</p>
        ) : (
          <Posts
            posts={posts}
            Link={Link}
            setMethod={setMethod}
            setShowFeedForm={setShowFeedForm}
            setFeedId={setFeedId}
          />
        )}
      </div>
      <Form
        action="/feed"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {pageQuery.get("page") > 1 && (
          <button onClick={handlePreviousPage} type="submit">
            Previous
          </button>
        )}
        {pageQuery.get("page") < data?.pageSize && (
          <button onClick={handleNextPage} type="submit">
            Next
          </button>
        )}
      </Form>
    </div>
  );
};

export default FeedForm;

export const action = async ({ request, params }) => {
  const data = await request.formData();
  const feedId = data.get("feedId");

  const dataSend = {
    title: data.get("title"),
    image: data.get("image"),
    content: data.get("content"),
  };

  let method = request.method;

  try {
    const token = getAuthToken();
    const response =
      method === "POST"
        ? await axios.post(`${API_URL}/feed`, dataSend, {
            headers: {
              "Content-Type": "multipart/form-data;",
              Authorization: `Bearer ${token}`,
            },
          })
        : await axios.patch(`${API_URL}/feed/${feedId}`, dataSend, {
            headers: {
              "Content-Type": "multipart/form-data;",
              Authorization: `Bearer ${token}`,
            },
          });
    return response.data;
  } catch (error) {
    if (error.response.status === 403) {
      alert("Your are not allowed to edit this post");
      return error.response.status;
    }
    if (error.response.status === 422) {
      return json(error.response.data);
    }
  }
  return null;
};

export const loader = async ({ request, params }) => {
  try {
    const token = getAuthToken();

    const page = new URL(request.url).searchParams.get("page") || 1;

    const response = await axios.get(`${API_URL}/feed?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
  return null;
};
