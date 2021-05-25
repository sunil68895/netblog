import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../App";
import {API} from '../helper/Keys.js'
export default function Profile() {
  const [myposts, setMyPosts] = useState([]);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch(`${API}/myposts`, {
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
    <div style={{height:`${window.innerHeight-80}px`}}>
    <div style={{backgroundColor:'#f48fb1' }}>
    <div style={{ maxWidth: "700px",margin: "10px auto" }}>
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
        <div className="file-field input-field" style={{margin:'auto 0px'}}>
          <div className="btn waves-effect waves-light ">
            <span>UPDATE PIC</span>
            <div style={{color:'white'}}>
            <input 
            type="file"
            onChange={(e) => updatePhoto(e.target.files[0])}
            />
            </div>
          </div>
            
        </div>

        <div style={{color:'#880e4f'}}>
          <h4>{state.name}</h4>
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
      <div style={{display:'flex', justifyContent:'center'}}>
      <i class="material-icons" style={{margin:'auto 2px',color:"#880e4f"}}>grid_on</i>
      <h6 style={{fontWeight:'bolder',color:'#880e4f'}}>Posts </h6>
      
      </div>
      <div className="gallery" style={{backgroundColor:"#f48fb1"}}>
        {myposts.map((post, index) => {
          return (
            <img classname="card-image" style={{margin:'10px'}}
              key={index}
              className="item"
              src={post.photo}
              alt={post.title}
            />
          );
        })}
      </div>
    </div>
   </div>
   </div>
    ) : (
    <h5>loading...</h5>
  );
}
