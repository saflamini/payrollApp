const express = require('express');
const app = express();
const cors = require('cors')
const pool = require('./db');
const taxRates = require("./taxRates")
const Web3 = require('web3');
const web3 = new Web3("http://127.0.0.1:8545")
const backendConfig = require("./backendConfig");
const BigNumber = require('bignumber.js');


// console.log(taxRates.calculateEmployerSS(14000))

//middleware -anytime you create middleware you need to use app.use
app.use(cors());
//request.body comes from client
app.use(express.json()); //this allows us to use request.body when making req and getting res

//ROUTES

app.post("/manage-roster", async (req, res) => {
    try {
        
        const {eth_address, company_id, first_name, 
              last_name, salary, currency, fiat_currency, 
              interval, state, filingstatus, allowances} = req.body;

    
        const newEmployee = await pool.query(
            "INSERT INTO employees (eth_address, company_id, first_name, last_name, salary, currency, fiat_currency, interval, state, filingstatus, allowances) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
        [eth_address, company_id, first_name, last_name, salary, currency, fiat_currency, interval, state, filingstatus, allowances]);
        res.json(newEmployee.rows[0]);
        // console.log(newEmployee.rows[0])
        
    } catch (err) {
        console.error(err.message);
        
    }
});

//get a single employee

app.get("/get-employee/:eth_address", async (req, res) => {
    try {
        const {eth_address} = req.params;
        // console.log(eth_address);
        // console.log(req.params);
        const employee = await pool.query("SELECT * FROM employees WHERE eth_address = $1", [`${eth_address}`]);

        // const employee = await pool.query("SELECT * FROM employees WHERE eth_address = $1", [ethaddress]);
        // console.log(employee)
        res.json(employee.rows[0])
        // console.log(employee.rows[0]);

    } catch (err) {
        console.error(err.message)
    }
})

//get all employees for a given company
app.get("/employee-list/:companyId", async (req, res) => {
    try {
        const {companyId} = req.params;
        const employees = await pool.query("SELECT * FROM employees WHERE company_id = $1", [companyId]);
        res.json(employees.rows);

    } catch (err) {
        console.error(err.message)
    }
})

//create a company
app.post("/create-company", async (req, res) => {
    try {
        const {company_id, company_owner_address, company_address, company_name} = req.body;
        const newCompany = await pool.query("INSERT INTO companies (company_id, company_owner_address, company_address, company_name) VALUES($1, $2, $3, $4) RETURNING *", 
        [company_id, company_owner_address, company_address, company_name]);
        // console.log(newCompany.rows)
        res.json(newCompany.rows);
        

    } catch (err) {
        console.error(err.message)
    }
})

//create a payment - will generate an employer and employee payment
app.post("/pay-employee/:coAddress/:account", async (req, res) => {
    try {
        // const {id} = req.params;
        // const {employee_id, payment_date, gross_pay, federal_tax_withheld, state_tax_withheld, ss_tax_withheld, medicare_tax_withheld, pay_over_million_tax_withheld, net_pay
        // , company_id, employer_ss_withheld, employer_medicare_withheld, employer_FUTA_withheld, employer_state_u_withheld} = req.body;
        const {coAddress, account} = req.params;

        const {first_name, last_name, eth_address, company_id, employee_id, currency_decimals, salary, interval, state, filingstatus, allowances, bonusAmount, paymentType} = req.body;

        let gross_pay;
        let federal_tax_withheld;
        let ss_tax_withheld;
        let medicare_tax_withheld;
        let pay_over_million_tax_withheld;
        let employer_ss_withheld;
        let employer_medicare_withheld;
        let employer_FUTA_withheld;
        let employer_state_u_withheld;
        let net_pay;
        let total_employer_cost;
        let employee_taxes;

        if (bonusAmount > 0) {
            gross_pay = (`$${bonusAmount.toFixed(2)}`);
            console.log(gross_pay)
            federal_tax_withheld = taxRates.calculateBonusFedWithholdings(bonusAmount);
            state_tax_withheld = taxRates.calculateBonusStateWithholdings(bonusAmount, state);
            ss_tax_withheld = taxRates.calculateBonusEmployeeSS(bonusAmount);
            medicare_tax_withheld = taxRates.calculateBonusEmployeeMedicare(salary, bonusAmount);
            pay_over_million_tax_withheld = taxRates.calculateBonusOverMillion(bonusAmount);
            employer_ss_withheld = taxRates.calculateBonusEmployerSS(bonusAmount);
            employer_medicare_withheld = taxRates.calculateBonusEmployerMedicare(bonusAmount);
            employer_FUTA_withheld = taxRates.calculateBonusFUTA(bonusAmount);
            employer_state_u_withheld = taxRates.calculateBonusEmployerStateUnemployment(bonusAmount, state);
            net_pay = taxRates.calculateNetBonusPay(bonusAmount, salary, state);
            total_employer_cost = taxRates.calculateEmployeeBonusCost(salary, bonusAmount, state)
            employee_taxes = taxRates.calculateEmployeeBonusContributions(salary, bonusAmount, state);
        }
        else {
            gross_pay = (`$${(salary * (interval / 365)).toFixed(2)}`);
            federal_tax_withheld = taxRates.calculateTotalFedWithholdings(salary, interval, filingstatus, allowances);
            state_tax_withheld = taxRates.calculateStateWithholdings(salary, interval, state);
            ss_tax_withheld = taxRates.calculateEmployeeSS(salary, interval);
            medicare_tax_withheld = taxRates.calculateEmployeeMedicare(salary, interval);
            pay_over_million_tax_withheld = taxRates.calculateEmployeePayOverMillion(salary, interval);
            employer_ss_withheld = taxRates.calculateEmployerSS(salary, interval);
            employer_medicare_withheld = taxRates.calculateEmployerMedicare(salary, interval);
            employer_FUTA_withheld = taxRates.calculateEmployerFUTA(salary, interval);
            employer_state_u_withheld = taxRates.calculateEmployerStateUnemployment(salary, interval, state);
            net_pay = taxRates.calculateNetPay(salary, interval, filingstatus, state, allowances);
            total_employer_cost = taxRates.calculateTotalEmployerCost(salary, interval, state)
            employee_taxes = taxRates.calculateEmployeeContributions(salary, interval, filingstatus, state, allowances);
        }
        // const payment_date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const payment_date = Date.now() //- (86400 * 15);

        let addr = web3.utils.toChecksumAddress(coAddress);
        let acct = web3.utils.toChecksumAddress(account);
        let eth_addr = web3.utils.toChecksumAddress(eth_address);
        // console.log(web3.eth.Contract)
        const CompanyContract = new web3.eth.Contract(backendConfig.CompanyABI, addr);
        // console.log(CompanyContract)

        //check bignumber strings and checksum addresses
        let gp = Number(gross_pay.slice(1))
        let np = Number(net_pay.slice(1));
        let employeeWithholdings = (gp - np);
        let d = currency_decimals;
        console.log(currency_decimals)

        console.log("decimals " + d)
        let eWithholdings = (new BigNumber(employeeWithholdings)).shiftedBy(currency_decimals);
        console.log("Gross Pay: " + gp);
        console.log("Net Pay: " + np)
        console.log("all withholdings: " + employeeWithholdings);

        console.log("EmployeeWithholdings: " + eWithholdings.c[0])


        //now - account for currency type and create sep function for paying entire payroll

        if (paymentType == "singlePayment") {
            console.log('single')
            await CompanyContract.methods.payEmployee(eth_addr, eWithholdings.c[0]).send({from: acct, gas: 6721975}).then(console.log);
            
        }

        else if (paymentType == "earlyPay") {
            console.log('earlyPay');
            await CompanyContract.methods.paidEarly(eth_addr, eWithholdings.c[0]).send({from: acct, gas: 6721975}).then(console.log)
        }
        
        else if (paymentType == "supplementalPayment") {
            console.log(gp)
            console.log(np)
            console.log(currency_decimals)
            let pmt;

            if (currency_decimals > 6) {
                pmt = web3.utils.toWei(gp.toString(), "ether");
                eWithholdings = web3.utils.toWei(employeeWithholdings.toString(), "ether");
                console.log(pmt);
                console.log(eWithholdings)
                await CompanyContract.methods.sendOneOffPayment(eth_addr, pmt, eWithholdings).send({from: acct, gas: 6721975}).then(console.log)
            }

            else {
                pmt = (new BigNumber(gp)).shiftedBy(currency_decimals);
                console.log(pmt.c[0]);
                console.log(eWithholdings.c[0])
                await CompanyContract.methods.sendOneOffPayment(eth_addr, pmt.c[0], eWithholdings.c[0]).send({from: acct, gas: 6721975}).then(console.log)
            }
            
        }        
        
        const payment = await pool.query(
        "INSERT INTO payments (first_name, last_name, eth_address, company_id, employee_id, payment_date, payment_type, currency_decimals, gross_pay, federal_tax_withheld, state_tax_withheld, ss_tax_withheld, medicare_tax_withheld, pay_over_million_tax_withheld, net_pay, employee_taxes, employer_ss_withheld, employer_medicare_withheld, employer_FUTA_withheld, employer_state_u_withheld, total_employer_cost) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *",
        [first_name, last_name, eth_address, company_id, employee_id, payment_date, paymentType, currency_decimals, gross_pay, federal_tax_withheld, state_tax_withheld, ss_tax_withheld, medicare_tax_withheld, pay_over_million_tax_withheld, net_pay, employee_taxes, employer_ss_withheld, employer_medicare_withheld, employer_FUTA_withheld, employer_state_u_withheld, total_employer_cost]);
        console.log(payment.rows[0]);

        res.json(payment.rows)
        
    } catch (err) {
        console.error(err.message)
    }
})

app.get("/employer-payments/:company_id", async (req, res) => {
    try {
        const {company_id} = req.params;
        //will definitely need to support filters
        const pay_period = 1 //parseInt((Date.now()) - (86400 * 14), 10);
        // console.log(pay_period)
        const paymentList = await pool.query(`SELECT * FROM payments WHERE company_id = $1 AND payment_date > $2`,
        [company_id, pay_period]);

        console.log(paymentList.rows[0])
       
        res.json(paymentList.rows);
        

    } catch (err) {
        console.error(err.message);
    }
})

app.get("/employee-payments/:employee_id", async (req, res) => {
    try {
        const {employee_id} = req.params;
        const employeePaymentList = await pool.query('SELECT * FROM payments WHERE employee_id = $1', 
        [employee_id]);

        // console.log(employeePaymentList.rows)
        res.json(employeePaymentList.rows);

    } catch (error) {
        console.error(err.message);
    }
})


//need an edit route
//choose employee and the item to edit
app.put("/edit-employee/:id/:item", async (req, res) => {
    try {
        const {id, item} = req.params;
        const {newValue} = req.body;
        const updatedValue = await pool.query(`UPDATE employees SET ${item.toString()} = $1 WHERE employee_id = $2`, 
        [newValue, id]);

        console.log(updatedValue.rows[0])

        res.json("employee updated")


    } catch (err) {
        console.error(err.message)
    }
})

//likely need to alter employee ID's here as well if this happens
app.delete("/delete-company/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const deleteCompany = await pool.query(
            "DELETE FROM companies WHERE company_id = $1", [id]
        );
        res.json("company has been deleted")

    } catch (err) {
        console.error(err.message)
    }
})

app.delete("/delete-employee/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const deleteEmployee = await pool.query(
            "DELETE FROM employees WHERE employee_id = $1", [Number(id)]
        );
        res.json("employee has been deleted")

    } catch (err) {
        console.error(err.message)
    }
})



app.listen(5000, () => {
    console.log('server has started on port 5000');
})

