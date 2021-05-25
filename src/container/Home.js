import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { API } from "../helper/Keys.js";
import { UserContext } from "../App";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch(`${API}/allpost`, {
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
    fetch(`${API}/like`, {
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
    fetch(`${API}/unlike`, {
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
    fetch(`${API}/comment`, {
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
    fetch(`${API}/deletepost/${postId}`, {
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
    <div style={{ height: `${window.innerHeight}px` }}>
      <div
        className="Home"
        style={{ backgroundColor: "#f48fb1", padding: "30px" }}
      >
        {posts.map((post, index) => {
          return (
            <div
              className="card home-card"
              style={{ padding: "10px", borderRadius: "30px" }}
              key={index}
            >
              <div
                style={{
                  padding: "5px",
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #ad1457",
                  margin: "0px 0px 10px 0px",
                }}
              >
                <h5 style={{ display: "flex" }}>
                  <Link
                    to={
                      post.postedBy._id !== state._id
                        ? `/profile/${post.postedBy._id}`
                        : "/profile"
                    }
                  >
                    <div style={{ color: "#ad1457", fontWeight: "bolder" }}>
                      {" "}
                      {post.postedBy.name}
                    </div>
                  </Link>{" "}
                </h5>
                <div style={{ margin: "auto 1px" }}>
                  {post.postedBy._id === state._id && (
                    <i
                      className="material-icons"
                      style={{ float: "right", color: "#ad1457" }}
                      onClick={() => {
                        deletePost(post._id);
                      }}
                    >
                      delete
                    </i>
                  )}
                </div>
              </div>

              <div className="card-image" style={{}}>
                <img src={post.photo} alt=""></img>
              </div>
              <div className="card-content">
                <i style={{ color: "#ad1457" }} className="material-icons">
                  favorite
                </i>
                {post.likes.includes(state._id) ? (
                  <i
                    style={{ color: "#ad1457" }}
                    className="material-icons"
                    onClick={() => {
                      unlikePost(post._id);
                    }}
                  >
                    thumb_down
                  </i>
                ) : (
                  <i
                    style={{ color: "#ad1457" }}
                    className="material-icons"
                    onClick={() => {
                      likePost(post._id);
                    }}
                  >
                    thumb_up
                  </i>
                )}

                <h6>{post.likes.length} likes</h6>
                <h6 key={index}>
                <div style={{overflowWrap:'anywhere'}}> 
                <span style={{ fontWeight: "bold", color: "#ad1457" }}>
                    caption-
                  </span>
                 
                  {` ${post.title}`}
                  </div>
                </h6>
                <div>
                  <p>
                  <div style={{ overflowWrap: "anywhere" }}>
                    <span style={{ fontWeight: "bold", color: "#ad1457" }}>
                      msg-
                    </span>
                    {post.body}</div>
                  </p>
                </div>
                <div style={{ margin: "4px 0px", color: "#ad1457" }}>
                  <span style={{ fontWeight: "bold" }}>comments-</span>
                </div>

                <div style={{ maxHeight: "100px", overflow: "scroll" }}>
                  <List>
                    {post.comments.map((comment, index) => {
                      return (
                        <ListItem key={index} dis>
                          <ListItemText
                            primary={
                              <h6 key={index}>
                                <span
                                  style={{
                                    fontWeight: "bold",
                                    color: "#ad1457",
                                  }}
                                >
                                  {comment.postedBy.name}
                                </span>
                                {` ${comment.text}`}
                              </h6>
                            }
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    makeComment(e.target[0].value, post._id);
                    e.target[0].value = "";
                  }}
                >
                  <input type="text" placeholder="add a comment"></input>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
