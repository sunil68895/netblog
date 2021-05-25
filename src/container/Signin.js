import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../App";
import {API} from '../helper/Keys.js'

export default function Signin() {
  const {state, dispatch} = useContext(UserContext);

  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");

  const history = useHistory();
  const PostData = () => {
    console.log("burrah");
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
    fetch(`${API}/signin`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
        } else {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          M.toast({
            html: "signed in successfully",
            classes: "#43a047 green darken-1",
          });
          history.push("/");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div style={{height:`${window.innerHeight-140}px`}}>
    
    <div className="mycard">
      <div className="card auth-card input-field" style={{borderRadius:'20px'}}>
        <h2 style={{color:'#ad1457'}}>NetBlog</h2>
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
        <button
          className="btn waves-effect waves-light "
          onClick={() => PostData()}
        >
          Login
        </button>
        <h6>
          <Link to="/signup"><div style={{color:'#ad1457'}}>Don't have an account</div></Link>
        </h6>
      </div>
    </div>
    </div>
    );
}
