import React from 'react';
import './aside.css';
// import 'animate.css';
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
            {/* <h1 class="animate__animated animate__bounce">An animated element</h1> */}
        </div>
    )
}
export default Aside;