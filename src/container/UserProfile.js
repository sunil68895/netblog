import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../App";
import {API} from '../helper/Keys.js'
export default function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  console.log(userid);
  useEffect(() => {
    fetch(`${API}/user/${userid}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setUserProfile(result);
      });
  }, []);

  const followUser = () => {
    fetch(`${API}/follow`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setUserProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
      });
  };

  const unfollowUser = () => {
    fetch(`${API}/unfollow`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setUserProfile((prevState) => {
          const updatedFollowersList = prevState.user.followers.filter(
            (item) => item !== data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: updatedFollowersList,
            },
          };
        });
      });
  };

  return userProfile ? (
    <div style={{ height: `${window.innerHeight - 80}px`, cursor:'default' }}>
      <div
        style={{
          maxWidth: "700px",
          margin: "10px auto",
          backgroundColor: "#eceff1",
          
        }}
      >
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
              src={userProfile.user.profilePicture}
              alt=""
            />
          </div>
          <div style={{margin:'auto 0px'}}>
          {!userProfile.user.followers.includes(state._id) ? (
            <button
            className="btn waves-effect waves-light  "
            onClick={() => followUser()}
            >
            follow
            </button>
            ) : (
              <button
              className="btn waves-effect waves-light"
              onClick={() => unfollowUser()}
              >
              unfollow
              </button>
              )}
              </div>
              <div style={{color:'#880e4f'}}>
            <h4>{userProfile.user.name}</h4>
            <h6>{userProfile.user.email}</h6>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "108%",
              }}
            >
              <h6>{userProfile.posts.length} posts</h6>
              <h6>{userProfile.user.followers.length} followers</h6>
              <h6>{userProfile.user.following.length} following</h6>
            </div>
          </div>
        </div>

        <div style={{display:'flex', justifyContent:'center'}}>
        <i class="material-icons" style={{margin:'auto 2px',color:"#880e4f"}}>grid_on</i>
        <h6 style={{fontWeight:'bolder',color:'#880e4f'}}>Posts </h6>
        
        </div>


        <div className="gallery">
          {userProfile.posts.map((post, index) => {
            return (
              <img
              style={{margin:'10px'}}
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
  ) : (
    <h5>loading...</h5>
  );
}
