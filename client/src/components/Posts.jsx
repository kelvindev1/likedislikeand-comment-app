import React, { useEffect, useState } from "react";
import { MakeAuthRequests } from "./authRequest";
import Likes from "./Likes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faShare } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Posts.css";

const Posts = ({ navigate }) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  const toggleReadMore = (id) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id ? { ...post, isReadMore: !post.isReadMore } : post
      )
    );
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await MakeAuthRequests(
          "http://127.0.0.1:5555/posts",
          "GET",
          {},
          navigate
        );

        if (Array.isArray(data)) {
          const updatedPosts = data.map((post) => ({
            ...post,
            isReadMore: false,
            isLiked: post.isLiked || false,
          }));
          setPosts(updatedPosts);
          setError("");
        } else {
          throw new Error("Expected an array of posts");
        }
      } catch (err) {
        console.error(err);
        if (
          err.message.includes("Network Error") ||
          err.message.includes("ERR_CONNECTION_REFUSED")
        ) {
          setError("The server cannot be reached. Please try again later.");
        } else {
          setError("Server Not Responding. Please try again later.");
        }
      }
    };

    fetchPosts();
  }, [navigate]);

  const LikeAndDislike = async (postId) => {
    const postIndex = posts.findIndex((post) => post.id === postId);
    const post = posts[postIndex];

    const updatedPost = {
      ...post,
      like_count: post.isLiked
        ? (post.like_count || 0) - 1
        : (post.like_count || 0) + 1,
      isLiked: !post.isLiked,
    };

    setPosts((prevPosts) => {
      const newPosts = [...prevPosts];
      newPosts[postIndex] = updatedPost;
      return newPosts;
    });

    try {
      const response = await MakeAuthRequests(
        `http://127.0.0.1:5555/likes`,
        "POST",
        { post_id: postId },
        navigate
      );
      if (response.msg === "UnLiked") {
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.id === postId
              ? { ...p, like_count: (p.like_count || 0) - 1, isLiked: false }
              : p
          )
        );
      } else if (response.msg === "Liked") {
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.id === postId
              ? { ...p, like_count: (p.like_count || 0) + 1, isLiked: true }
              : p
          )
        );
      }
    } catch (error) {
      console.error("Failed to like/unlike post:", error);
      setPosts((prevPosts) => {
        const newPosts = [...prevPosts];
        newPosts[postIndex] = post;
        return newPosts;
      });
    }
  };

  const handleComment = (postId) => {
    console.log(`Comment on post ${postId}`);
  };

  const handleShare = (postId) => {
    console.log(`Shared post ${postId}`);
  };

  return (
    <div className="container">
      {error && <p className="error">{error}</p>}
      {posts.length === 0 && !error && <p>No posts available.</p>}
      <div className="row">
        {posts.map((post) => {
          const isLongContent = post.content.length > 80;
          const displayContent = post.isReadMore
            ? post.content
            : `${post.content.substring(0, 80)}...`;

          return (
            <div className="col-md-4" key={post.id}>
              <div className="card mb-4">
                <div className="card-body">
                  <h2 className="card-title">{post.title}</h2>

                  <p className="post-content">
                    {displayContent}
                    {isLongContent && (
                      <span
                        className="read-more"
                        onClick={() => toggleReadMore(post.id)}
                        style={{ color: "blue", cursor: "pointer" }}
                      >
                        {post.isReadMore ? " Show Less" : " Read More"}
                      </span>
                    )}
                  </p>

                  <p>
                    <strong>By:</strong> {post.userpost.username}
                  </p>

                  <Likes
                    isLiked={post.isLiked}
                    likeCount={post.like_count}
                    onLikeToggle={() => LikeAndDislike(post.id)}
                  />

                  <div className="post-actions">
                    <FontAwesomeIcon
                      icon={faComment}
                      className="action-icon"
                      onClick={() => handleComment(post.id)}
                    />
                    <FontAwesomeIcon
                      icon={faShare}
                      className="action-icon"
                      onClick={() => handleShare(post.id)}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Posts;
