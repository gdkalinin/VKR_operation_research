import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Router, Switch, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardUsers from "./components/BoardUsers";
import BoardAdmin from "./components/BoardAdmin";

import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";

import { history } from "./helpers/history";
import {ShowPresentation} from "./components/ShowPresentation";
import {PresentationsList} from "./components/Presentations";
import {TestList} from "./components/Tests"
import BoardGroups from "./components/BoardGroups";
import {CurrentTest} from "./components/Test";
import {GradesList} from "./components/Gradebook";

const App = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);

  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    history.listen((location) => {
      dispatch(clearMessage()); // clear message when changing location
    });
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      setShowModeratorBoard(currentUser.user.permissions_id !== 1);
    }
  }, [currentUser]);

  const logOut = () => {
    dispatch(logout());
  };

  return (
    <Router history={history}>
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <a  className="navbar-brand">
            Operation Research
          </a>
          <div className="navbar-nav mr-auto">
            {currentUser && <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li>}

            {showModeratorBoard && (
              <li className="nav-item">
                <Link to={"/users"} className="nav-link">
                  User Board
                </Link>
              </li>
            )}
            {showModeratorBoard && (
              <li className="nav-item">
                <Link to={"/groups"} className="nav-link">
                  Groups Board
                </Link>
              </li>
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.user.firstname + ' ' + currentUser.user.lastname}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile" component={Profile} />
            <Route path="/users" component={BoardUsers} />
            <Route path="/groups" component={BoardGroups} />
            <Route path="/admin" component={BoardAdmin} />
            <Route path="/presentation/:id" component={ShowPresentation} />
            <Route path="/presentations" component={PresentationsList} />
            <Route path="/tests" component={TestList} />
            <Route path="/test/:id" component={CurrentTest} />
            <Route path="/grades" component={GradesList} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
