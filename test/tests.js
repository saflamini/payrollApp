// import { web3 } from "../../employee-form/src/config";

const payroll = artifacts.require("Payroll");

contract("Payroll", (accounts) => {
    let companyOwner = accounts[2];
    let owner = accounts[5];
    let owner2 = accounts[6];
    let owner3 = accounts[7];
    let contractInstance;
    beforeEach(async () => {
        contractInstance = await payroll.new();
    })

    it("should create a company", async () => {
        let companyAddress = companyOwner;
        let name = "SF Co";
        await contractInstance.createCompany(name, {from: companyAddress})
        let companyName = await contractInstance.getCompany(companyAddress);
        assert.equal(name, companyName);
    })

    it("should create an employee", async () => {
        let companyAddress = companyOwner;
        let companyName = "SF Co";
        await contractInstance.createCompany(companyName, {from: companyAddress});
        let employeeAddress = owner;
        let salary = 1000;
        let interval = 7;
        let id = 0;
        await contractInstance.createEmployee(employeeAddress, salary, interval, id, {from: companyAddress});
        let employeeSalary = await contractInstance.getEmployeeSalary(employeeAddress);
        assert.equal(salary, employeeSalary);
    })

    it("should fund payroll", async () => {
        let companyAddress = companyOwner;
        let companyName = "SF Co";
        await contractInstance.createCompany(companyName, {from: companyAddress});
        let id = 0;
        let funding = 1000;
        await contractInstance.fundPayroll(id, {from: companyAddress, value: 1000});
        let balance = await web3.eth.getBalance(contractInstance.address);
        let companyBalance = await contractInstance.getCompanyBalance(companyAddress);
        assert.equal(funding, balance, companyBalance);
    })

    it("should pay employees", async () => {
        let companyAddress = companyOwner;
        let companyName = "SF co";
        await contractInstance.createCompany(companyName, {from: companyAddress});
        let id = 0;
        let address = owner;
        let salary = web3.utils.toWei('1', 'ether');
        let interval = 365;
        let oldOwnerBalance = await web3.eth.getBalance(owner);
        let funding = web3.utils.toWei('5', 'ether');
        await contractInstance.createEmployee(address, salary, interval, id, {from: companyAddress});
        await contractInstance.fundPayroll(id, {from: companyAddress, value: funding});
        let initialCoBalance = contractInstance.getCompanyBalance(companyAddress);
        await contractInstance.payEmployee(owner, {from: companyAddress});
        let ownerBalance = await web3.eth.getBalance(owner);
        let companyBalance = await contractInstance.getCompanyBalance(companyAddress)
        assert.equal(await web3.eth.getBalance(contractInstance.address), web3.utils.toWei('4', 'ether'));
        //check if paying employees lowers the balance of company
        assert.equal(companyBalance, web3.utils.toWei('4', 'ether'));
    })



    it("should pay employees - fractional", async () => {
        let companyAddress = companyOwner;
        let companyName = "SF co"
        await contractInstance.createCompany(companyName, {from: companyAddress});
        let id = 0;
        let address = owner;
        let salary = web3.utils.toWei('1', 'ether');
        //will create a payment of roughly 0.82 ETH
        let interval = 300;
        let oldOwnerBalance = await web3.eth.getBalance(owner);
        let funding = web3.utils.toWei('5', 'ether');
        await contractInstance.createEmployee(address, salary, interval, id, {from: companyAddress});
        await contractInstance.fundPayroll(id, {from: companyAddress, value: funding});
        await contractInstance.payEmployee(owner, {from: companyAddress});
        let ownerBalance = await web3.eth.getBalance(owner);
        //check if contract balance decreases
        assert.isAbove(Number(await web3.eth.getBalance(contractInstance.address)), Number(web3.utils.toWei('4.1', 'ether')));
        assert.isBelow(Number(await web3.eth.getBalance(contractInstance.address)), Number(web3.utils.toWei('4.2', 'ether')));
        //could probably turn getEmployeeBalance into getEmployeeEarnings
        //check if employee earnings increase
        // assert.isAbove(Number(await web3.eth.getBalance(owner)) - Number(web3.utils.toWei('100', 'ether')), Number(web3.utils.toWei('0.8', 'ether')));
        // assert.isBelow(Number(await web3.eth.getBalance(owner)) - Number(web3.utils.toWei('100', 'ether')), Number(web3.utils.toWei('0.83', 'ether')));
        
    })

    it("should edit employee salary", async () => {
        let companyAddress = companyOwner;
        let companyName = "SF co"
        await contractInstance.createCompany(companyName, {from: companyAddress});
        let id = 0;
        //create an employee first
        let address = owner;
        let salary = 1000;
        let interval = 7;
        await contractInstance.createEmployee(address, salary, interval, id, {from: companyOwner});
        let employeeSalary = await contractInstance.getEmployeeSalary(address);
        assert.equal(salary, employeeSalary);
        //edit employee salary
        let newSalary = 2000;
        await contractInstance.editEmployeeSalary(address, newSalary, {from: companyOwner});
        let updatedSalary = await contractInstance.getEmployeeSalary(address);
        assert.equal(updatedSalary, newSalary);
    })

    it("should edit intervals", async () => {
        let companyAddress = companyOwner;
        let companyName = "SF co"
        await contractInstance.createCompany(companyName, {from: companyAddress});
        let id = 0;
        //create an employee first
        let address = owner;
        let salary = 1000;
        let interval = 7;
        await contractInstance.createEmployee(address, salary, interval, id, {from: companyOwner});
        let employeeSalary = await contractInstance.getEmployeeSalary(address);
        assert.equal(salary, employeeSalary);
        //edit employee interval
        let newInterval = 14;
        await contractInstance.editEmployeeInterval(address, newInterval, {from: companyOwner});
        let updatedInterval = await contractInstance.getEmployeeInterval(address);
        assert.equal(newInterval, updatedInterval);
    });

    it("should delete employees", async () => {
        let companyAddress = companyOwner;
        let companyName = "SF co"
        await contractInstance.createCompany(companyName, {from: companyAddress});
        let id = 0;
        //create an employee first with arbitrary address
        let address = owner3;
        let salary = 1000;
        let interval = 7;
        await contractInstance.createEmployee(address, salary, interval, id, {from: companyOwner});
        let employeeSalary = await contractInstance.getEmployeeSalary(address);
        assert.equal(salary, employeeSalary);
        //delete employee
        await contractInstance.deleteEmployee(address, {from: companyOwner});
        let deletedCheck = await contractInstance.getEmployeeSalary(address);
        assert.equal(deletedCheck, 0);
    })


})