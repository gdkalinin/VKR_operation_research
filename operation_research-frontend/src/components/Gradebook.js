import React, { useState, useEffect } from "react";
import {Tables} from "./Tables";
import {connect, useDispatch} from "react-redux";
import {CBreadcrumb, CBreadcrumbItem} from "@coreui/react";


const Gradebook = () => {
    return( <div>
        <CBreadcrumb>
            <CBreadcrumbItem href="/home">Home
            </CBreadcrumbItem>
            <CBreadcrumbItem active>Grades
            </CBreadcrumbItem>
        </CBreadcrumb>
    </div>)
}

function mapStateToProps(state) {
    return {
    }
}

const Grades = connect(mapStateToProps)(Gradebook);

export const GradesList = () => {
    const dispatch = useDispatch();

    useEffect(() => {
    }, [])

    return (<Grades></Grades>)
}
