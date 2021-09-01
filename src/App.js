import React, { useEffect, createContext, useReducer, useContext } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import "./App.css";
import Home from "../src/container/Home";
import Signin from "../src/container/Signin";
import Profile from "../src/container/Profile";
import Signup from "../src/container/Signup";
import Createpost from "../src/container/CreatePost";
import UserProfile from "../src/container/UserProfile";
import SubscribePosts from "../src/container/SubscribePosts";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import { initialState, reducer } from "./reducers/userReducers";

export const UserContext = createContext();
const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      history.push("/signin");
    }
  }, []);
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/signin" component={Signin} />
      <Route path="/signup" component={Signup} />
      <Route exact path="/profile" component={Profile} />
      <Route path="/createpost" component={Createpost} />
      <Route path="/mysubscribeposts" component={SubscribePosts} />
      <Route path="/profile/:userid" component={UserProfile} />
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <Router>
        <Navbar />
        <Routing />
      </Router>
    </UserContext.Provider>
  );
}

export default App;
