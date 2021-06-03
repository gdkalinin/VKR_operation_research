import React, { useEffect } from "react";
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'

import {SlidesTemplate} from "./Slides";
import {
  useParams
} from "react-router-dom";

export const ShowPresentation = () => {
    const { id } = useParams()
    return (
        <div>
            <CBreadcrumb>
                <CBreadcrumbItem href="/home">Home</CBreadcrumbItem>
                <CBreadcrumbItem href="#">Presentations</CBreadcrumbItem>
                <CBreadcrumbItem active>{id}</CBreadcrumbItem>
            </CBreadcrumb>
        <div style={{display: 'flex', paddingLeft: '150px', justifyContent:'center', alignItems:'center', height: '100vh', width: '900px'}}>
            <SlidesTemplate id={id}/>
        </div></div>)
}