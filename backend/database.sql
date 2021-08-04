CREATE DATABASE payrollapp;

CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    eth_address VARCHAR(50),
    company_id INT,
    first_name VARCHAR(150),
    last_name VARCHAR(150),
    salary MONEY,
    currency VARCHAR(150),
    fiat_currency VARCHAR(150),
    interval INT,
    state VARCHAR(150),
    filingstatus VARCHAR(150),
    allowances VARCHAR(150)
)
--add allowances, state, and filing status
    --store number between 0 and 1, i.e. 9.875% tax will be stored as .09875
    --don't think I need to store the rates here yet. keep in middleware for now
    -- federal_tax NUMERIC(5,5),
    -- state_tax NUMERIC(5,5),
    -- employee_ss_rate NUMERIC(5,5),
    -- employee_medicare NUMERIC(5,5),
    -- employer_ss NUMERIC(5,5),
    -- employer_medicare NUMERIC(5,5),
    -- employer_FUTA NUMERIC(5,5)


--need to add to ^this table: filing status, allowances

--need to understand:
--how to link a user from one table to a row in another table
--how best to represent numbers 
--run calculations in the DB or in the server?

CREATE TABLE employee_payments (
    company_id INT,
    employee_id INT, 
    payment_date VARCHAR(150),
    gross_pay MONEY,
    federal_tax_withheld MONEY,
    state_tax_withheld MONEY,
    ss_tax_withheld MONEY,
    medicare_tax_withheld MONEY,
    pay_over_million_tax_withheld MONEY,
    net_pay MONEY,
    employee_taxes MONEY
)

--can I link these to the employee_payments table?
--this is for individual payments per employee
CREATE TABLE employer_payments (
    company_id INT,
    employee_id INT,
    payment_date VARCHAR(150), 
    employer_ss_withheld MONEY,
    employer_medicare_withheld MONEY,
    employer_FUTA_withheld MONEY,
    employer_state_u_withheld MONEY,
    total_employer_cost MONEY
)

CREATE TABLE companies (
    company_id VARCHAR(255),
    company_owner_address VARCHAR(50),
    company_address VARCHAR(50),
    company_name VARCHAR(255)
)