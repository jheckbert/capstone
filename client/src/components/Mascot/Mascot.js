import React, { Component } from 'react';

// import application components
import Header from '../Header/Header';

// import images and such
import angelPic from './38219-temp-mascot-640x426.jpg';

export default class Mascot extends Component {
    render() {
        return (
            <>
                <Header />
                <div>
                    <p>Message to my staff here at Angel Mortgage -</p>
                    <p>"Mortgage free means more toys for me!"</p>    
                    <img src={angelPic} width="426px" alt="picture of Angel" />
                </div>
            </>
        );
    }
}
