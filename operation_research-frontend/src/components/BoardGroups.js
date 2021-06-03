import React, { useState, useEffect } from "react";
import {GroupTables} from "./GroupTables";
import {connect, useDispatch} from "react-redux";
import {getUsers} from "../actions/users";
import {getGroups} from "../actions/groups"


const BoardUsers = () => {
  const dispatch = useDispatch();
  useEffect(() => {
      dispatch(getUsers())
      dispatch(getGroups())

  }, []);

  return (
    <div className="container">
        <GroupTables/>
    </div>
  );
};



function mapStateToProps(state) {
}

export default connect(mapStateToProps)(BoardUsers);

