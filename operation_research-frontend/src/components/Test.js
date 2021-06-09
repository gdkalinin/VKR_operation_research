import React, {useEffect, useState} from "react";
import { getCurrentTest} from "../actions/tests";
import {
    CBreadcrumb, CBreadcrumbItem, CListGroup, CListGroupItem, CButton, CCard, CCardBody, CCardTitle, CCardText
} from '@coreui/react'
import Select from 'react-select'
import {updateTask} from "../services/tests.service";
import {
  useParams
} from "react-router-dom";
import {connect, useDispatch} from "react-redux";
import moment from "moment";
import { Alert, AlertTitle } from '@material-ui/lab';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Collapse from '@material-ui/core/Collapse';
    const renderTableData = (groups) => {
        var count = 0
        return (
            <div>
                <table>
                    <thead>
                    <tr>{groups[0].map(gr => {return <th>{'x' + count++}</th>})}
                    </tr>
                    </thead>
                <tbody>
                   {groups.slice(1, groups.length).map((item, index) => {
                       return(
                     <tr>
                         <td>{item[0]}</td>
                         <td>{item[1]}</td>
                         <td>{item[2]}</td>
                         <td>{(item[3])}</td>
                     </tr>)})}
                </tbody>
                </table>
            </div>
             )
        }

        const renderInvestmentsData = (matrix) => {
        var count = 1
        var companies = 0
        return (
            <div>
                <table style={{paddingTop: '20px',width: '600px', border: '1px solid black'}}>
                    <thead>
                    <tr style={{border: '1px solid black'}}>
                        {<th>N</th>}
                        {matrix[0].map(gr => {return <th style={{border: '1px solid black'}}>{count++}</th>})}
                    </tr>
                    </thead>
                <tbody>

                {matrix.map(matr => { return <tr>
                    <td style={{border: '1px solid black'}}>{`F(${companies++})`}</td>
                   {matr.map((item) => {
                       return(
                         <td style={{border: '1px solid black'}}>{item}</td>
                    )})}</tr>
                })}
                </tbody>
                </table>
            </div>
             )
        }

        const renderEquipmentData = (residual, expens, income) => {
        console.log(residual, expens, income)
        var count = 0
        return (
            <div>
                <table style={{paddingTop: '20px',width: '600px', border: '1px solid black'}}>
                    <thead>
                    <tr style={{border: '1px solid black'}}>
                        {<th>t</th>}
                        {residual.map(gr => {return <th style={{border: '1px solid black'}}>{count++}</th>})}
                    </tr>
                    </thead>
                <tbody>
                <tr>
                    <td style={{border: '1px solid black'}}>r(t)</td>
                   {income.map((item) => {
                       return(
                         <td style={{border: '1px solid black'}}>{item}</td>
                    )})}</tr>
                <tr>
                    <td style={{border: '1px solid black'}}>s(t)</td>
                   {residual.map((item) => {
                       return(
                         <td style={{border: '1px solid black'}}>{item}</td>
                    )})}</tr>
                <tr>
                    <td style={{border: '1px solid black'}}>u(t)</td>
                   {expens.map((item) => {
                       return(
                         <td style={{border: '1px solid black'}}>{item}</td>
                    )})}</tr>
                </tbody>
                </table>
            </div>
             )
        }
export const TestTemplate = (props) => {
    const [currentTask, setCurrentTask] = useState(0)
    const [current, setCurrent] = useState()
    const [options, setOptions] = useState([])
    const [answer, setAnswer] = useState()
    const [openAlert, setOpenAlert] = useState(false)
    const { id } = useParams()
    const user_id = JSON.parse(localStorage.getItem("user")).user.id;
    useEffect(() => {
        if (props.test){
            if (currentTask !== 0)
                setCurrent(props.test.tasks.filter(task => task.id === currentTask)[0])
        }
    }, [currentTask])
    useEffect(() => {
        if (current ) {
            var temp = []
            if (current.task_type === 3) {
                for (var i = 0; i < current.condition.income.length; i++) {
                    temp.push({value: i, label: `${i}`})
                }
                setOptions(temp)
            }
            if (current.task_type === 4) {
                for (var i = 1; i < current.condition.companies + 1; i++) {
                    temp.push(i)
                }
                setOptions(temp)
            }
            if(current.task_type === 3 && current.student_solution && current.student_solution.length > 0){
                if(current.student_solution[0].constructor === Object) {
                    setAnswer(current.student_solution)
                }
            else{
                        setAnswer(current.student_solution.map(value => {return {'value': value, 'label': value}}))}}
            else setAnswer([])
        }
    }, [current])

    if(props.test)
    {
        var tasks = props.test.tasks.map((value) => {
        return <CListGroupItem  active={currentTask===value.id} style={{cursor:'pointer'}} component="a" onClick={() => setCurrentTask(value.id)}>
            {value.task_type === 1 ? 'Simplex method task' : value.task_type === 2 ? "Gomori task" : value.task_type === 3 ?'Equipment change task' : 'Investments task'}
                  </CListGroupItem>})
    }

    if (current && current.task_type === 4 && options)
    {
        var investments_result = options.map(value => {
            return <input type="number" onChange={(e) => {
                var temp = answer
                temp[value] = e.target.value
                setAnswer(temp)}} value={answer[value]} placeholder={'N(' + value + ')'} className="form-control"/>
        })
    }

    return (
        <div>
            <Collapse in={openAlert}>
            <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpenAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          Answer submitted!
            </Alert></Collapse>
            <CBreadcrumb>
                <CBreadcrumbItem href="/home">Home</CBreadcrumbItem>
                <CBreadcrumbItem href="#">Test</CBreadcrumbItem>
                <CBreadcrumbItem active>{id}</CBreadcrumbItem>
            </CBreadcrumb>
            <div style={{width: '1200px', alignItems: 'center'}}>
        <div style={{display:'flex' }}>
            <div style={{width:'200px'}}>
                <CListGroup>
                  {tasks}
                </CListGroup>
            </div>
            {props.test && moment().diff(props.test.start_at, 'minutes') < 0 && <CCard style={{ width: '18rem', marginLeft: '140px', marginRight: '20px', }}>
            <CCardBody>
                <CCardTitle>While waiting</CCardTitle>
                <CCardText>
                    Your test in not available yet! But, while waiting, you can check the amount of tasks you're going to get, or move to Presentations, and prepare more for the tests.
                </CCardText>
                <CButton color='primary' href="/presentations">Move to</CButton>
            </CCardBody>
        </CCard>}
            {props.test && moment().diff(props.test.finish_until, 'minutes') > 0 && currentTask === 0 &&
            <CCard style={{ width: '40rem', marginLeft: '140px', marginRight: '20px', }}>
            <CCardBody>
                <CCardTitle>Test is finished! </CCardTitle>
                <CCardText>
                    {`You have solved ${props.test.tasks.filter(task => task.solved === true).length} of ${props.test.tasks.length} tasks correctly. `}
                    <div>{`Your final mark for this test is ${props.test.tasks.filter(task => task.solved === true).length * 10 / props.test.tasks.length}.`}</div>
                    <div>Check other tests, try to solve more tasks, or move to presentations.</div>
                </CCardText>
                <CButton color='primary' href="/presentations">Presentations</CButton>
                <CButton  style={{marginLeft: '100px'}} color='primary' href="/tests">Tests</CButton>
            </CCardBody>
        </CCard>
            }
        {props.test && moment().diff(props.test.start_at, 'minutes') > 0 && <div style={{width: '650px',  paddingLeft: '50px'}}>
            {current && current.task_type === 1 &&  <div><div>Solve given matrix using simplex method</div>
                {renderTableData(props.test.tasks[0].condition)}</div>}
            {current && current.task_type === 3 && <div><div>
                The problem of replacing equipment.</div><div>
                {`Find the optimal equipment operation strategy for the period of operation ${current.condition['period']} years if the annual ` +
                `income r(t), annual costs u(t) and residual value S(t) depending on age given in table below, ` +
                `the cost of new equipment is ${current.condition['cost']} and the age of the equipment at the beginning of the operational ` +
                ` period is ${current.condition['age']}`}</div>
                <div>Select optimal to equipment update years.</div>
                {renderEquipmentData(current.condition.residual_value, current.condition.expens, current.condition.income)}
                <Select
                    isMulti
                    value={answer}
                    disabled={moment().diff(props.test.finish_until, 'minutes') > 0 }
                    onChange={(e) => {if (moment().diff(props.test.finish_until, 'minutes') < 0) setAnswer(e.map(res => res))}}
                    name="years"
                    className="basic-multi-select"
                    classNamePrefix="select"
                    options={options}/>
                {(moment().diff(props.test.finish_until, 'minutes') > 0)&&  <h3>{'Correct answer: ' + current.solution}</h3>}
                {moment().diff(props.test.start_at, 'minutes') > 0 && props.test.user_id === user_id && moment().diff(props.test.finish_until, 'minutes') < 0 &&
                    <div style={{float: 'center', left: '200px'}}>
                    <CButton style={{marginTop:'20px'}} color='primary' onClick={() => {current.student_solution = answer.map(va => va['value'])}}>Save</CButton>
                    <CButton style={{marginTop:'20px', float:'right'}} color='primary' onClick={() => {
                        setOpenAlert(true)
                        if (moment().diff(props.test.finish_until, 'minutes') < 0)
                            current.student_solution = answer.map(va => va['value'])
                        updateTask(current.id, current.student_solution)
                    }}>Submit</CButton>
                    </div>}
            </div>
            }
            {current && current.task_type === 4 && <div><div>Distribution problem.</div><div>
                {`
                    Find the optimal allocation ${current.condition['investments']} of investments
                    between ${current.condition['companies']} companies, provided that the profit f(x)
                    received from each company,
                    is a function of the funds invested in it x.`}</div>
                <div>Fill the optimal strategy, and final income.</div><div>{renderInvestmentsData(current.condition['matrix'])}</div>
                <div className="input-group">
                    <div className="input-group-prepend">
                    </div>
                    {investments_result}

                </div>
                 <input type="number" onChange={(e) => {
                        var temp = answer
                        temp[0] = e.target.value
                        setAnswer(temp)}} value={answer ? answer[0] : ''} placeholder={'Final income'} className="form-control"/>
                                {moment().diff(props.test.start_at, 'minutes') > 0 && props.test.user_id === user_id && moment().diff(props.test.finish_until, 'minutes') < 0 &&
                    <div style={{float: 'center', left: '200px'}}>
                    <CButton style={{marginTop:'20px'}} color='primary' onClick={() => {console.log(answer)}}>Save</CButton>
                    <CButton style={{marginTop:'20px', float:'right'}} color='primary' onClick={() => {
                        setOpenAlert(true)
                        if (moment().diff(props.test.finish_until, 'minutes') < 0)
                            current.student_solution = answer.map(va => va['value'])
                        updateTask(current.id, current.student_solution)
                    }}>Submit</CButton>
                    </div>}
                    </div>}

        </div>}

            <div style={{display:'block'}}>
                {props.test ? moment().diff(props.test.start_at, 'minutes') > 0 ? moment().diff(props.test.finish_until, 'minutes') < 0 ? <div style={{marginLeft: '50px'}}>{'Test ends in: ' + moment.duration(moment().diff(props.test.finish_until)).humanize()}</div> : '' : <div style={{marginLeft: '40px'}}>{'Test starts at: ' + moment.duration(moment().diff(props.test.finish_until)).humanize()}</div> : <div></div>}
            </div>

        </div></div></div>)
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