import React from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

function Likes({ isLiked, likeCount, onLikeToggle }) {
  return (
    <div className="post-actions">
      {isLiked ? (
        <AiFillHeart
          className="text-danger action-icon"
          onClick={onLikeToggle}
        />
      ) : (
        <AiOutlineHeart className="action-icon" onClick={onLikeToggle} />
      )}
      <span>{likeCount || 0}</span>
    </div>
  );
}

export default Likes;
