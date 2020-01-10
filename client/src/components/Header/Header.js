import React from 'react';

// middleware

// styling
import './Header.scss';

// images
import logo from '../images/angelMortgageLogo.png';
import myPic from '../images/MyPicture.png';

// 
export default class Header extends React.Component { 

    render() {
        return (
          <>  
            <header className="header__container">
                <img className="header__logo" src={logo} alt="Angel Mortgage Logo" width='200' />
                <h1 className="header__title">Mortgage Interest Rate Estimate</h1>
                <img className="header__myPic" src={myPic} alt="just me" width='200' />
            </header>

          </>  
        )
    }
}
