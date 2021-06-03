import React, {useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {
    CBreadcrumb,
    CBreadcrumbItem, CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CFormGroup,
    CRow, CSelect, CInputCheckbox
} from "@coreui/react";

import { createTest } from "../services/tests.service";
import {getTests} from "../actions/tests";
import { useHistory } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {createUser} from "../services/admin.service";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import {getGroups} from "../actions/groups";

const fields = ['id', 'description', 'assignee', 'start_date', 'finish_until', 'rating']

const TestsTemplate = (props) => {
      const {groups} = props;
    console.log(props.user)
    const [openTest, setOpenTest] = useState(false)
    const [numberLinear, setNumberLinear] = useState(0)
    const [numberSimplex, setNumberSimplex] = useState(0)
    const [numberGomori, setNumberGomori] = useState(0)
    const [numberEquipment, setNumberEquipment] = useState(0)
    const [numberJohnson, setNumberJohnson] = useState(0)
    const [numberInvestments, setNumberInvestments] = useState(0)
    const [theoreticalQuestionFirst, setTheoreticalQuestionFirst] = useState('')
    const [theoreticalQuestionSecond, setTheoreticalQuestionSecond] = useState('')
    const [rating, setRating] = useState(false)
    const [startDate, setStartDate] = useState('2021-05-24T10:30')
    const [endDate, setEndDate] = useState('2021-05-24T10:30')
    const [assignee, setAssignee] = useState('')
    const [description, setDescription] = useState('')
  const [currentGroups, setCurrentGroups] = useState(null)

    const clearState = () => {
        setOpenTest(false)
        setNumberLinear(0)
        setNumberSimplex(0)
        setNumberGomori(0)
        setNumberEquipment(0)
        setNumberJohnson(0)
        setNumberInvestments(0)
        setTheoreticalQuestionFirst('')
        setTheoreticalQuestionSecond('')
        setRating(false)
        setStartDate('2021-05-24T10:30')
        setEndDate('2021-05-24T10:30')
        setAssignee('')
        setDescription('')
    }
  const { tests } = props;
  const history = useHistory();
    return ( <div>
        <CBreadcrumb>
            <CBreadcrumbItem href="/home">Home
            </CBreadcrumbItem>
            <CBreadcrumbItem active>Tests
            </CBreadcrumbItem>
        </CBreadcrumb>
        <CButton color='primary' onClick={() => setOpenTest(true)}>Create a new test</CButton>
        {openTest && <Dialog open={openTest} onClose={() => clearState()}
                             aria-labelledby="form-dialog-title">
            <DialogTitle>Create new test
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Description"
                    value={description}
                    type="text"
                    onChange={(e) => {setDescription(e.target.value)
                    }}
                    fullWidth
                />
                {props.user.permissions_id !== 1 && <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Is rating?"
                    value={rating}
                    type="checkbox"
                    onChange={(e) => {setRating(!rating)
                    }}
                    fullWidth
                />}
                  {props.user.permissions_id !== 1 && <TextField
                      style={{float: 'center'}}
                    id="datetime-local"
                    label="Start time"
                    type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    defaultValue="2017-05-24T10:30"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />}
                 {props.user.permissions_id !== 1 &&  <TextField
                      style={{float: 'center'}}
                    id="datetime-local"
                    label="End time"
                    type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}                    InputLabelProps={{
                      shrink: true,
                    }}
                  />}
                {props.user.permissions_id !== 1 && <TextField
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
                                                  {groups.filter(value => value.id !== 1 && value.id !== 2).map(option => (
                                                      <MenuItem key={option.id} value={option}>
                                                          {option.description} ({option.id})
                                                      </MenuItem>
                                                  ))}
                                              </TextField>}
                <CSelect aria-label="Default select example" onChange={(e) => setNumberLinear(e.target.value)}>
                    <option>Graphical Tasks</option>
                    <option value="0">Zero Graphical</option>
                    <option value="1">One Graphical</option>
                    <option value="2">Two Graphical</option>
                    <option value="3">Three Graphical</option>
                </CSelect>
                <CSelect aria-label="Default select example" onChange={(e) => setNumberSimplex(e.target.value)}>
                    <option>Simplex Tasks</option>
                    <option value="0">Zero Simplex</option>
                    <option value="1">One Simplex</option>
                    <option value="2">Two Simplex</option>
                    <option value="3">Three Simplex</option>
                </CSelect>
                <CSelect aria-label="Default select example" onChange={(e) => setNumberGomori(e.target.value)}>
                    <option>Gomori Tasks</option>
                    <option value="0">Zero Gomori</option>
                    <option value="1">One Gomori</option>
                    <option value="2">Two Gomori</option>
                    <option value="3">Three Gomori</option>
                </CSelect>
                <CSelect aria-label="Default select example" onChange={(e) => setNumberEquipment(e.target.value)}>
                    <option>Equipment Tasks</option>
                    <option value="0">Zero Equipment</option>
                    <option value="1">One Equipment</option>
                    <option value="2">Two Equipment</option>
                    <option value="3">Three Equipment</option>
                </CSelect>
                <CSelect aria-label="Default select example" onChange={(e) => setNumberInvestments(e.target.value)}>
                    <option>Investments Tasks</option>
                    <option value="0">Zero Investments</option>
                    <option value="1">One Investments</option>
                    <option value="2">Two Investments</option>
                    <option value="3">Three Investments</option>
                </CSelect>
                <CSelect aria-label="Default select example" onChange={(e) => setNumberJohnson(e.target.value)}>
                    <option>Johnson Tasks</option>
                    <option value="0">Zero Johnson</option>
                    <option value="1">One Johnson</option>
                    <option value="2">Two Johnson</option>
                    <option value="3">Three Johnson</option>
                </CSelect>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => clearState()} color="primary">
                    Cancel
                </Button>
                <Button onClick={() =>
                {
                    const dict = {'simplex': numberSimplex, 'gomori': numberGomori}
                    createTest(currentGroups, startDate, endDate, rating, description, dict).then(clearState())
                }} color="primary">
                    Create
                </Button>
            </DialogActions>
        </Dialog>}
        <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
            <div style={{display: 'flex'}}>
                                <h1>Tests</h1>
            <CFormGroup style={{float:'right', marginRight: '30px'}} className="form-actions" >
                </CFormGroup>
            </div>
            </CCardHeader>

            <CCardBody>

            <CDataTable
                items={tests}
              fields={fields}
              hover
              clickableRows={true}
              onRowClick={(e) => {
                  history.push('/test/' + e.id)
              }}
              striped
              bordered
              size="sm"
              itemsPerPage={10}
              pagination
            />
            </CCardBody>

          </CCard>

        </CCol>
      </CRow>
    </div>)
}

function mapStateToProps(state) {
    return {
        tests: state.tests.tests,
        user: state.auth.user.user,
        groups: state.groups.groups
    }
}

const Tests = connect(mapStateToProps)(TestsTemplate);

export const TestList = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getTests())
        dispatch(getGroups())
    }, [])

    return (<Tests></Tests>)
}
