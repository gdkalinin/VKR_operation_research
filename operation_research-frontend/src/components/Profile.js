import React, {useState} from "react";
import { Redirect } from 'react-router-dom';
import { useSelector } from "react-redux";
import {CButton} from "@coreui/react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import Input from "react-validation/build/input";
import TextField from "@material-ui/core/TextField";

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const Profile = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [openPassword, setOpenPassword] = useState(false)
    const [password, setPassword] = useState("");
  const [passwordSecond, setPasswordSecond] = useState("");
    const [oldPassword, setOldPassword] = useState("");

  const clearState = () => {
      setOpenPassword(false)
      setPassword('')
  }
  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{currentUser.user.lastname + ' ' + currentUser.user.firstname}</strong>
        </h3>
      </header>
        {openPassword && <Dialog open={openPassword} onClose={() => {
            setOpenPassword(false)
                setPassword('')}}
                             aria-labelledby="form-dialog-title">
            <DialogTitle>Create new test
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Old password"
                    value={password}
                    type="password"
                    onChange={(e) => {setPassword(e.target.value)
                    }}
                    fullWidth
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="New password"
                    value={password}
                    type="password"
                    onChange={(e) => {setPassword(e.target.value)
                    }}
                    fullWidth
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Repeat new password"
                    value={password}
                    type="password"
                    onChange={(e) => {setPassword(e.target.value)
                    }}
                    fullWidth
                />
            </DialogContent><DialogActions>
                <Button onClick={() => clearState()} color="primary">
                    Cancel
                </Button>
                <Button onClick={() =>
                {clearState()
                }} color="primary">
                    Create
                </Button>
            </DialogActions></Dialog>}
      <p>
        <strong>Email:</strong> {currentUser.user.email}
      </p>
        <p>
            <strong>Role:</strong> {currentUser.user.permissions_id === 1 ? 'Student' : currentUser.user.permissions_id === 2 ? 'Teacher' : 'Admin'}
        </p>
        <p>
            <strong>Group:</strong> {currentUser.user.group_id}
        </p>
                <CButton color='primary' onClick={() => {setOpenPassword(true)}}>Change password</CButton>

    </div>
  );
};

export default Profile;
