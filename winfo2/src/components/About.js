import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const About = () => {
    return (
        <div>
        <h1 className="about">About Us</h1>
        <div className="about-container">
        <div className="about-name">
            Evonne La
        </div>
        <div className="about-name">
            Selena Yu
        </div>
        <div className="about-name">
            Niyat Efrem
        </div>
        <div className="about-name">
            Jenna Sorror
        </div>
        <div className="about-name">
            Grace Yim
        </div>
        <iframe 
            className="video"
            width="1008" 
            height="567" 
            src="https://www.youtube.com/embed/mOssYTimQwM?si=4BO0PnK8hbM2TnxR" 
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin" 
            allowfullscreen
            />
        </div>
        </div>
    )
}

export default About;