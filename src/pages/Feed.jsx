import React from "react";
import FeedForm from "../components/FeedForm";
const Feed = ({ axios }) => {
  const centerStyle = {
    marginTop: "48px",
    textAlign: "center",
  };

  return (
    <div style={centerStyle}>
      <FeedForm />
    </div>
  );
};

export default Feed;
