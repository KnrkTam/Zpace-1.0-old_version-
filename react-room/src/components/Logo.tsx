import React from 'react';
import logo from "../img/logo_beta.png";
import "../css/Logo.css"

const Logo :React.FC =() =>{
    return (
        <div>
            <img src={logo} className="logo" alt="logo"/>
    </div>
    )
    
}

export default Logo;