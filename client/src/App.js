import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import axios from "axios";
import {Helmet} from 'react-helmet';

// import application components
// import Header from "./components/Header/Header";
import InputForm from "./components/InputForm/InputForm";
import ResultsPage from "./components/ResultsPage/ResultsPage";
import Home from './components/Home/Home';
// 

export default class App extends React.Component {
  state = {
    userDidFinish: false
  }

  analyzeForm = (event) => {
    event.preventDefault();
    let appName = event.target.name.value;
    let appEmail = event.target.email.value;
    let appMortgage = event.target.mortgage.value;
    let appEquity = event.target.equity.value;
    let appSelfInc = event.target.selfIncome.value;
    let appSelfCredit = event.target.selfCredit.value;
    let appPartInc = event.target.partIncome.value;
    let appPartCredit = event.target.partCredit.value;
    let appEmpInd = event.target.selfEmpInd.value;
    let appSecurity = event.target.selfSecurity.value;
    let data = " ";
    
    axios
      .post("http://localhost:7400/analyze", {
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          name: appName,
          email: appEmail,
          mortgageAmt: appMortgage,
          equity: appEquity,
          selfIncome: appSelfInc,
          selfCredit: appSelfCredit,
          partIncome: appPartInc,
          partCredit: appPartCredit,
          empInd: appEmpInd,
          securityAsset: appSecurity
        }
      })
      .then(result => {
          data = result.data
          this.setState({
            data :  data,
            userDidFinish: true 
          });

      })
      .catch(err => {
        console.log(err);
      });
    };
  
  render() {
    return (
      <>
        <Helmet>
            <meta charSet="utf-8" />
            <title>Angel Mortgage</title>
        </Helmet>
        <Home />
        <BrowserRouter>
          <Switch>
            {/* {this.state.userDidFinish ? <Redirect to="/ResultsPage"></Redirect> : null } */}
            <Route exact path='/' render={(props) => <InputForm analyzeForm={this.analyzeForm} {...props}/>}></Route>
            <Route path='/ResultsPage' render={() => <ResultsPage data={this.state.data}></ResultsPage>}></Route>
          </Switch>
        </BrowserRouter>
      </>
    );
  }
}
