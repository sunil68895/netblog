import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../App";
export default function Profile() {
  const [myposts, setMyPosts] = useState([]);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch("/myposts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setMyPosts(result.myposts);
      });
  }, []);
  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "netblog");
      data.append("cloud_name", "cloudy1");
      console.log(data);
      fetch("	https://api.cloudinary.com/v1_1/cloudy1/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              profilePicture: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result);
              localStorage.setItem(
                "user",
                JSON.stringify({
                  ...state,
                  profilePicture: result.profilePicture,
                })
              );
              dispatch({ type: "UPDATEPIC", payload: result.profilePicture });
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [image]);
  const updatePhoto = (file) => {
    setImage(file);
  };

  return state ? (
    <div style={{ maxWidth: "700px", margin: "10px auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "18px 0",
          borderBottom: "1px solid grey",
        }}
      >
        <div>
          <img
            style={{ width: "160px", height: "160px", borderRadius: "80px" }}
            src={state.profilePicture}
            alt=""
          />
        </div>
        <div className="file-field input-field">
          <div className="btn waves-effect waves-light #e040fb purple accent-2">
            <span>UPDATE PIC</span>
            <input
              type="file"
              onChange={(e) => updatePhoto(e.target.files[0])}
            />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>

        <div>
          <h5>{state.name}</h5>
          <h6>{state.email}</h6>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "108%",
            }}
          >
            <h6>{myposts.length} posts</h6>
            <h6>{state.followers.length} followers</h6>
            <h6>{state.following.length} following</h6>
          </div>
        </div>
      </div>
      <div className="gallery">
        {myposts.map((post, index) => {
          return (
            <img
              key={index}
              className="item"
              src={post.photo}
              alt={post.title}
            />
          );
        })}
      </div>
    </div>
  ) : (
    <h5>loading...</h5>
  );
}
