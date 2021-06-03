import React, { useState, useEffect } from "react";
import {Tables} from "./Tables";
import {connect, useDispatch} from "react-redux";
import {getUsers} from "../actions/users";
import {getGroups} from "../actions/groups"


const BoardGroups = () => {
  const dispatch = useDispatch();
  useEffect(() => {
      dispatch(getUsers())
      dispatch(getGroups())
  }, []);

  return (
    <div className="container">
        <Tables/>
    </div>
  );
};



function mapStateToProps(state) {
}

export default connect(mapStateToProps)(BoardGroups);

