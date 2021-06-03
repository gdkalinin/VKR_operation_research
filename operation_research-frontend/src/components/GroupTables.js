import React, {useState} from 'react'
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

const permissions = [
    {value: 1, label: 'User'},
    {value: 2, label: 'Moderator'},
   {value: 3, label: 'Admin'}
]

const fields = ['id','description']

const GroupTemplate = (props) => {
  const {groups} = props;
  const [openNew, setOpenNew] = useState(false)
  const [currentId, setCurrentId] = useState('')
  const [currentDescription, setCurrentDescription] = useState('')


  const dispatch = useDispatch()
  const clearState = () => {
      setOpenNew(false)
      setCurrentId('')
      setCurrentDescription('')
  }
  return (
      <div>
        {openNew && <Dialog open={openNew} onClose={() => clearState()}
                            aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{currentId === '' ? 'Create new group' : 'User #' + currentId}:
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Name"
                    value={currentDescription}
                    type="text"
                    onChange={(e) => {setCurrentDescription(e.target.value)
                    }}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => clearState()} color="primary">
                    Cancel
                </Button>
                {currentId !== '' && <Button onClick={() => clearState()} color="danger">
                    Delete group
                </Button>}
                <Button onClick={() =>
                {}} color="primary">
                    Save group
                </Button>
            </DialogActions>
        </Dialog>}
    <div style={{width: '1100px'}}>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
            <div style={{display: 'flex'}}>
                                <h1>Groups</h1>
            <CFormGroup style={{float:'right', marginRight: '30px'}} className="form-actions" >
                </CFormGroup>
            </div>
            </CCardHeader>

            <CCardBody>

            <CDataTable
              items={groups}
              fields={fields}
              hover
              clickableRows={true}
              onRowClick={(e) => {
                  setCurrentDescription(e.description)
                  setCurrentId(e.id)
                  setOpenNew(true)
              }}
              striped
              bordered
              size="sm"
              itemsPerPage={10}
              pagination
            />
            </CCardBody>
              <CButton onClick={() => setOpenNew(true)}  type="submit" size="sm" color="secondary">Create new group</CButton>
          </CCard>
        </CCol>
      </CRow>
    </div>
      </div>
  )
}


function mapStateToProps(state) {
  const { groups } = state.groups
  return {
    groups
  };
}

const connectedTables = connect(mapStateToProps)(GroupTemplate);
export { connectedTables as GroupTables };