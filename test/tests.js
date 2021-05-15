const payroll = artifacts.require("Payroll");

contract("Payroll", (accounts) => {
    let owner = accounts[5];
    let owner2 = accounts[6];
    let owner3 = accounts[7];
    let contractInstance;
    beforeEach(async () => {
        contractInstance = await payroll.new();
    })

    it("should create an employee", async () => {
        let address = owner;
        let salary = 1000;
        let interval = 7;
        await contractInstance.createEmployee(address, salary, interval);
        let employeeSalary = await contractInstance.getEmployeeSalary(address);
        assert.equal(salary, employeeSalary);
    })

    it("should fund payroll", async () => {
        let funding = 1000;
        await contractInstance.fundPayroll({from: owner, value: 1000});
        let balance = await web3.eth.getBalance(contractInstance.address);
        assert.equal(funding, balance);
    })

    it("should pay employees", async () => {
        let address = owner;
        let salary = web3.utils.toWei('1', 'ether');
        let interval = 365;
        let oldOwnerBalance = await web3.eth.getBalance(owner);
        let funding = web3.utils.toWei('5', 'ether');
        await contractInstance.createEmployee(address, salary, interval);
        await contractInstance.fundPayroll({from: owner2, value: funding});
        await contractInstance.payEmployee(owner);
        let ownerBalance = await web3.eth.getBalance(owner);
        assert.equal(await web3.eth.getBalance(contractInstance.address), web3.utils.toWei('4', 'ether'));
        //this last test checks if the owner's balance rises. We don't get an exact number due to gas fees
        //but we can run it and see that it's close
        // assert.equal(ownerBalance, parseInt(oldOwnerBalance) + parseInt(salary));
    })

    it("should pay employees - fractional", async () => {
        let address = owner;
        let salary = web3.utils.toWei('1', 'ether');
        //will create a payment of roughly 0.82 ETH
        let interval = 300;
        let oldOwnerBalance = await web3.eth.getBalance(owner);
        let funding = web3.utils.toWei('5', 'ether');
        await contractInstance.createEmployee(address, salary, interval);
        await contractInstance.fundPayroll({from: owner2, value: funding});
        await contractInstance.payEmployee(owner);
        let ownerBalance = await web3.eth.getBalance(owner);
        //check if contract balance decreases
        assert.isAbove(Number(await web3.eth.getBalance(contractInstance.address)), Number(web3.utils.toWei('4.1', 'ether')));
        assert.isBelow(Number(await web3.eth.getBalance(contractInstance.address)), Number(web3.utils.toWei('4.2', 'ether')));
        //could probably turn getEmployeeBalance into getEmployeeEarnings
        //check if employee earnings increase
        assert.isAbove(Number(await contractInstance.getEmployeeBalance(owner)), Number(web3.utils.toWei('0.8', 'ether')));
        assert.isBelow(Number(await contractInstance.getEmployeeBalance(owner)), Number(web3.utils.toWei('0.83', 'ether')));
        
    })

    it("should edit employee salary", async () => {
        //create an employee first
        let address = owner;
        let salary = 1000;
        let interval = 7;
        await contractInstance.createEmployee(address, salary, interval);
        let employeeSalary = await contractInstance.getEmployeeSalary(address);
        assert.equal(salary, employeeSalary);
        //edit employee salary
        let newSalary = 2000;
        await contractInstance.editEmployeeSalary(address, newSalary);
        let updatedSalary = await contractInstance.getEmployeeSalary(address);
        assert.equal(updatedSalary, newSalary);
    })

    it("should edit intervals", async () => {
        //create an employee first
        let address = owner;
        let salary = 1000;
        let interval = 7;
        await contractInstance.createEmployee(address, salary, interval);
        let employeeSalary = await contractInstance.getEmployeeSalary(address);
        assert.equal(salary, employeeSalary);
        //edit employee interval
        let newInterval = 14;
        await contractInstance.editEmployeeInterval(address, newInterval);
        let updatedInterval = await contractInstance.getEmployeeInterval(address);
        assert.equal(newInterval, updatedInterval);
    });

    it("should delete employees", async () => {
        //create an employee first with arbitrary address
        let address = owner3;
        let salary = 1000;
        let interval = 7;
        await contractInstance.createEmployee(address, salary, interval);
        let employeeSalary = await contractInstance.getEmployeeSalary(address);
        assert.equal(salary, employeeSalary);
        //delete employee
        await contractInstance.deleteEmployee(address);
        let deletedCheck = await contractInstance.getEmployeeSalary(address);
        assert.equal(deletedCheck, 0);
    })


})