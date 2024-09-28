import React, { useState } from "react";
import { MakeAuthRequests } from "./authRequest";

function AddPosts({ navigate }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const postData = {
      title: title,
      content: content,
    };

    try {
      const response = await MakeAuthRequests(
        "http://127.0.0.1:5555/posts",
        "POST",
        postData,
        navigate
      );

      if (response) {
        setSuccess("Post created successfully!");
        setTitle("");
        setContent("");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "An error occurred");
    }
  };

  return (
    <div>
      <h1>Add a New Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <button type="submit">Add Post</button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
}

export default AddPosts;
