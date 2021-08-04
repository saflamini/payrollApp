//standard amounts to withhold annually. divide this number by interval 

module.exports = {

fedBracketsMJ: {
    12550: 0,
    22500: 995,
    53075: 4664,
    98925: 14751,
    177475: 33603,
    221975: 47843,
    326700: 84496.75
    //remember - if > 326700, the number is 84496.75
},


fedBracketsS: {
    6275: 0,
    11250: 497,
    26538: 2332,
    49463: 7375.50,
    88738: 16801.50,
    110988: 23921.50,
    268075: 78902.13
    //remember, if > 268075, the number is 78902.13
},

fedBracketsHH: {
    9400: 0,
    16500: 710,
    36500: 3110,
    52575: 6646.50,
    91850: 16072.50,
    114100: 23192.50,
    271200: 78177.50,
    //remember, if > 271200, the number is 78177.50
},

//additional percentages to withhold. will run calculation that takes (sal - number) * percentage

fedAdditionalPercentageMJ: {
    //if amount exceeds key, multiply value by (sal - key)
    12550: 0.10,
    22500: 0.12,
    53075: 0.22,
    98925: 0.24,
    177475: 0.32,
    221975: 0.35,
    326700: 0.37
},

fedAdditionalPercentageS: {
    6275: 0.10,
    11250: 0.12,
    26538: 0.22,
    49463: 0.24,
    88738: 0.32,
    110988: 0.35,
    268075: 0.37
},

fedAdditionalPercentageHH: {
    9400: 0.10,
    16500: 0.12,
    36500: 0.22,
    52575: 0.24,
    91850: 0.32,
    114100: 0.35,
    271200: 0.37
},

//question: can we allow employers to stake FUTA and FICA withholdings to earn a % yield?
supplementalTaxes: {
    //FICA typically paid semi-weekly or monthly
    //calculate employer values on top of salary
    //only tax ss number on up to 142,800 x employer rate per employee for year
    "FICA_ss_employer": 0.031,
    "FICA_medicare_employee": 0.00725,
    //only deduct if employee makes above 200,000 per year - only taken from employee, not employer
    "additional_medicare": 0.009,
    //placeholder - will vary by state
    "state_unemployment": 0.01,
    //FUTA typically paid quarterly
    //only tax up to 7,000 x rate per employee for the year
    "FUTA": 0.06,
    //deduct from e salary
    //only withhold up to 142,800 x the employee rate
    "FICA_ss_employee": 0.031,
    "FICA_medicare_employer": 0.00725,
    
    //factor in for one off payments - not included yet
    "supplemental_bonus_rate": 0.22,
    "pay_over_million": 0.37
    
},

//individual calculations

calculateFedWithholdingsMJ(salary, interval, allowances) {
    let baseFedTax;
    let threshold;
    for (let value in this.fedBracketsMJ) {
        if (salary > value) {
            threshold = value;
        }
    }
    console.log(threshold);
    console.log(this.fedBracketsMJ[threshold]);
    baseFedTax = (this.fedBracketsMJ[threshold] * (interval / 365));
    console.log('base fed tax 2: ' + baseFedTax);        


let suppFedTax;
if (salary > 326700) {
    suppFedTax = ((salary  - baseFedTax) * 0.37) * (interval / 365);
    console.log('supp fed tax 1: ' + suppFedTax)
} else {
    let threshold = 0;
    let suppFedPercent;
    for (let value in this.fedAdditionalPercentageS) {
        if (salary > value) {
            threshold = value;
            suppFedPercent = this.fedAdditionalPercentageS[value];
        }
    }
    suppFedTax = ((suppFedPercent * (salary - threshold)) * (interval / 365));
    console.log('supp fed %: ' + suppFedPercent)
}

console.log(Number(baseFedTax));
console.log(Number(suppFedTax));
console.log((baseFedTax + suppFedTax))
let allowanceTotal = ((4300 * allowances) * (interval / 365));
console.log(allowances)
console.log(allowanceTotal);
let totalFedTax = baseFedTax + suppFedTax - allowanceTotal;
console.log(totalFedTax);

console.log("Total Federal Withholdings: " + totalFedTax);
return totalFedTax;

},


calculateFedWithholdingsS(salary, interval, allowances) {
   
        let baseFedTax;
        let threshold;
        for (let value in this.fedBracketsS) {
            if (salary > value) {
                threshold = value;
            }
        }
        console.log(threshold);
        console.log(this.fedBracketsS[threshold]);
        baseFedTax = (this.fedBracketsS[threshold] * (interval / 365));
        console.log('base fed tax 2: ' + baseFedTax);        
    

    let suppFedTax;
    if (salary > 268075) {
        suppFedTax = ((salary  - baseFedTax) * 0.37) * (interval / 365);
        console.log('supp fed tax 1: ' + suppFedTax)
    } else {
        let threshold = 0;
        let suppFedPercent;
        for (let value in this.fedAdditionalPercentageS) {
            if (salary > value) {
                threshold = value;
                suppFedPercent = this.fedAdditionalPercentageS[value];
            }
        }
        suppFedTax = ((suppFedPercent * (salary - threshold)) * (interval / 365));
        console.log('supp fed %: ' + suppFedPercent)
    }

    console.log(Number(baseFedTax));
    console.log(Number(suppFedTax));
    console.log((baseFedTax + suppFedTax))
    let allowanceTotal = ((4300 * allowances) * (interval / 365));
    console.log(allowances)
    console.log(allowanceTotal);
    let totalFedTax = baseFedTax + suppFedTax - allowanceTotal;
    console.log(totalFedTax);

    console.log("Total Federal Withholdings: " + totalFedTax);
    return totalFedTax;
    
},

calculateFedWithholdingsHH(salary, interval, allowances) {
    let baseFedTax;
        let threshold;
        for (let value in this.fedBracketsHH) {
            if (salary > value) {
                threshold = value;
            }
        }
        console.log(threshold);
        console.log(this.fedBracketsHH[threshold]);
        baseFedTax = (this.fedBracketsHH[threshold] * (interval / 365));
        console.log('base fed tax 2: ' + baseFedTax);        
    

    let suppFedTax;
    if (salary > 268075) {
        suppFedTax = ((salary  - baseFedTax) * 0.37) * (interval / 365);
        console.log('supp fed tax 1: ' + suppFedTax)
    } else {
        let threshold = 0;
        let suppFedPercent;
        for (let value in this.fedAdditionalPercentageHH) {
            if (salary > value) {
                threshold = value;
                suppFedPercent = this.fedAdditionalPercentageHH[value];
            }
        }
        suppFedTax = ((suppFedPercent * (salary - threshold)) * (interval / 365));
        console.log('supp fed %: ' + suppFedPercent)
    }

    console.log(Number(baseFedTax));
    console.log(Number(suppFedTax));
    console.log((baseFedTax + suppFedTax))
    let allowanceTotal = ((4300 * allowances) * (interval / 365));
    console.log(allowances)
    console.log(allowanceTotal);
    let totalFedTax = baseFedTax + suppFedTax - allowanceTotal;
    console.log(totalFedTax);

    console.log("Total Federal Withholdings: " + totalFedTax);
    return totalFedTax;

},


calculateStateWithholdings(salary, interval, state) {
    //placeholder - will vary by state
    let stateTax = 0.05;
    console.log("Total State Withholdings: " + ((salary * (interval / 365)) * stateTax));
    return `$${((salary * (interval / 365)) * stateTax).toFixed(2)}`;
},



calculateTotalFedWithholdings(salary, interval, filingStatus, allowances) {
    let fedTotal;
    if (filingStatus == "Married") {
        fedTotal = this.calculateFedWithholdingsMJ(salary, interval, allowances);
        console.log("Total Federal Withholdings: " + `$${fedTotal.toFixed(2)}`);
        return `$${fedTotal.toFixed(2)}`;
    }

    if(filingStatus == "Single") {
        fedTotal = this.calculateFedWithholdingsS(salary, interval, allowances);
        console.log("Total Federal Withholdings: " + `$${fedTotal.toFixed(2)}`);
        return `$${fedTotal.toFixed(2)}`;
    }

    if(filingStatus == "Head") {
        fedTotal = this.calculateFedWithholdingsHH(salary, interval, allowances);
        console.log("Total Federal Withholdings: " + `$${fedTotal.toFixed(2)}`);
        return `$${fedTotal.toFixed(2)}`;
    }
},

// calculateTotalWitholdings(salary, filingStatus, state, allowances) {
   
//     let f = this.calculateTotalFedWithholdings(salary, filingStatus, allowances);
//     let s = this.calculateStateWithholdings(salary, state);
//     console.log("Total Withholdings = State and Federal: " + (f + s));
//     return f + s;
// },

//calculate both state and fed withholdings
// calculateTotalWitholdings(100000, 'S', 'IL', 0);

//state will do nothing now, but we will need it later
calculateSupplementalEmployeeTaxes(salary, interval, state) {
    let ss;
    if (salary >= 142800) {
        ss = (142800 * this.supplementalTaxes["FICA_ss_employee"]) * (interval / 365);
    }
    else {
        
        ss = (salary * this.supplementalTaxes["FICA_ss_employee"]) * (interval / 365);
    }

    let medicare = (salary * this.supplementalTaxes["FICA_medicare_employee"]) * (interval / 365);
    let additional_medicare = 0;
    if (salary > 200000) {
        additional_medicare = (salary * this.supplementalTaxes["additional_medicare"]) * (interval / 365);
    }
    let payOverMillion = 0;
    if (salary > 1000000) {
        payOverMillion = ((salary - 1000000) * this.supplementalTaxes["pay_over_million"]) * (interval / 365);
    } 
    let total = ss + medicare + additional_medicare + payOverMillion;
    console.log("Total Employee Supplemental Withholdings: " + total);
    return total;
},


calculateEmployeeSS(salary, interval) {
    let ss;
    if (salary >= 142800) {
        ss = (142800 * this.supplementalTaxes["FICA_ss_employee"]) * (interval / 365);
    }
    else {
        
        ss = (salary * this.supplementalTaxes["FICA_ss_employee"]) * (interval / 365);
    }
    console.log("Employee SS: " + ss);
    return `$${ss.toFixed(2)}`;
},

calculateEmployeeMedicare(salary, interval) {
    let medicare = (salary * this.supplementalTaxes["FICA_medicare_employee"]) * (interval / 365);
    let additional_medicare = 0;
    if (salary > 200000) {
        additional_medicare = (salary * this.supplementalTaxes["additional_medicare"]) * (interval / 365);
    }
    console.log("Employee total Medicare: " + (medicare + additional_medicare));
    return `$${(medicare + additional_medicare).toFixed(2)}`;
},

calculateEmployeePayOverMillion(salary, interval) {
    let payOverMillion = 0;
    if (salary > 1000000) {
        payOverMillion = ((salary - 1000000) * this.supplementalTaxes["pay_over_million"]) * (interval / 365);
    } 
    console.log("Employee Pay Over $1M: " + payOverMillion);
    return `$${payOverMillion.toFixed(2)}`;
},



calculateNetPay(salary, interval, filingStatus, state, allowances) {
    let fed = this.calculateTotalFedWithholdings(salary, interval, filingStatus, allowances);
    let st = this.calculateStateWithholdings(salary, interval, state)
    let ss = parseInt((this.calculateEmployeeSS(salary, interval)).substring(1), 10)
    let med = parseInt((this.calculateEmployeeMedicare(salary, interval)).substring(1), 10);
    let payM = parseInt((this.calculateEmployeePayOverMillion(salary, interval)).substring(1), 10)
    let adjustedFed = parseInt(fed.substring(1), 10);
    let adjustedState = parseInt(st.substring(1), 10);
    let adjustedSupp = ss + med + payM;
  
    return `$${((salary * (interval / 365)) - (adjustedFed + adjustedState + adjustedSupp)).toFixed(2)}`;
},

calculateEmployeeContributions(salary, interval, filingStatus, state, allowances) {
    let fed = this.calculateTotalFedWithholdings(salary, interval, filingStatus, allowances);
    let st = this.calculateStateWithholdings(salary, interval, state)
    let ss = parseInt((this.calculateEmployeeSS(salary, interval)).substring(1), 10)
    let med = parseInt((this.calculateEmployeeMedicare(salary, interval)).substring(1), 10);
    let payM = parseInt((this.calculateEmployeePayOverMillion(salary, interval)).substring(1), 10)
    let adjustedFed = parseInt(fed.substring(1), 10);
    let adjustedState = parseInt(st.substring(1), 10);
    let adjustedSupp = ss + med + payM;
    return `$${(adjustedFed + adjustedState + adjustedSupp).toFixed(2)}`;
},

calculateTotalEmployerCost(salary, interval, state) {
    let ss = parseFloat((this.calculateEmployerSS(salary, interval)).substring(1), 10);
    let med = parseFloat((this.calculateEmployerMedicare(salary, interval)).substring(1), 10);
    let futa = parseFloat((this.calculateEmployerFUTA(salary, interval)).substring(1), 10);
    let u = parseFloat((this.calculateEmployerStateUnemployment(salary, interval, state)).substring(1), 10);
    return `$${(ss + med + futa + u + (salary * (interval / 365))).toFixed(2)}`;
},



//state will do nothing now, but will need later
//need to visually show this doing something in app
calculateEmployerTaxes(salary, state) {
    let ssEmployer;
    if (salary >= 142800) {
        ssEmployer = 142800 * this.supplementalTaxes["FICA_ss_employer"];
    }
    else {
        ssEmployer = salary * this.supplementalTaxes["FICA_ss_employeer"];
    }
    
    let medicareEmployer = salary * this.supplementalTaxes["FICA_medicare_employer"];
    let FUTA = 0;
    if (salary >= 7000) {
        FUTA = salary * this.supplementalTaxes["FUTA"];
    } else {
        FUTA = salary * this.supplementalTaxes["FUTA"];
    }

    //placeholder - will vary by state
    let stateUnemployment = salary * this.supplementalTaxes["state_unemployment"];
    let total = ssEmployer + medicareEmployer + FUTA + stateUnemployment;
    console.log("total employer supplemental tax: " + total);
},

calculateEmployerSS(salary, interval) {
    let ssEmployer = 0;
    if (salary >= 142800) {
        ssEmployer = (142800 * this.supplementalTaxes["FICA_ss_employer"]) * (interval / 365);
    }
    else {
        ssEmployer = (salary * this.supplementalTaxes["FICA_ss_employer"]) * (interval / 365);
    }
    console.log("SS employer: " + ssEmployer);
    return `$${ssEmployer.toFixed(2)}`;
},

calculateEmployerMedicare(salary, interval) {
    let medicareEmployer = (salary * this.supplementalTaxes["FICA_medicare_employer"]) * (interval / 365);
    console.log("medicare employer: " + medicareEmployer);
    return `$${medicareEmployer.toFixed(2)}`;
},

calculateEmployerFUTA(salary, interval) {
    let FUTA = 0;
    if (salary >= 7000) {
        FUTA = (salary * this.supplementalTaxes["FUTA"]) * (interval / 365);
    } else {
        FUTA = (salary * this.supplementalTaxes["FUTA"]) * (interval / 365);
    }
    console.log("FUTA: " + FUTA);
    return `$${FUTA.toFixed(2)}`;
},

calculateEmployerStateUnemployment(salary, interval, state) {
    //state will do nothing for now, just a placeholder
    let stateUnemployment = (salary * this.supplementalTaxes["state_unemployment"]) * (interval / 365);
    console.log("State unemployement: " + stateUnemployment);
    return `$${stateUnemployment.toFixed(2)}`;
}

// // module.exports (
// //     calculateFedWithholdings,
// //     calculateStateWithholdings,
// //     calculateTotalWitholdings,
// //     calculateEmployeeSS,
// //     calculateEmployeeMedicare,
// //     calculateEmployeePayOverMillion,
// //     //should prob change to total employee taxes
// //     //withhold this number from base pay
// //     calculateTotalTaxes,
    
// //     //display these numbers as set aside from balance
// //     calculateEmployerSS,
// //     calculateEmployerMedicare,
// //     calculateEmployerFUTA,
// //     calculateEmployerStateUnemployment,
// //     calculateEmployerTaxes
// // )
}

// module.exports = {fedBracketsMJ, };

//make all of these modular, then figure out how to 
// 1) store employee settings and info in a db
// 2) use the employee info to calculate payments, and store payments in our DB
// 3) render both our employee info settings and payments on the front end





// app.post("/pay-employee/", async (req, res) => {
//     try {
//         // const {id} = req.params;
//         const {employee_id, payment_date, gross_pay, federal_tax_withheld, state_tax_withheld, ss_tax_withheld, medicare_tax_withheld, pay_over_million_tax_withheld, net_pay
//         , company_id, employer_ss_withheld, employer_medicare_withheld, employer_FUTA_withheld, employer_state_u_withheld} = req.body;
//         const employeePayment = await pool.query(
//         "INSERT INTO employee_payments (employee_id, payment_date, gross_pay, federal_tax_withheld, state_tax_withheld, ss_tax_withheld, medicare_tax_withheld, pay_over_million_tax_withheld, net_pay) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
//         [employee_id, payment_date, gross_pay, federal_tax_withheld, state_tax_withheld, ss_tax_withheld, medicare_tax_withheld, pay_over_million_tax_withheld, net_pay]);
//         console.log(employeePayment.rows);

//         const employerPayment = await pool.query(
//         "INSERT INTO employer_payments (company_id, employee_id, payment_date, employer_ss_withheld, employer_medicare_withheld, employer_FUTA_withheld, employer_state_u_withheld) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", 
//         [company_id, employee_id, payment_date, employer_ss_withheld, employer_medicare_withheld, employer_FUTA_withheld, employer_state_u_withheld]);
//         console.log(employerPayment.rows);

//         res.json(employeePayment.rows, employerPayment.rows)


//     } catch (err) {
//         console.error(err.message)
//     }




// // function calculateFedWithholdings(salary, filingStatus, allowances) {
// //     if (filingStatus == 'MJ') {
// //         let baseFedTax;
// //         if (salary > 326700) {
// //             baseFedTax = 84496.75; 
// //         } else {
// //         for (let value in  fedBracketsMJ) {
// //             if (salary > value) {
// //                 baseFedTax = fedBracketsMJ[value] * salary;
// //             }
// //         }}

// //     let suppFedTax;
// //     if (salary > 326700) {
// //         suppFedTax = (salary - baseFedTax) * 0.37;
// //     } else {
// //         let suppFedPercent;
// //         for (let value in fedAdditionalPercentageMJ) {
// //             if (salary > value) {
// //                 suppFedPercent = fedAdditionalPercentageMJ[value];
// //                 suppFedTax = (salary - value) * suppFedPercent 
// //             }
// //         }
// //     }

// //     let totalFedTax = baseFedTax + suppFedTax - (4300 * allowances);
// //     console.log(totalFedTax);
// //     return totalFedTax;
// //     }

// //     if (filingStatus == 'S') {
// //         let baseFedTax;
// //         if (salary > 326700) {
// //             baseFedTax = 84496.75; 
// //         } else {
// //         for (let value in  fedBracketsS) {
// //             if (salary > value) {
// //                 baseFedTax = fedAdditionalPercentageS[value] * salary;
                
// //             }
// //         }}

// //     let suppFedTax;
// //     if (salary > 326700) {
// //         suppFedTax = (salary - baseFedTax) * 0.37;
// //     } else {
// //         let suppFedPercent;
// //         for (let value in fedAdditionalPercentageS) {
// //             if (salary > value) {
// //                 suppFedPercent = fedAdditionalPercentageS[value];
// //                 suppFedTax = (salary - value) * suppFedPercent 
// //             }
// //         }
// //     }

// //     let totalFedTax = baseFedTax + suppFedTax - (4300 * allowances);
// //     console.log(totalFedTax);
// //     return totalFedTax;
// //     }

// //     if (filingStatus == 'HH') {
// //         let baseFedTax;
// //         if (salary > 326700) {
// //             baseFedTax = 84496.75; 
// //         } else {
// //         for (let value in  fedBracketsHH) {
// //             if (salary > value) {
// //                 baseFedTax = fedBracketsHH[value] * salary;
                
// //             }
// //         }}

// //     let suppFedTax;
// //     if (salary > 326700) {
// //         suppFedTax = (salary - baseFedTax) * 0.37;
// //     } else {
// //         let suppFedPercent;
// //         for (let value in fedAdditionalPercentageHH) {
// //             if (salary > value) {
// //                 suppFedPercent = fedAdditionalPercentageHH[value];
// //                 suppFedTax = (salary - value) * suppFedPercent 
// //             }
// //         }
// //     }

// //     let totalFedTax = baseFedTax + suppFedTax - (4300 * allowances);
// //     console.log(totalFedTax);
// //     return totalFedTax;
// //     }
// // }




// calculateFedWithholdingsMJ(salary, interval, allowances) {
//     let baseFedTax;
//     if (salary > 326700) {
//         baseFedTax = (84496.75 * (interval / 365)); 
//     } else {
//     for (let value in  this.fedBracketsMJ) {
//         if (salary > value) {
//             baseFedTax = this.fedBracketsMJ[value] * (salary * (interval / 365));
//         }
//     }}

// let suppFedTax;
// if (salary > 326700) {
//     suppFedTax = ((salary  - baseFedTax) * 0.37) * (interval / 365);
// } else {
//     let suppFedPercent;
//     for (let value in this.fedAdditionalPercentageMJ) {
//         if (salary > value) {
//             suppFedPercent = this.fedAdditionalPercentageMJ[value];
//             suppFedTax = ((salary - value) * (interval / 365)) * suppFedPercent;
//         }
//     }
// }

// let totalFedTax = baseFedTax + suppFedTax - (4300 * allowances);
// console.log("Total Federal Withholdings: " + totalFedTax);
// return totalFedTax;
// },

// calculateFedWithholdingsHH(salary, interval, allowances) {
//     let baseFedTax;
//     if (salary > 271200) {
//         baseFedTax = (23192.50 * (interval / 365)); 
//     } else {
//     for (let value in  this.fedBracketsHH) {
//         if (salary > value) {
//             baseFedTax = this.fedBracketsHH[value] * (salary * (interval / 365));
            
//         }
//     }}

// let suppFedTax;
// if (salary > 271200) {
//     suppFedTax = ((salary  - baseFedTax) * 0.37) * (interval / 365);
// } else {
//     let suppFedPercent;
//     for (let value in this.fedAdditionalPercentageHH) {
//         if (salary > value) {
//             suppFedPercent = this.fedAdditionalPercentageHH[value];
//             suppFedTax = ((salary - value) * (interval / 365)) * suppFedPercent;
//         }
//     }
// }

// let totalFedTax = baseFedTax + suppFedTax - (4300 * allowances);
// console.log("Total Federal Withholdings: " + totalFedTax);
// return totalFedTax;

// },