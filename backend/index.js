const express = require('express');
const app = express();
const cors = require('cors')
const pool = require('./db');
const taxRates = require("./taxRates")

console.log(taxRates.calculateEmployerSS(14000))

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
        console.log(newEmployee.rows[0])
        
    } catch (err) {
        console.error(err.message);
        
    }
});

//get a single employee

app.get("/get-employee/:eth_address", async (req, res) => {
    try {
        const {eth_address} = req.params;
        console.log(eth_address);
        console.log(req.params);
        const employee = await pool.query("SELECT * FROM employees WHERE eth_address = $1", [`${eth_address}`]);

        // const employee = await pool.query("SELECT * FROM employees WHERE eth_address = $1", [ethaddress]);
        console.log(employee)
        res.json(employee.rows[0])
        console.log(employee.rows[0]);

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
        console.log(newCompany.rows)
        res.json(newCompany.rows);
        

    } catch (err) {
        console.error(err.message)
    }
})

//create a payment - will generate an employer and employee payment
app.post("/pay-employee", async (req, res) => {
    try {
        // const {id} = req.params;
        // const {employee_id, payment_date, gross_pay, federal_tax_withheld, state_tax_withheld, ss_tax_withheld, medicare_tax_withheld, pay_over_million_tax_withheld, net_pay
        // , company_id, employer_ss_withheld, employer_medicare_withheld, employer_FUTA_withheld, employer_state_u_withheld} = req.body;
        
        const {company_id, employee_id, salary, interval, state, filingstatus, allowances} = req.body;

        // const payment_date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const payment_date = Date.now() //- (86400 * 15);
        const gross_pay = (`$${(salary * (interval / 365)).toFixed(2)}`);
        const federal_tax_withheld = taxRates.calculateTotalFedWithholdings(salary, interval, filingstatus, allowances);
        const state_tax_withheld = taxRates.calculateStateWithholdings(salary, interval, state);
        const ss_tax_withheld = taxRates.calculateEmployeeSS(salary, interval);
        const medicare_tax_withheld = taxRates.calculateEmployeeMedicare(salary, interval);
        const pay_over_million_tax_withheld = taxRates.calculateEmployeePayOverMillion(salary, interval);
        const employer_ss_withheld = taxRates.calculateEmployerSS(salary, interval);
        const employer_medicare_withheld = taxRates.calculateEmployerMedicare(salary, interval);
        const employer_FUTA_withheld = taxRates.calculateEmployerFUTA(salary, interval);
        const employer_state_u_withheld = taxRates.calculateEmployerStateUnemployment(salary, interval, state);
        const net_pay = taxRates.calculateNetPay(salary, interval, filingstatus, state, allowances);
        const total_employer_cost = taxRates.calculateTotalEmployerCost(salary, interval, state)
        const employee_taxes = taxRates.calculateEmployeeContributions(salary, interval, filingstatus, state, allowances);
        // const net_pay = `$${(gross_pay - (federal_tax_withheld + state_tax_withheld + ss_tax_withheld + medicare_tax_withheld + pay_over_million_tax_withheld)).toFixed(2)}`;
        console.log('Payment Date: ' + payment_date);
        console.log('Employee Gross: ' + gross_pay);
        console.log('Employee Fed ' + federal_tax_withheld);
        console.log('Employee State tax ' + state_tax_withheld);
        console.log('Employee ss ' + ss_tax_withheld);
        console.log('Employee Med ' + medicare_tax_withheld);
        console.log('Pay > $1M tax: ' + pay_over_million_tax_withheld);
        console.log('Employer SS: ' + employer_ss_withheld);
        console.log('Employer Med: ' + employer_medicare_withheld);
        console.log('FUTA: ' + employer_FUTA_withheld);
        console.log('Employer State U: ' + employer_state_u_withheld);
        console.log('Net Pay: ' + net_pay)
        
        const employeePayment = await pool.query(
        "INSERT INTO employee_payments (company_id, employee_id, payment_date, gross_pay, federal_tax_withheld, state_tax_withheld, ss_tax_withheld, medicare_tax_withheld, pay_over_million_tax_withheld, net_pay, employee_taxes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
        [company_id, employee_id, payment_date, gross_pay, federal_tax_withheld, state_tax_withheld, ss_tax_withheld, medicare_tax_withheld, pay_over_million_tax_withheld, net_pay, employee_taxes]);
        console.log(employeePayment.rows);

        const employerPayment = await pool.query(
        "INSERT INTO employer_payments (company_id, employee_id, payment_date, employer_ss_withheld, employer_medicare_withheld, employer_FUTA_withheld, employer_state_u_withheld, total_employer_cost) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", 
        [company_id, employee_id, payment_date, employer_ss_withheld, employer_medicare_withheld, employer_FUTA_withheld, employer_state_u_withheld, total_employer_cost]);
        console.log(employerPayment.rows);

        res.json(employeePayment.rows)
        
    } catch (err) {
        console.error(err.message)
    }
})

app.get("/employer-payments/:company_id", async (req, res) => {
    try {
        const {company_id} = req.params;
        //will definitely need to support filters
        const pay_period = 1 //parseInt((Date.now()) - (86400 * 14), 10);
        console.log(pay_period)
        const paymentList = await pool.query(`SELECT * FROM employer_payments WHERE company_id = $1 AND payment_date > $2`,
        [company_id, pay_period]);

        const employeePaymentList = await pool.query(`SELECT * FROM employee_payments WHERE company_id = $1 AND payment_date > $2`,
        [company_id, pay_period]);

        console.log(paymentList.rows)
        console.log(employeePaymentList.rows)

        // const {employee_taxes} = employeePaymentList.rows[0];
        // const {total_employer_cost} = paymentList.rows[0];

        // console.log(employee_taxes);
        // console.log(total_employer_cost);
       
        res.json(paymentList.rows);

    } catch (err) {
        console.error(err.message);
    }
})

app.get("/employee-payments/:employee_id", async (req, res) => {
    try {
        const {employee_id} = req.params;
        const employeePaymentList = await pool.query('SELECT * FROM employee_payments WHERE employee_id = $1', 
        [employee_id]);

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
        console.log(item);
        const updatedValue = await pool.query(`UPDATE employees SET ${item.toString()} = $1 WHERE employee_id = $2`, 
        [newValue, id]);

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
            "DELETE FROM employees WHERE employee_id = $1", [id]
        );
        res.json("company has been deleted")

    } catch (err) {
        console.error(err.message)
    }
})



app.listen(5000, () => {
    console.log('server has started on port 5000');
})

