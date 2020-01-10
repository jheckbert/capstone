import React from "react";

//import styling 
import './ResultsPage.scss';

// import images 
import mopolo from '../images/mopolo.jpg';

export default class ResultsPage extends React.Component {    

    render() { 
        if(!this.props.data){
            return null
        }
        
        return (
            <div className="results">
                <div className="results__intro">  
                    <p className="results__intro-para">
                        Based on the information you provided, we have estimated your interest rate range as {this.props.data[0]} with a maximum mortgage amount of ${this.props.data[5]}. Obviously, this is an estimate and your actual rate and amount will depend on a complete review of your income, credit history and property valuation.
                    </p>
                </div>  
                <div className="results__tips"> 
                    <p>Here are three tips to help you achieve your goals sooner.</p>
                    <p className="results__tips-highlight">Tip 1 - {this.props.data[1]}</p>
                    <p className="results__tips-lowlight">Tip 2 - {this.props.data[2]}</p>
                    <p className="results__tips-highlight">Tip 3 - {this.props.data[3]}</p>
                    <p className="results__tips-lowlight">{this.props.data[4]}</p>
                </div>
                <div className="results__offer-box">    
                    <div className="results__mopolo-offer">
                        <p className="results__mopolo-desc">If you want a handy way to maintain your credit information while staying in touch on your local real estate market, MOPOLO - a mobile product offered by Mortgage Alliance - will help.</p>
                        <a className="results__mopolo-link" href="http://mortgagealliance.com/JohnHeckbert/mopolo" target="blank">
                        <img alt="the M3 MOPOLO logo" src={mopolo} width="380" /></a>
                        <p className="results__mopolo-disc">Clicking on the link will take you to my Mortgage Alliance page.</p>
                    </div>
                    <div className="results__apply-now-box">    
                        <p className="results__apply-now-desc">If you are ready to take the next step towards achieving your dreams, click the link below and complete our online application. We'll link you up with the best lender for your needs. </p>
                        <div className="results__apply-now-offer">
                            <a className="results__apply-now-button" href="http://mortgagealliance.com/JohnHeckbert/apply-online" target="blank" >Apply Now</a>
                        </div>
                        <p className="results__apply-now-disc">Clicking on the link will take you to my Mortgage Alliance page.</p>
                    </div>
                </div>
            </div>

        )}}