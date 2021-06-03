import React, { useEffect } from "react";
import {connect, useDispatch} from "react-redux";
import { useHistory } from "react-router-dom";

import {
    CBreadcrumb,
    CBreadcrumbItem,
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol, CDataTable,
    CFormGroup,
    CRow
} from "@coreui/react";
import {getPresentations} from "../actions/presentations";
const fields = ['id','name']

const PresentationsTemplate = (props) => {
    const history = useHistory();

    return ( <div>
        <CBreadcrumb>
            <CBreadcrumbItem href="/home">Home
            </CBreadcrumbItem>
            <CBreadcrumbItem active>Presentations
            </CBreadcrumbItem>
        </CBreadcrumb>

        <div style={{width: '1100px'}}>

      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
            <div style={{display: 'flex'}}>
                                <h1>Presentations</h1>
            <CFormGroup style={{float:'right', marginRight: '30px'}} className="form-actions" >
                </CFormGroup>
            </div>
            </CCardHeader>

            <CCardBody>

            <CDataTable
                items={props.presentations}
              fields={fields}
              hover
              clickableRows={true}
              onRowClick={(e) => {
                  history.push('/presentation/' + e.id)
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
    </div>
    </div>)
}

function mapStateToProps(state) {
    return {
        presentations: state.presentations.presentations
    }
}

const Presentations = connect(mapStateToProps)(PresentationsTemplate);

export const PresentationsList = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPresentations())
    }, [])

    return (<Presentations></Presentations>)
}
