import React, { useState, useEffect } from "react";
import {CBreadcrumb, CBreadcrumbItem, CButton, CCard, CCardImg, CCardBody, CCardText, CCardTitle } from '@coreui/react'
import marks from "../assets/assesment.jpg"
import UserService from "../services/user.service";
import {SlidesTemplate} from "./Slides"
const Home = () => {

  return (
    <div className="container">
            <CBreadcrumb>
                <CBreadcrumbItem active>Home</CBreadcrumbItem>
            </CBreadcrumb>
        <div style={{display: 'flex', paddingLeft: '150px', justifyContent:'center', alignItems:'center', width: '1000px'}}>
        <CCard style={{ width: '18rem' }}>
            <CCardBody>
                <CCardTitle>Tests</CCardTitle>
                <CCardText>
                    Here you can test your knowledge with test tasks, as well as write the work assigned by the teacher.
                </CCardText>
                <CButton color='primary' href="/tests">Let's start</CButton>
            </CCardBody>
        </CCard>
        <CCard style={{ width: '18rem', marginLeft: '20px', marginRight: '20px' }}>
            <CCardBody>
                <CCardTitle>Presentation</CCardTitle>
                <CCardText>
                    Here you can explore the available presentations for self-study, as well as within the lecture session.
                </CCardText>
                <CButton color='primary' href="/presentations">Move to</CButton>
            </CCardBody>
        </CCard>
        <CCard style={{ width: '18rem' }}>

            <CCardBody>
                <CCardTitle>Gradebook</CCardTitle>
                <CCardText>
                    Here you can check your marks for solved test, as well as final mark for whole course.
                </CCardText>
                <CButton color='primary' href="/grades">Have a look</CButton>
            </CCardBody>
        </CCard></div>
    </div>
  );
};

export default Home;
