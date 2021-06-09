import React, {useEffect, useState} from 'react'
import {    createUser } from '../services/admin.service'
import {
  CBadge, CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable, CFormGroup,
  CRow
} from '@coreui/react'

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import {connect, useDispatch} from "react-redux";
import {getUsers} from "../actions/users";
import {getGroups} from "../actions/groups";

const permissions = [
    {value: 1, label: 'User'},
    {value: 2, label: 'Moderator'},
   {value: 3, label: 'Admin'}
]

const fields = ['name', 'second_name', 'email','permissions', 'active', 'group']

const TablesTemplate = (props) => {
  const {users, groups} = props;
  const [openNew, setOpenNew] = useState(false)
  const [active, setActive] = useState(false)
  const [currentId, setCurrentId] = useState('')
  const [currentName, setCurrentName] = useState('')
  const [secondName, setSecondName] = useState('')
  const [currentEmail, setCurrentEmail] = useState('')
  const [currentPermissions, setCurrentPermissions] = useState('')
  const [currentGroups, setCurrentGroups] = useState(null)


  const dispatch = useDispatch()
  const clearState = () => {
      setOpenNew(false)
      setCurrentId('')
      setCurrentName('')
      setCurrentPermissions('')
      setCurrentEmail('')
      setActive(false)
      setSecondName('')
      setCurrentGroups(null)
  }
  console.log(currentPermissions)
  return (
      <div>

        {openNew && <Dialog open={openNew} onClose={() => clearState()}

                            aria-labelledby="form-dialog-title">
                                        <DialogTitle id="form-dialog-title">{currentId === '' ? 'Create new user' : 'User #' + currentId}:
                                        </DialogTitle>
                                        <DialogContent>
                                                <TextField
                                                autoFocus
                                                margin="dense"
                                                id="name"
                                                label="Name"
                                                value={currentName}
                                                type="text"
                                                onChange={(e) => {setCurrentName(e.target.value)
                                                }}
                                                fullWidth
                                              />
                                              <TextField
                                                autoFocus
                                                margin="dense"
                                                id="Second name"
                                                label="Second name"
                                                value={secondName}
                                                type="text"
                                                onChange={(e) => {setSecondName(e.target.value)
                                                }}
                                                fullWidth
                                              />
                                              <TextField
                                                autoFocus
                                                margin="dense"
                                                value={currentEmail}
                                                id="email"
                                                label="Email"
                                                type="email"
                                                onChange={(e) => {setCurrentEmail(e.target.value)
                                                }}
                                                fullWidth
                                              />
                                              <TextField
                                                  select={true}
                                                  fullWidth
                                                value={
                                                  permissions.find(value => value.value === currentPermissions)}
                                                  onChange={(e) => {
                                                    console.log(e.target.value['value'])
                                                    setCurrentPermissions(e.target.value['value'])
                                                }}
                                                autoFocus
                                                  SelectProps={{
                                                      MenuProps: {
                                                      },
                                                      renderValue: option => option.label
                                                  }}
                                                  helperText="Permissions"
                                                  margin="normal"
                                              >
                                                  {permissions.map(option => (
                                                      <MenuItem key={option.value} value={option}>
                                                          {option.label} ({option.value})
                                                      </MenuItem>
                                                  ))}
                                              </TextField>
                                          <TextField
                                                  select={true}
                                                  fullWidth
                                                value={
                                                  groups.find(value => value.id === currentGroups)}
                                                  onChange={(e) => {
                                                    setCurrentGroups(e.target.value['id'])
                                                }}
                                                autoFocus
                                                  SelectProps={{
                                                      MenuProps: {
                                                      },
                                                      renderValue: option => option.description
                                                  }}
                                                  helperText="Group"
                                                  margin="normal"
                                              >
                                                  {groups.map(option => (
                                                      <MenuItem key={option.id} value={option}>
                                                          {option.description} ({option.id})
                                                      </MenuItem>
                                                  ))}
                                              </TextField>

                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={() => clearState()} color="primary">
                                            Cancel
                                          </Button>
                                          {currentId !== '' && <Button onClick={() => clearState()} color="danger">
                                            Delete user
                                          </Button>}
                                          {currentId !== '' && <Button onClick={() => clearState()} color="primary">
                                            {active === true ? 'Disable user' : 'Activate user'}
                                          </Button>}
                                          <Button onClick={() =>
                                          {
                                              createUser(currentName, secondName, currentEmail, '1234567', currentPermissions, currentGroups, false).then(r => clearState())
                                                    dispatch(getUsers())
                                          }} color="primary">
                                            Save
                                          </Button>
                                        </DialogActions>
                                    </Dialog>}
    <div style={{width: '1100px'}}>

      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
            <div style={{display: 'flex'}}>
                                <h1>Users</h1>
            <CFormGroup style={{float:'right', marginRight: '30px'}} className="form-actions" >
                </CFormGroup>
            </div>
            </CCardHeader>

            <CCardBody>

            <CDataTable
              items={users}
              fields={fields}
              hover
              clickableRows={true}
              onRowClick={(e) => {
                console.log(e)
                setCurrentEmail(e.email)
                setCurrentName(e.name)
                setSecondName(e.second_name)
                setCurrentPermissions(e.permissions)
                setCurrentId(e.id)
                setCurrentGroups(Number(e.group))
                setActive(e.active)
                setOpenNew(true)
              }}
               scopedSlots = {{
        'status':
          (item)=>(
            <td>
              <CBadge>
                {item.permissions}
              </CBadge>
            </td>
          )}}
              striped
              bordered
              size="sm"
              itemsPerPage={10}
              pagination
            />
            </CCardBody>
                  <CButton onClick={() => setOpenNew(true)}  type="submit" size="sm" color="secondary">Create new user</CButton>

          </CCard>

        </CCol>

      </CRow>

    </div>

      </div>
  )
}


function mapStateToProps(state) {
  const { users } = state.users;
  const { groups } = state.groups
  return {
    users, groups
  };
}

const connectedTables = connect(mapStateToProps)(TablesTemplate);
export { connectedTables as Tables };