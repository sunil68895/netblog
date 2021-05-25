import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import {API} from '../helper/Keys.js'

export default function Signup() {
  const history = useHistory();
  const [name, SetName] = useState("");
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);

  useEffect(() => {
    if (url) {
      uploadFields();
    }
  }, [url]);

  const uploadPic = () => {
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
        setUrl(data.url);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const uploadFields = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      return M.toast({
        html: "Invalid Email",
        classes: "#c62828 red darken-3",
      });
    }
    fetch(`${API}/signup`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        password,
        email,
        pic: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
        } else {
          M.toast({
            html: "saved successfully",
            classes: "#43a047 green darken-1",
          });
          history.push("./signin");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const PostData = () => {
    if (image) {
      uploadPic();
    } else {
      uploadFields();
    }
  };

  return (
    <div style={{ height: `${window.innerHeight - 140}px` }}>
      <div className="mycard">
        <div
          className="card auth-card input-field"
          style={{ borderRadius: "20px" }}
        >
          <h2 style={{ color: "#ad1457" }}>NetBlog</h2>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => SetName(e.target.value)}
          />
          <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => SetEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => SetPassword(e.target.value)}
          />
          <div className="file-field input-field">
            <div className="btn waves-effect waves-light ">
              <span>Upload Image</span>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>
          <button
            className="btn waves-effect waves-light "
            onClick={() => PostData()}
          >
            Signup
          </button>
          <h6>
            <Link to="/signin"><div style={{color:'#ad1457'}}>Already have an account</div></Link>
          </h6>
        </div>
      </div>
    </div>
  );
}
