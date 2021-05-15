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

//UPDATE 5/12/21 - need the best way to call employee information & update employee information from this contract
import "/prb-math/contracts/PRBMathUD60x18.sol";

contract Payroll {
    
    using PRBMathUD60x18 for uint;
    //setup section: defining data & storage types

    //struct that will allow us to create employees
    struct Employee {
        bool flag;
        address payable employeeAddress;
        uint salary;
        uint interval;
        uint earnings;
    }

    //The below code will help get us to CRUD functionality on back end.

    //new pattern here as an option
    mapping (address => Employee) public employees;
    // address[] public staff - consider using this code to build array of all employees in case we want to get all at once 


    

    //Create, edit, delete employee functions

    // function that will allow us to create a new employee using the employee struct
    function createEmployee(address payable _address, uint _salary, uint _interval) public {
        //employee must not yet exist
        require (employees[_address].flag == false);
        employees[_address] = Employee(true, _address, _salary, _interval, 0);
    }

    //need ability to edit current employee info
    //should probably split into two separate functions
    function editEmployeeSalary(address _address, uint _salary) public {
        require (_salary > 0);
        require (employees[_address].flag = true);
        employees[_address].salary = _salary;
    }

    function editEmployeeInterval(address _address, uint _interval) public {
        require (_interval > 0);
        require (employees[_address].flag = true);
        employees[_address].interval = _interval;
    }

    function deleteEmployee(address _address) public {
        require (employees[_address].flag = true);
        delete employees[_address];
    }
    
    
    //getting data section

    function getEmployeeInterval(address payable _address) public view returns (uint) {
        // require (employees[_address].flag = true);
        return employees[_address].interval;
    }
     
    function getEmployeeSalary(address _address) public view returns (uint) {
        // require (employees[_address].flag = true);
        return employees[_address].salary;
    }
    
    function getEmployeeBalance(address _address) public view returns (uint) {
        // require (employees[_address].flag = true);
        return employees[_address].earnings;
    }
    
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
    function fundPayroll() public payable {
    }
    
    
    //we are there, with the exception of handling the payment amount...solidity doesn't handle decimals well
    //need a way to work w decimals to create accurate payment amount
    //if we call this function, we pay the employee based on interval and salary
    //use a library for floating points
    function payEmployee(address _address) public {
    require (employees[_address].flag = true);
    //these payment intervals and amounts will be very important for our whole application.
    //technical challenges here - will want to support stablecoins eventuall
    //will also want to include decentralized price feeds that can convert $ to ETH easily
    //attempting to use library here - not working. For some reason the functions aren't working
        uint paymentInterval;
        //use library to create a payment interval to multiply by
        paymentInterval = PRBMathUD60x18.div(employees[_address].interval, 365);
        uint payment;
        //use library to multiply by fraction
        payment = PRBMathUD60x18.mul(employees[_address].salary, paymentInterval);
        address payable payee = employees[_address].employeeAddress;
        payee.transfer(payment);
        //add the payment amount to total earnings of the employee
        employees[_address].earnings += payment;
    }
    
    
}