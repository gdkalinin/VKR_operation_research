import {
    CSpinner,
    CCarousel,
    CCarouselItem,
    CCarouselCaption,
    CCarouselIndicators,
    CCarouselInner,
    CCarouselControl,
    CButton, CCardBody
} from '@coreui/react'
import React, { useState, useEffect } from "react";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
export const SlidesTemplate = (props) => {
    const [content, setContent] = useState([]);
    const [audios, setAudios] = useState("")
    const [showAudio, setShow] = useState(true)
    useEffect(() => {
        fetch('http://0.0.0.0:5000/get_audios', {method: "GET"}).then(res => res.json()).then(response => setAudios(response.result))
        fetch('http://0.0.0.0:5000/get_images', {method: "GET"}).then(res => res.json()).then(response => {
            var arr = []
            for (var key in response.result) {
            if (response.result.hasOwnProperty(key)) {
                arr.push(response.result[key]);
            }
        }
            setContent(arr)

        })
    }, []);
    const [activeIndex, setActiveIndex] = useState(0)
    var count = 0;
    const slides = Array.from(content).map((value) => {
        return <CCarouselItem>
                     <img className="d-block w-100" src={'data:image/jpg;base64,' + value} alt={count++} />
                     <CCarouselCaption className="d-none d-md-block">
                         {showAudio &&<AudioPlayer

                            autoPlayAfterSrcChange={true}
                            src={'data:audio/mp3;base64,' + audios[0]}
                            onPlay={e => console.log("onPlay")}
                            // other props here
                          />}
                     </CCarouselCaption>
                 </CCarouselItem>}
    )

         return ( <div>
             {content.length !== 0 ? <CCarousel activeIndex={activeIndex}>
                 <CCarouselIndicators/>
                 <CCarouselInner>
                     {slides}
                 </CCarouselInner>
                             <CCarouselControl direction="prev"/>
            <CCarouselControl direction="next"/>
             </CCarousel> : <CSpinner/>}
             {content.length !== 0  && <CButton style={{display: 'flex', justifyContent:'center', alignItems:'center', width: '200'}} color='primary' onClick={() => setShow(!showAudio)}>{showAudio ? 'Disable Audio' : 'Enable audio'}</CButton>}</div>
  )
}