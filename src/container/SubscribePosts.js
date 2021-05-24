import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch("https://netblog-rest-server.herokuapp.com/getsubscribeposts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
      });
  }, []);
  const likePost = (_id) => {
    fetch("https://netblog-rest-server.herokuapp.com/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ postId: _id }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = posts.map((post) => {
          if (post._id == result._id) return result;
          else return post;
        });
        setPosts(newData);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const unlikePost = (_id) => {
    fetch("https://netblog-rest-server.herokuapp.com/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ postId: _id }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = posts.map((post) => {
          if (post._id == result._id) return result;
          else return post;
        });
        setPosts(newData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const makeComment = (text, postId) => {
    fetch("https://netblog-rest-server.herokuapp.com/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = posts.map((post) => {
          if (post._id == result._id) return result;
          else return post;
        });
        setPosts(newData);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const deletePost = (postId) => {
    fetch(`https://netblog-rest-server.herokuapp.com/deletepost/${postId}`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result._id);
        const newData = posts.filter((post) => {
          return post._id !== result._id;
        });
        setPosts(newData);
      });
  };

  return (
    <div className="Home">
      {posts.map((post, index) => {
        return (
          <div className="card home-card" key={index}>
            <h5>
              <Link
                to={
                  post.postedBy._id !== state._id
                    ? `/profile/${post.postedBy._id}`
                    : "/profile"
                }
              >
                {post.postedBy.name}
              </Link>{" "}
              {post.postedBy._id === state._id && (
                <i
                  className="material-icons"
                  style={{ float: "right" }}
                  onClick={() => {
                    deletePost(post._id);
                  }}
                >
                  delete
                </i>
              )}
            </h5>

            <div className="card-image">
              <img src={post.photo} alt=""></img>
            </div>
            <div className="card-content">
              <i className="material-icons">favorite</i>
              {post.likes.includes(state._id) ? (
                <i
                  className="material-icons"
                  onClick={() => {
                    unlikePost(post._id);
                  }}
                >
                  thumb_down
                </i>
              ) : (
                <i
                  className="material-icons"
                  onClick={() => {
                    likePost(post._id);
                  }}
                >
                  thumb_up
                </i>
              )}

              <h6>{post.likes.length} likes</h6>
              <h6>{post.title}</h6>
              <p>{post.body}</p>
              {post.comments.map((comment, index) => {
                return (
                  <h6 key={index}>
                    <span style={{ fontWeight: "bold" }}>
                      {comment.postedBy.name}
                    </span>
                    {` ${comment.text}`}
                  </h6>
                );
              })}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, post._id);
                }}
              >
                <input type="text" placeholder="add a comment"></input>
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
}
