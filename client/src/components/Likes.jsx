import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

function Likes({ isLiked, likeCount, onLikeToggle }) {
  return (
    <div className="post-actions">
      <FontAwesomeIcon
        icon={faHeart}
        className={`action-icon ${isLiked ? "liked" : ""}`}
        style={{ color: isLiked ? "red" : "aqua" }}
        onClick={onLikeToggle}
      />
      <span>{likeCount || 0}</span>
    </div>
  );
}

export default Likes;
