// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

// this contract lets us create employees that we can then pay based on initial parameters we provide the contract
//we will use web3 js to call functions within this contract
//to begin, we'll make the time interval a centralized input 
//(after all, this would be trusted, the benefit is tx on chain and crypto payment rails as the back end if ETH scales)

//let's do the following:
//refactor code so that we are not storing balances or earnings on chain
//create a getEmployee function that allows us to query the employee list
//can remove the 'balance' variable
//make sure that payEmployee is executing properly, and uses an address vs an id for payment

//massive security holes:
//anyone can create an employee
// if anyone can create an employee, anyone can drain this contract
//if anyone can call pay employee, anyone can drain this contract

//UPDATE 5/12/21 - need the best way to call employee information & update employee information from this contract
import "/prb-math/contracts/PRBMathUD60x18.sol";

contract Payroll {
    
    using PRBMathUD60x18 for uint;
    //setup section: defining data & storage types

    //struct that will allow us to create employees
    struct Employee {
        //don't think flag is needed, should be able to find another way to require that an employee exists
        //it also doesn't cost anything for an employee to be added 2x, no? can't we error handle this somewhere else?
        // bool flag;
        address payable employeeAddress;
        uint salary;
        uint interval;
        uint companyId;
        //earnings not needed, can use events and queries to calculate them
        // uint earnings;
    }
    
    struct Company {
        string name;
        uint _id;
        address[] roster;
    }

    uint idGenerator = 0;
    //The below code will help get us to CRUD functionality on back end.

    //new pattern here as an option
    // mapping (address => Employee) public employees;
    // address[] public staff - consider using this code to build array of all employees in case we want to get all at once 
    
    //attempting to use this pattern instead
    //uint will be hash of co address and address
    mapping (bytes32 => Employee) public employees;
    //map address to co
    mapping (address => Company) public companies;
    //map co id to address
    mapping (uint => address) public companiesToOwner;
    //map co balances
    mapping (address => uint) public companyBalances;

    

    //need an only owner 'withdraw' function and event
    event payrollFunded(uint indexed _id, address indexed _address, uint indexed _amount);
    event employeePaid(address indexed _address, uint indexed _amount, uint indexed _companyId);
    // event employeeCreated(uint indexed _companyId, address indexed _address);
    event employeeCreated(address indexed _address, uint indexed _companyId, uint indexed _salary, uint _interval);
    event companyCreated(address indexed _address, uint _id, string indexed _name);
    event companyWithdrawal(address indexed _address, uint _id, uint _amount);

    //Create, edit, delete employee functions

    // function that will allow us to create a new company using the company struct
    //should we return the ID? probably
    function createCompany(string memory _name) public {
        uint coId = idGenerator;
        idGenerator++;
        Company memory company = Company(_name, coId, new address[](0));
        companies[msg.sender] = company;
        companiesToOwner[companies[msg.sender]._id] = msg.sender;
        companyBalances[msg.sender] = 0;
        emit companyCreated(msg.sender, coId, _name);
    }

   
    
    // function that will allow us to create a new employee using the employee struct
    function createEmployee(address payable _address, uint _salary, uint _interval, uint _coId) public {
        require (companiesToOwner[_coId] == msg.sender);
        Employee memory newEmployee = Employee(_address, _salary, _interval, _coId);
        bytes32 hashedEmployee = keccak256(abi.encodePacked(_address, _coId));
        employees[hashedEmployee] = newEmployee;
        companies[msg.sender].roster.push(_address);
        emit employeeCreated(_address, _coId, _salary, _interval);
        // emit employeeInfo(_address, _salary, _interval);
    }
    
    //needs to be edited to account for recent changes w hashed employee and co Id requirements
    function editEmployeeSalary(address _address, uint _coId, uint _salary) public {
        bytes32 hashedEmployee = keccak256(abi.encodePacked(_address, _coId));
        require(companiesToOwner[employees[hashedEmployee].companyId] == msg.sender);
        employees[hashedEmployee].salary = _salary;
        // require (_salary > 0);
        // require (employees[_address].flag = true);
    }
    
    //needs same edits as employee sal edit
    function editEmployeeInterval(address _address, uint _coId, uint _interval) public {
        bytes32 hashedEmployee = keccak256(abi.encodePacked(_address, _coId));
        require(companiesToOwner[employees[hashedEmployee].companyId] == msg.sender);
        employees[hashedEmployee].interval = _interval;
    }

    // function editEmployeeInterval(address _address, uint _interval) public {
    //     require (_interval > 0);
    //     require (employees[_address].flag = true);
    //     employees[_address].interval = _interval;
    // }
    //check
    function deleteEmployee(address _address, uint _coId) public {
        bytes32 hashedEmployee = keccak256(abi.encodePacked(_address, _coId));
        require(companiesToOwner[employees[hashedEmployee].companyId] == msg.sender);
        for (uint i; i < companies[msg.sender].roster.length; i++) {
            if (companies[msg.sender].roster[i] == _address) {
                delete companies[msg.sender].roster[i];
            }
        }
        delete employees[hashedEmployee];
    }
    
    
    //getting data section

    function getEmployeeInterval(address payable _address, uint _coId) public view returns (uint) {
        // require (employees[_address].flag = true);
        require(_coId == companies[msg.sender]._id);
        // require (employees[_address].companyId == companies[msg.sender]._id);
        bytes32 hashedEmployee = keccak256(abi.encodePacked(_address, _coId));
        return employees[hashedEmployee].interval;
    }
     
    function getEmployeeSalary(address _address, uint _coId) public view returns (uint) {
        // require (employees[_address].flag = true);
        require(_coId == companies[msg.sender]._id);
        // require (employees[_address].companyId == companies[msg.sender]._id);
        bytes32 hashedEmployee = keccak256(abi.encodePacked(_address, _coId));
        return employees[hashedEmployee].salary;
    }

     function getCompany(address _address) public view returns (string memory) {
        return companies[_address].name;
    }

    function getCompanyId(address _address) public view returns (uint) {
        return companies[_address]._id;
    }

    function getCompanyBalance(address _address) public view returns (uint) {
        return companyBalances[_address];
    }

    // function getEmployeesByCompany(uint _coId) public view returns (address[] memory) {
    //     address[] memory result = new address[](employeeList.length);
    //     for (uint i; i < employeeList.length; i++) {
    //         if (employeeList[i].companyId == _coId) {
    //             result.push(employeeList[i].employeeAddress);
    //         }
    //     }

    //     return result;
    // }
    
    //holy shit, I think that this worked. Try it again in app, then use getemployeeSal and getEmployeeInterval to return up to date salaries and intervals, and render them on front end.
    function getEmployeesByCompany(address _address) public view returns (address[] memory) {
        address[] memory employeeRoster = new address[](companies[msg.sender].roster.length);
        for (uint i; i < companies[_address].roster.length; i++) {
            employeeRoster[i] = companies[_address].roster[i];
        }
        return employeeRoster;
    }
    
    // function getEmployeeBalance(address _address) public view returns (uint) {
    //     // require (employees[_address].flag = true);
    //     return employees[_address].earnings;
    // }
    
    //do we really need this getter function?
    //can't we just store employee addresses on front end and read them from the contract at will?
    //can't we store our own front end copy of the smart contract data to use for looping & displaying this data?
    // function getEmployees() public view returns (address[] memory, uint[] memory, uint[] memory) {
    //     //this function allows us to get all employees by calling it - in the form of an array
    //     address[] memory employeeAddresses = new address[](employees.length);
    //     uint[] memory employeeSalaries = new uint[](employees.length);
    //     uint[] memory employeeIntervals = new uint[](employees.length);
    //     for (uint i = 0; i < employees.length; i++) {
    //         employeeAddresses[i] = employees[i].employeeAddress;
    //         employeeSalaries[i] = employees[i].salary;
    //         employeeIntervals[i] = employees[i].interval;
    //     }
    //     return (employeeAddresses, employeeSalaries, employeeIntervals);
    // }
    


    //key action section

    // function that allows us to fund the contract
    function fundPayroll(uint _id) public payable {
        require(companiesToOwner[_id] == msg.sender);
        companyBalances[msg.sender] += msg.value;
        emit payrollFunded(_id, msg.sender, msg.value);
    }

    function withdrawFunds(uint _amount, uint _id) public {
        require(companiesToOwner[_id] == msg.sender);
        companyBalances[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
        emit companyWithdrawal(msg.sender, companies[msg.sender]._id, _amount);
    }
    
    
    //we are there, with the exception of handling the payment amount...solidity doesn't handle decimals well
    //need a way to work w decimals to create accurate payment amount
    //if we call this function, we pay the employee based on interval and salary
    //use a library for floating points
    function payEmployee(address _address, uint _coId) public {
    bytes32 hashedEmployee = keccak256(abi.encodePacked(_address, _coId));
    require(companiesToOwner[employees[hashedEmployee].companyId] == msg.sender);
    //these payment intervals and amounts will be very important for our whole application.
    //technical challenges here - will want to support stablecoins eventuall
    //will also want to include decentralized price feeds that can convert $ to ETH easily
    //attempting to use library here - not working. For some reason the functions aren't working
        uint paymentInterval;
        //use library to create a payment interval to multiply by
        paymentInterval = PRBMathUD60x18.div(employees[hashedEmployee].interval, 365);
        uint payment;
        //use library to multiply by fraction
        payment = PRBMathUD60x18.mul(employees[hashedEmployee].salary, paymentInterval);
        address payable payee = employees[hashedEmployee].employeeAddress;
        companyBalances[msg.sender] -= payment;
        payee.transfer(payment);
        //add the payment amount to total earnings of the employee
        emit employeePaid(_address, payment, employees[hashedEmployee].companyId);
    }

}


