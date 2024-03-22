import React from "react";
import classes from "./Posts.module.css";
import { Form, useFetcher } from "react-router-dom";

const Posts = ({ posts, Link, setShowFeedForm, setMethod, setFeedId }) => {
  const submit = useFetcher().submit;

  return (
    <div className={classes.post}>
      {posts &&
        posts.map((post) => {
          const createdPost = new Date(post?.createdAt);
          return (
            <div key={post?._id}>
              <p>{`Posted by ${
                post?.userId?.username
              } on ${createdPost.getDate()}/${
                createdPost.getMonth() + 1
              }/${createdPost.getFullYear()}`}</p>
              <h2>{post?.title}</h2>
              <div>
                <Link to={`${post?._id}`}>View</Link>
                <button
                  onClick={() => {
                    setShowFeedForm(true);
                    setMethod("patch");
                    setFeedId(`${post?._id}`);
                  }}
                >
                  Edit
                </button>

                <Form
                  onSubmit={(e) => {
                    e.preventDefault();

                    if (
                      window.confirm("Are you sure when deleting this post?")
                    ) {
                      submit(null, {
                        method: "delete",
                        action: `/feed/${post?._id}`,
                      });
                    }
                  }}
                >
                  <button type="submit">Delete</button>
                </Form>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Posts;
