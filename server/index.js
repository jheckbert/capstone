// install core server components
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
const replace = require('replace-in-file');
const lineByLine = require('n-readlines');


// import the data file
const data = require('./data.js');
const rateRange = require('./rateRange.js');

// link the app 
const app = express();

// middleware 
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/analyze', (req, res) => {
    analyzeData(req.body);
     res.send(tipArray);
})

app.post('/newrates', (req, res) => {
    let newRates = req.body.data;
    const liner = new lineByLine('./rateRange.js');
    let line;     
    while (line = liner.next()) {
            liner.close();
            let oldRates = line.toString('ascii');
        
            const options = {
                files: './rateRange.js',
                from: oldRates,
                to: newRates,
            };
            replace(options) 
                .then(results => {
                    console.log('Replacement results:',  results);
                })
                .catch(error => {
                    console.log('Error occurred:', error);
                });
        }

    res.status('200').send('Got it');
    // process.exit(0);


})

function analyzeData(req) { 
    let inpName = req.data.name;
    let inpEmail = req.data.email;
    let inpMortgage = Number(req.data.mortgageAmt);
    let inpEquity = Number(req.data.equity);
    let inpSelfInc = Number(req.data.selfIncome);
    let inpSelfCredit = req.data.selfCredit;
    let inpPartInc = Number(req.data.partIncome);
    let inpPartCredit = req.data.partCredit;
    let inpEmpInd = req.data.empInd; 
    let inpSecurity = req.data.securityAsset;

    // declarative if statements (25 in total)
    // initial values
    let setIntRangeGroup = "N";
    let setLtv = " ";
    let setAnnIncome = 1;
    let tipOne = " ";
    let tipTwo = " ";
    let tipThr = " ";
    let tipFou = " ";
    let tipArray = [];
    let setMaxMortEst = (inpMortgage - inpEquity);

    // combine credit scores 
    let combScore = 0;
    (Number(inpSelfCredit) > Number(inpPartCredit)) ? combScore = inpSelfCredit : combScore = inpPartCredit;

    // optimize LTV 
    let combLTV = 0;
    (Number(inpEquity) > Number(inpMortgage * .35)) ? combLTV = Number(1) : null;
    (Number(inpEquity) < Number(inpMortgage *.2)) ? combLTV = Number(2) : null;
    ((Number(inpEquity) <= Number(inpMortgage * .35)) && (Number(inpEquity) >= Number(inpMortgage * .2))) ? combLTV = Number(3) : null;

    // let tipArray = [];
    // principal residence - 
        //poor credit - selfemp 
    if ((inpSecurity === "pr") && (Number(combScore) === 5) && (inpEmpInd === "n") && combLTV === Number(3)) {
            setIntRangeGroup = "D";
            setLtv = (inpEquity/inpMortgage) * 100;
            setMaxMortEst = Math.floor((((inpSelfInc + inpPartInc) * 12) * 5) * 1.1);
        } else
    if ((inpSecurity === "pr") && (Number(combScore) === 5) && (inpEmpInd === "n") && combLTV === Number(1)) {
            setIntRangeGroup = "C";
            setLtv = (inpEquity/inpMortgage) * 100;
            setMaxMortEst = Math.floor((((inpSelfInc + inpPartInc) * 12) * 5) * 1.1);
            } else 
    if ((inpSecurity === "pr") && (Number(combScore) === 5) && (inpEmpInd === "y") && combLTV === Number(1)) {
            setIntRangeGroup = "D";
            setLtv = (inpEquity/inpMortgage) * 100;
            setMaxMortEst = Math.floor((((inpSelfInc + inpPartInc) * 12) * 5) * 1.1);
            } else 
            // fair credit - selfemp y&n
    if ((inpSecurity === "pr") && (Number(combScore) === 4) && (inpEmpInd === "n") && combLTV === Number(3)) {
            setIntRangeGroup = "B";
            setLtv = (inpEquity/inpMortgage) * 100;
            setMaxMortEst = Math.floor((((inpSelfInc + inpPartInc) * 12) * 5) * 1.1);
        } else
    if ((inpSecurity === "pr") && (Number(combScore) === 4) && (inpEmpInd === "y") && combLTV === Number(3)) {
            setIntRangeGroup = "D";
            setLtv = (inpEquity/inpMortgage) * 100;
            setMaxMortEst = Math.floor((((inpSelfInc + inpPartInc) * 12) * 5) * 1.1);
        } else
    if ((inpSecurity === "pr") && (Number(combScore) === 4) && ((inpEmpInd === "n") || (inpEmpInd === "y")) && combLTV === Number(1)) {
            setIntRangeGroup = "C";
            setLtv = (inpEquity/inpMortgage) * 100;
            setMaxMortEst = Math.floor((((inpSelfInc + inpPartInc) * 12) * 5) * 1.1);
            } else
        // good credit - selfemp y&n
    if ((inpSecurity === "pr") && (Number(combScore) === 3) && (inpEmpInd === "n") && combLTV === Number(2)) {
            setIntRangeGroup = "A";
            setLtv = (inpEquity/inpMortgage) * 100;
            setMaxMortEst = Math.floor((((inpSelfInc + inpPartInc) * 12) * 5) * 1.1);
        } else
    if ((inpSecurity === "pr") && (Number(combScore) === 3) && (inpEmpInd === "y") && combLTV === Number(1)) {
            setIntRangeGroup = "C";
            setLtv = (inpEquity/inpMortgage) * 100;
            setMaxMortEst = Math.floor((((inpSelfInc + inpPartInc) * 12) * 5) * 1.1);
        } else
    if ((inpSecurity === "pr") && (Number(combScore) === 3) && (inpEmpInd === "n") && combLTV === Number(1)) {
        setIntRangeGroup = "A";
        setLtv = (inpEquity/inpMortgage) * 100;
        setMaxMortEst = Math.floor((((inpSelfInc + inpPartInc) * 12) * 5) * 1.1);
        } else 
    if ((inpSecurity === "pr") && (Number(combScore) === 3) && (inpEmpInd === "n") && combLTV === Number(3)) {
            setIntRangeGroup = "B";
            setLtv = (inpEquity/inpMortgage) * 100;
            setMaxMortEst = Math.floor((((inpSelfInc + inpPartInc) * 12) * 5) * 1.1);
        } else
    if ((inpSecurity === "pr") && (Number(combScore) === 3) && (inpEmpInd === "y") && combLTV === Number(2)) {
            setIntRangeGroup = "B";
            setLtv = (inpEquity/inpMortgage) * 100;
            setMaxMortEst = Math.floor((((inpSelfInc + inpPartInc) * 12) * 5) * 1.1);
            } else 
        // very good credit - selfemp y&n
    if ((inpSecurity === "pr") && (Number(combScore) === 2) && (inpEmpInd === "y") && combLTV === Number(3)) {
            setIntRangeGroup = "C";
            setLtv = (inpEquity/inpMortgage) * 100;
            setMaxMortEst = Math.floor((((inpSelfInc + inpPartInc) * 12) * 5) * 1.1);
        } else
    if ((inpSecurity === "pr") && (Number(combScore) === 2) && (inpEmpInd === "n") && combLTV === Number(3)) {
            setIntRangeGroup = "B";
            setLtv = (inpEquity/inpMortgage) * 100;
            setMaxMortEst = Math.floor((((inpSelfInc + inpPartInc) * 12) * 5) * 1.1);
        } else
        // excellent credit - selfemp y&n
    if ((inpSecurity === "pr") && (Number(combScore) === 1) && (inpEmpInd === "n") && combLTV === Number(3)) {
            setIntRangeGroup = "B";
            setLtv = (inpEquity/inpMortgage) * 100;
            setMaxMortEst = Math.floor((((inpSelfInc + inpPartInc) * 12) * 5) * 1.1);
            } else 
    if ((inpSecurity === "pr") && (Number(combScore) === 1) && (inpEmpInd === "y") && combLTV === Number(3)) {
            setIntRangeGroup = "C";
            setLtv = (inpEquity/inpMortgage) * 100;
            setMaxMortEst = Math.floor((((inpSelfInc + inpPartInc) * 12) * 5) * 1.1);
            } else 
    if ((inpSecurity === "pr") && (Number(combScore) <= 2) && ((inpEmpInd === "n") || (inpEmpInd === "y")) && (combLTV <= Number(2))) {
            setIntRangeGroup = "A";
            setLtv = (inpEquity/inpMortgage) * 100;
            setMaxMortEst = Math.floor((((inpSelfInc + inpPartInc) * 12) * 5) * 1.1);
            } else
        // investment property - excellent credit - selfemp n
    if ((inpSecurity === "ip") && (Number(combScore) === 1) && (inpEmpInd === "y") && (combLTV === Number(2))) {
            setIntRangeGroup = "D";
            setLtv = (inpEquity/inpMortgage) * 100;
            setMaxMortEst = Math.floor((((inpSelfInc + inpPartInc) * 12) * 5) * 1.1);
        } else  
    if ((inpSecurity === "ip") && (Number(combScore) === 1) && (inpEmpInd === "y") && combLTV === Number(1)) {
            setIntRangeGroup = "B";
            setLtv = (inpEquity/inpMortgage) * 100;
            setMaxMortEst = Math.floor((((inpSelfInc + inpPartInc) * 12) * 5) * 1.1);
        } else
    if ((inpSecurity === "ip") && (Number(combScore) === 1) && (inpEmpInd === "y") && combLTV === Number(3)) {
            setIntRangeGroup = "C";
            setLtv = (inpEquity/inpMortgage) * 100;
            setMaxMortEst = Math.floor((((inpSelfInc + inpPartInc) * 12) * 5) * 1.1);
        } else
    if ((inpSecurity === "ip") && (Number(combScore) === 1) && (inpEmpInd === "n")) {
            setIntRangeGroup = "B";
            setLtv = (inpEquity/inpMortgage) * 100;
            setMaxMortEst = Math.floor((((inpSelfInc + inpPartInc) * 12) * 5) * 1.1);
        } else
    if ((inpSecurity === "ip") && ((Number(combScore) === 2) || (Number(combScore) === 3))&& ((inpEmpInd === "y") || (inpEmpInd = "n")) && combLTV === Number(3)) {
            setIntRangeGroup = "C";
            setLtv = (inpEquity/inpMortgage) * 100;
            setMaxMortEst = Math.floor((((inpSelfInc + inpPartInc) * 12) * 5) * 1.1);
        } else
    if ((inpSecurity === "ip") && (Number(combScore) === 2) && ((inpEmpInd === "y") || (inpEmpInd === "n")) && combLTV === Number(2)) {
            setIntRangeGroup = "D";
            setLtv = (inpEquity/inpMortgage) * 100;
            setMaxMortEst = Math.floor((((inpSelfInc + inpPartInc) * 12) * 5) * 1.1);
        } else  
    if ((inpSecurity === "ip") && (Number(combScore) === 2) && (inpEmpInd === "y") && combLTV === Number(1)) {
            setIntRangeGroup = "C";
            setLtv = (inpEquity/inpMortgage) * 100;
            setMaxMortEst = Math.floor((((inpSelfInc + inpPartInc) * 12) * 5) * 1.1);
        } else
    if ((inpSecurity === "ip") && (Number(combScore) === 3) && ((inpEmpInd === "y") || (inpEmpInd === "n")) && combLTV === Number(1)) {
            setIntRangeGroup = "D";
            setLtv = (inpEquity/inpMortgage) * 100;
            setMaxMortEst = Math.floor((((inpSelfInc + inpPartInc) * 12) * 5) * 1.1);
        }   
        addRateRange(setIntRangeGroup);
        addTips(setIntRangeGroup, setAnnIncome, setLtv, setMaxMortEst);
        sendEmail(inpEmail, intRateRange);
};

function addTips(range, income, ltv, maxMort) {
        if (range === "A") {
            finding = "goodCredit";
        } else if (range === "B") {
            finding = "goodCredit";
        } else if (range === "C") {
            finding = "badCredit";
        } else if (range === "D") {
            finding = "badCredit";
        } else if (range === "N") {
            finding = "badCredit";
        } else if (ltv >= 35 && income > 100000) {
            finding = "lowDown";
        } else if (income <= 100000) {
            finding = "lowIncome";
        } else finding = "goodCredit";
        tipRecs = data.find((recs) => (recs.issue === finding));
            tipOne = tipRecs.tip1;
            tipTwo = tipRecs.tip2;
            tipThr = tipRecs.tip3;
            tipFou = tipRecs.tip4;
            tipArray = [intRateRange, tipOne, tipTwo, tipThr, tipFou, maxMort];  
            return tipArray;
}

        


function addRateRange(setIntRangeGroup) {
    if (setIntRangeGroup === "A") { 
        intRateRange = rateRange[0];
    } else if (setIntRangeGroup === "B") {
        intRateRange = rateRange[1]; 
    } else if (setIntRangeGroup === "C") {
        intRateRange = rateRange[2];  
    } else if (setIntRangeGroup === "D") {
        intRateRange = rateRange[3];        
    } else if (setIntRangeGroup === "N") {
        intRateRange = rateRange[4];        
    }
    return intRateRange;
}

function sendEmail(inpEmail, intRateRange) {
    sgMail.setApiKey(sg_apikey);
    const msg = {
    to: `${inpEmail}`,
    from: 'jheckbert@angelmortgage.ca',
    subject: 'Thank you for visiting Angel Mortgage.ca',
    text: `Based on the information you provided, we have estimated your interest rate range as ${intRateRange}. Obviously, this is an estimate and your actual rate will depend on a complete review of your income, credit history and property valuation. Here are three tips you can use to maintain your credit score to ensure you qualify for the best rates. \n\r Tip 1 ${tipOne}. \n\r Tip 2 ${tipTwo}. \n\r Tip 3 ${tipThr}. \n\r ${tipFou}.`,
    html: `Based on the information you provided, we have estimated your interest rate range as ${intRateRange}. Obviously, this is an estimate and your actual rate will depend on a complete review of your income, credit history and property valuation. <br>Here are three tips you can use to maintain your credit score to ensure you qualify for the best rates. <br><strong>Tip 1<strong>${tipOne}</br><br><strong>Tip 2</strong>${tipTwo}</br><br><strong>Tip 3</strong>${tipThr}</br><br><strong></strong>${tipFou}.</br>`,
    }
    sgMail.send(msg);   //commented out during testing. I know it works and I will need a new API for demo day.
};

app.listen(7400, res => {
    console.log('The server is listening on port 7400');
})