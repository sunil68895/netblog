import React, { useContext } from "react";
import { UserContext } from "../App";
import { Link, useHistory } from "react-router-dom";
export default function Navbar() {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const renderList = () => {
    if (state) {
      return [
        <li>
          <Link to="/mysubscribeposts">subPosts</Link>
        </li>,
        <li>
          <Link to="/createpost">Create</Link>
        </li>,
        <li>
          <Link to="/profile">Profile</Link>
        </li>,
        <button
          className="btn waves-effect waves-light #e040fb purple accent-2 "
          onClick={() => {
            localStorage.clear();
            dispatch({ type: "CLEAR" });
            history.push("/signin");
          }}
        >
          Logout
        </button>,
      ];
    } else {
      return [
        <li>
          <Link to="/signin">Login</Link>
        </li>,
        <li>
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    }
  };
  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? "/" : "/signin"} className="brand-logo left">
          NetBlog
        </Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
    </nav>
  );
}
