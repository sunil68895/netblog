import React, { useContext, useRef, useEffect, useState } from "react";
import { UserContext } from "../App";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import {API} from '../helper/Keys.js'

export default function Navbar() {
  const searchModal = useRef(null);
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);
  const renderList = () => {
    if (state) {
      return [
        <li key="1" >
          <i
            data-target="modal1"
            className="large material-icons modal-trigger"
            style={{ color: "white", cursor:'pointer' }}
          >
            search
          </i>
        </li>,
        <li key="2">
        <Link to="/"><div style={{color:'white'}}>All Posts</div></Link>
      </li>,
        <li key="3">
          <Link to="/mysubscribeposts"><div style={{color:'white'}}>myPosts</div></Link>
        </li>,
        <li key="4">
          <Link to="/createpost"><div style={{color:'white'}}>Create</div></Link>
        </li>,
        <li key="5">
          <Link to="/profile"><div style={{color:'white'}}>Profile</div></Link>
        </li>,
        <li key="6">
          <button
            style={{borderRadius:'20px', backgroundColor:'#546e7a'}}
            className="btn"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/signin");
            }}
          >
            Logout
          </button>
          
        </li>,
      ];
    } else {
      return [
        <li key="7">
          <Link to="/signin"><div style={{color:'white'}}>Login</div></Link>
        </li>,
        <li key="8">
          <Link to="/signup"><div style={{color:'white'}}>Signup</div></Link>
        </li>,
      ];
    }
  };

  const fetchUsers = (query) => {
    setSearch(query);
    fetch(`${API}/search-users`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    })
      .then((res) => res.json())
      .then((results) => {
        setUserDetails(results.user);
      });
  };

  return (
    <nav style={{height:'60px'}}>
      <div className="nav-wrapper" style={{backgroundColor:'#546e7a'}}>
        <Link
          to={state ? "/" : "/signin"}
          className="brand-logo left"
          style={{ marginLeft: "50px"}}
        >
        <div style={{color:'white'}}>NetBlog</div>
        </Link>
        <ul id="nav-mobile" className="right" style={{ marginRight: "40px" }}>
          {renderList()}
        </ul>
      </div>
        
      <div
        id="modal1"
        className="modal"
        ref={searchModal}
        style={{ color: "black" }}
      >
        <div className="modal-content">
          <input
            type="text"
            placeholder="search users"
            value={search}
            onChange={(e) => fetchUsers(e.target.value)}
          />
          <ul
            className="collection"
            style={{ color: "#ad1457", display:'grid' }}
          >
            { state!=null ? userDetails.map((item) => {
              return (
                <Link
                  to={item._id!== state._id? "/profile/" + item._id : '/profile'}
                  onClick={() => {
                    M.Modal.getInstance(searchModal.current).close()
                    setSearch('')
                  }}
                >
                  <li className="collection-item">{item.email}</li>
                </Link>
              );
            }):null}
          </ul>
        </div>
        <div className="modal-footer">
          <Link
            href="/"
            className="modal-close waves-effect waves-green btn-flat"
            onClick={() => setSearch("")}
          >
            close
          </Link>
        </div>
      </div>
    </nav>
  );
}
