import React, { useState } from "react";
import { CiFaceSmile } from "react-icons/ci";
import { AiFillHeart, AiOutlineHeart, AiOutlineComment } from "react-icons/ai";

function Try() {
  const [like, setLike] = useState(false);
  const [count, setCount] = useState(0);

  const toggleLike = () => {
    if (!like) {
      setLike(true);
      setCount(count + 1);
    } else {
      setLike(false);
      setCount(count - 1);
    }
  };

  return (
    <div className="container text-center">
      <h4>Title</h4>
      <h5>Likes: {count}</h5>
      <div
        className="card card-dark m-auto"
        style={{ width: 300, cursor: "pointer" }}
        onDoubleClick={toggleLike}
      >
        <div className="card-header fs-xl">
          <CiFaceSmile className="mr-2" />
          <small>Dog</small>
        </div>

        <img
          src="src/assets/dog.jpg"
          alt="Dog"
          style={{ width: 300, height: "fit-content" }}
        />

        <div
          className="card-footer fs-xl d-flex"
          style={{ justifyContent: "space-between" }}
        >
          <AiOutlineComment />
          {like ? (
            <AiFillHeart className="text-danger" onClick={toggleLike} />
          ) : (
            <AiOutlineHeart onClick={toggleLike} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Try;
