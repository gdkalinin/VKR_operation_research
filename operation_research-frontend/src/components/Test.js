import React, {useEffect, useState} from "react";
import { getCurrentTest} from "../actions/tests";
import {
    CBreadcrumb, CBreadcrumbItem, CListGroup, CListGroupItem,
    CBadge, CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable, CFormGroup,
    CRow, CCardTitle, CCardText
} from '@coreui/react'
import {
  useParams
} from "react-router-dom";
import {connect, useDispatch} from "react-redux";

export const TestTemplate = (props) => {
    const [currentTask, setCurrentTask] = useState(0)
    const { id } = useParams()
    if (props.test)
    var tasks = props.test.tasks.map((value) => {
        return <CListGroupItem  active={currentTask===value.id} style={{cursor:'pointer'}} component="a" onClick={() => setCurrentTask(value.id)}>
            {value.task_type === 1 ? 'Simplex method task' : "Gomori task"}
                  </CListGroupItem>
    })
    return (
        <div>
            <CBreadcrumb>
                <CBreadcrumbItem href="/home">Home</CBreadcrumbItem>
                <CBreadcrumbItem href="#">Test</CBreadcrumbItem>
                <CBreadcrumbItem active>{id}</CBreadcrumbItem>
            </CBreadcrumb>
        <div style={{display:'flex' }}>
            <div style={{width:'200px', margin: '50px'}}>
                <CListGroup>
                  {tasks}
                </CListGroup>
            </div>
        <CCard style={{ width: '18rem', marginLeft: '80px', marginRight: '20px' }}>
            <CCardBody>
                <CCardTitle>While waiting</CCardTitle>
                <CCardText>
                    Your test in not available yet! But, while waiting, you can check the amount of tasks you're going to get, or move to Presentations, and prepare more for the tests.
                </CCardText>
                <CButton color='primary' href="/presentations">Move to</CButton>
            </CCardBody>
        </CCard>
            {props.test && <h2 style={{marginLeft: '40px'}}>{'Test starts at: ' + props.test.start_at}</h2>}
        </div></div>)
}

function mapStateToProps(state) {
    return {
        test: state.tests.test
    }
}

const Test = connect(mapStateToProps)(TestTemplate);

export const CurrentTest = () => {
    const dispatch = useDispatch();
    const { id } = useParams()

    useEffect(() => {
        dispatch(getCurrentTest(id))
    }, [])

    return (<Test></Test>)
}