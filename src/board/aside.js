import React from 'react';
import './aside.css';
import snakeImg from '../assets/snake.png';
const Aside = () => {
    return (
        <div className="aside">
            <img width="200px" src={snakeImg} alt="snakeImage" />
            <div className="main">
                <h1 className="main-heading">
                    <span className="main-heading-primary">Snake's</span><span className="main-heading-primary" > Quest</span>
                    <span className="main-heading-secondary">Catch the food!!!</span>
                </h1>
            </div>
        </div>
    )
}
export default Aside;