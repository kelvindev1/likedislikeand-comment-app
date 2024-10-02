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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await MakeAuthRequests(
          "http://127.0.0.1:5555/posts",
          "GET",
          {},
          navigate
        );

        const likesResponse = await MakeAuthRequests(
          "http://127.0.0.1:5555/likes",
          "GET",
          {},
          navigate
        );

        // Ensure likesResponse is an array before mapping
        const userLikes = Array.isArray(likesResponse)
          ? likesResponse.map((like) => like.post_id)
          : [];

        if (Array.isArray(data)) {
          const updatedPosts = data.map((post) => ({
            ...post,
            isReadMore: false,
            isLiked: userLikes.includes(post.id),
            like_count: userLikes.filter((like) => like === post.id).length,
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
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              like_count: post.isLiked
                ? Math.max(0, (post.like_count || 0) - 1)
                : (post.like_count || 0) + 1,
            }
          : post
      )
    );

    try {
      await MakeAuthRequests(
        `http://127.0.0.1:5555/likes`,
        "POST",
        { post_id: postId },
        navigate
      );
    } catch (error) {
      console.error("Failed to like/unlike post:", error);
    }
  };

  const toggleReadMore = (id) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id ? { ...post, isReadMore: !post.isReadMore } : post
      )
    );
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
            : `${post.content.substring(0, 80)}`;

          return (
            <div className="col-md-4" key={post.id}>
              <div
                className="card mb-4"
                onDoubleClick={() => LikeAndDislike(post.id)}
              >
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
