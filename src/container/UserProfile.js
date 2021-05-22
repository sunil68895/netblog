import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../App";
export default function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  console.log(userid);
  useEffect(() => {
    fetch(`/user/${userid}`, {
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
    fetch("/follow", {
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
    fetch("/unfollow", {
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
            src={userProfile.user.profilePicture}
            alt=""
          />
        </div>
        <div>
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

          {!userProfile.user.followers.includes(state._id) ? (
            <button
              className="btn waves-effect waves-light #e040fb purple accent-2 "
              onClick={() => followUser()}
            >
              follow
            </button>
          ) : (
            <button
              className="btn waves-effect waves-light #e040fb purple accent-2 "
              onClick={() => unfollowUser()}
            >
              unfollow
            </button>
          )}
        </div>
      </div>
      <div className="gallery">
        {userProfile.posts.map((post, index) => {
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
