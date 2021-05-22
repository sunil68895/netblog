import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../App";

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
    fetch("/signin", {
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
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>NetBlog</h2>
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
          className="btn waves-effect waves-light #e040fb purple accent-2 "
          onClick={() => PostData()}
        >
          Login
        </button>
        <h6>
          <Link to="/signup">Don't have an account</Link>
        </h6>
      </div>
    </div>
  );
}
