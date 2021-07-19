// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

//new company contract which will be created at will
//make sure ownable, erc20, and math libraries all imported
import "./utils/ERC20.sol";
import "./utils/IERC20.sol";
import "./utils/SafeERC20.sol";
import "./utils/Ownable.sol";
import "./utils/PRBMathUD60x18.sol";
import "./utils/SafeMath.sol";
import "./CompanyRegistry.sol";


contract Company is Ownable {

    using SafeERC20 for IERC20;
    using SafeERC20 for ERC20;
    
    //company name
    string public name;
    // going to go only ERC - need stablecoins for payroll, not eth payments
    //company Id (set by the current value of ID counter in the registry contract on creation)
    uint256 companyId;
    
    //protocol fee - set to zero to begin
    uint protocolFee = 0;
    //where the protocol fee will be sent
    address protocolVault;

    //address of parent contract
    address public registry;

    //mapping of this conract's token balances - important for tracking value within the contract
    //may not actually end up necessary^
    mapping (address => uint) erc20Balances;


    constructor(address _owner, uint _companyId, string memory _name) {
        //caller is the parent contract
        registry = msg.sender;
        //ownership over this contract is the caller of the function in the parent contract
        Ownable.transferOwnership(_owner);
        companyId = _companyId;
        name = _name;
    }

    //may not be needed as we can query Ownable for this
    function getOwner() public view returns (address) {
        return Ownable.owner();
    }
    

//need to work with percentages here - ideally a require statement that prevents the fee from going over a certain level is what we need
//allows the parent contract to set value of protocol fee to be witheld on every tx if active
    function updateProtocolFee(uint _feeAmount, address _feeTo) public {
        //instantiate registry contract
        CompanyRegistry _companyRegistry = CompanyRegistry(registry);
        // require the caller of this function to be the feeSetter as specified in the company registry contract
        address feeToSetter = _companyRegistry.getFeeToSetter();
        require(msg.sender == feeToSetter);
        //fee should be a percentage - likely 30bps or 30/1000
        protocolFee = _feeAmount / 10000;
        protocolVault = _feeTo;
    }


    event payrollFunded(address indexed _address, address indexed _currency, uint indexed _amount);
    event employeePaid(address indexed _address, address indexed _currency, uint indexed _amount);
    event employeeCreated(address indexed _address, address indexed _currency, uint indexed _interval);
    event companyWithdrawal(address indexed _address, address _currency, uint _amount);

    //might not be needed within this contract
    function _changeOwner(address _newOwner) public {
        Ownable.transferOwnership(_newOwner);
    }

    //fund payroll with ERC 20 token
    function fundERCPayroll(uint _amount, address _token) public payable onlyOwner {
        IERC20 token = IERC20(_token);
        token.safeTransferFrom(msg.sender, address(this), _amount);
        //might remove this balances mapping
        erc20Balances[_token] += _amount;
        //how are we going to record who owns the company? Should we refer to contract itself in events or owner?
        emit payrollFunded(address(this), _token, _amount);
    }

    //allows the company to withdraw funds if needed
    function withdrawFunds(uint _amount, address _token) public onlyOwner {
        IERC20 token = IERC20(_token);
        //might remove this balances mapping to save on gas
        erc20Balances[_token] -= _amount; 
        address owner = Ownable.owner();
        //send value of withdrawal to the owner of the contract
        token.safeTransfer(owner, _amount);
        emit companyWithdrawal(address(this), _token, _amount);
    }

    struct Employee {
        address payable employeeAddress;
        address currency;
        uint salary;
        uint interval;
        //used to identify the last time paid early and pay employee was called for a given employee
        uint lastDayPaid;
        uint lastPaidEarly;
    }

    //maps employee address to Employee
    mapping (address => Employee) public employees;

    //our list of employees
    Employee[] public employeeList;
    
    //CRUD functionality
    function createEmployee(address payable _employeeAddress, address _currency, uint _salary, uint _interval) public onlyOwner {
        //added last day paid and lastpaid early here as 0 to instantiate them to zero
        //create new employee, add them to mapping and list
        Employee memory newEmployee = Employee(_employeeAddress, _currency, _salary, _interval, 0, 0);
        employees[_employeeAddress] = newEmployee;
        employeeList.push(newEmployee);
        emit employeeCreated(_employeeAddress, _currency, _interval);
    }

    function editEmployeeSalary(address _address, uint _newSalary) public onlyOwner {
        //may need another require statement here - check ownable contract
        require(_newSalary > 0, "Salary must be greater than 0");
        employees[_address].salary = _newSalary;
    }

  function editEmployeeInterval(address _address, uint _newInterval) public onlyOwner {
        //may need another require statement here - check ownable contract
        require(_newInterval > 0, "Interval must be greater than 0");
        employees[_address].interval = _newInterval;
    }

    function deleteEmployee(address _address) public onlyOwner {
        //may need another require statement here - check ownable contract
        for (uint i; i < employeeList.length; i++) {
            //potentially optimize this algorithm
            //for now, just looping from start to finish through empoyee list, and deleting our specificed employee
            if (employeeList[i].employeeAddress == _address) {
                delete employeeList[i];
            }
        }
    }


    //Getter functions
    function getEmployeeInterval(address payable _address) public view returns (uint) {
        return employees[_address].interval;
    }
     
     //getter functions
    function getEmployeeSalary(address _address) public view returns (uint) {
        return employees[_address].salary;
    }

    function getLastDayPaid(address _address) public view returns (uint) {
        return employees[_address].lastDayPaid;
    }


     function getCompanyName() public view returns (string memory) {
        return name;
    }

    // not needed, can use standard ERC20 procedures to get this
    function getCompanyBalance(address _tokenAddress) public view returns (uint) {
        return erc20Balances[_tokenAddress];
    }

    function getEmployeeCurrency(address _employeeAddress) public view returns (address) {
        return employees[_employeeAddress].currency;
    }

     //holy shit, I think that this worked. Try it again in app, then use getemployeeSal and getEmployeeInterval to return up to date salaries and intervals, and render them on front end.
    function getEmployeesByCompany() public view returns (address[] memory) {
        address[] memory employeeRoster = new address[](employeeList.length);
        for (uint i; i < employeeList.length; i++) {
            employeeRoster[i] = (employeeList[i].employeeAddress);
        }
        return employeeRoster;
    }

    //this should work for running entire payroll
    // function runPayroll() public onlyOwner {
    //      for (uint i; i < employeeList.length; i++) {
    //          address payable _address = employeeList[i].employeeAddress;
    //         payEmployee(_address);
    //      }
    // }


// run payroll across the entire company
//this function is still reverting on front end
    function runPayroll() public onlyOwner {
        //looping through employeelist
        for (uint i; i < employeeList.length; i++) {
            //pulling out an address for each employee - prob not needed
            address payable _address = employeeList[i].employeeAddress;
            //defining a payment interval to multiply payment by
            uint paymentInterval;
            //use library to create a payment interval to multiply by
            paymentInterval = PRBMathUD60x18.div(employees[_address].interval, 365);
            //convert interval days into seconds
            uint intervalSeconds = employees[_address].interval * 86400;
          

            //require last payment date to be at least interval days ago
            //last day paid + seconds since last day paid must be at least interval amount of time ago
            //it must be longer than interval days since the employee has been paid
            if (block.timestamp >= employees[_address].lastDayPaid + intervalSeconds) {
                //if the above is true, then
                //get the currency address of the employee and create the token contract insgtance
            address currency = employees[_address].currency;
            ERC20 tokenContract = ERC20(currency);

            //create variable for payment
            uint payment;

            //if a protocol fee
            if (protocolFee > 0) {
            //if protocol fee is turned on, send fee back to protocol before issuing payment
            //consider switching order of operations here, or simply holding it in a separate variable to be claimed in bulk by the network
            //would be ideal to NOT pass this gas payment along to users
            uint feeTotal;
            
            uint grossPayment = PRBMathUD60x18.mul(employees[_address].salary, paymentInterval);
            feeTotal = PRBMathUD60x18.mul(protocolFee, grossPayment);
            payment = SafeMath.sub(PRBMathUD60x18.mul(employees[_address].salary, paymentInterval), feeTotal);
            tokenContract.safeTransfer(protocolVault, feeTotal);
            }

            //use library to multiply by fraction
            if (protocolFee == 0) {
            payment = PRBMathUD60x18.mul(employees[_address].salary, paymentInterval);
            } 

            address payable payee = employees[_address].employeeAddress;
            erc20Balances[currency] -= payment;

            //set lastdaypaid to now
            employees[_address].lastDayPaid = block.timestamp;
            tokenContract.safeTransfer(payee, payment);
            //add the payment amount to total earnings of the employee
            emit employeePaid(_address, currency, payment);
            }
            
        }
    }

    // //let an employee to call this function to receive their pay early
    function paidEarly(address _address) public {
        //for now, the earlyWithdrawal fee is kept by the employer
        require(_address == msg.sender, "this function may only be called by the respective employee");
        // uint paymentInterval = employees[_address].interval;
        uint paymentInterval = PRBMathUD60x18.div(employees[_address].interval, 365);
        uint intervalSeconds = employees[_address].interval * 86400;

        //require the employee to wait at least interval days between uses of paid early        
        require (block.timestamp >= employees[_address].lastPaidEarly + intervalSeconds, "employee can only get paid on set time interval");

        //get payment and subtract fee

        address currency = employees[_address].currency;
        ERC20 tokenContract = ERC20(currency);

        uint payment;
        
        if (protocolFee > 0) {
            //if protocol fee is turned on, send fee back to protocol before issuing payment
            //consider switching order of operations here, or simply holding it in a separate variable to be claimed in bulk by the network
            //would be ideal to NOT pass this gas payment along to users
            uint feeTotal;
            // check this math, may need to use safeMath or recalculate
            uint grossPayment = PRBMathUD60x18.mul(employees[_address].salary, paymentInterval);
            //multiply by 1% in solidity, and subtract from payment
            uint earlyWithdrawalFee = grossPayment * 1 / 100;
            uint protocolFeeTotal = PRBMathUD60x18.mul(protocolFee, grossPayment);

            feeTotal = SafeMath.add(protocolFeeTotal, earlyWithdrawalFee);
            // payment = SafeMath.sub(PRBMathUD60x18.mul(employees[_address].salary, paymentInterval), feeTotal);
            payment = SafeMath.sub(grossPayment, feeTotal);

            tokenContract.safeTransfer(protocolVault, feeTotal);
        }

        //use library to multiply by fraction
        if (protocolFee == 0) {
        //add the actual amount
        uint grossPayment = PRBMathUD60x18.mul(employees[_address].salary, paymentInterval);
        uint earlyWithdrawalFee = grossPayment * 1 / 100;
        // uint earlyWithdrawalFee = PRBMathUD60x18.mul(grossPayment, withdrawalFee);

        payment = SafeMath.sub(grossPayment, earlyWithdrawalFee, "error - retry");

        } 

        address payable payee = employees[_address].employeeAddress;
        erc20Balances[currency] -= payment;
        
        //set last day paid and last paid early to now
        employees[_address].lastDayPaid = block.timestamp;
        employees[_address].lastPaidEarly = block.timestamp;

        //run payment

        tokenContract.safeTransfer(payee, payment);
        //add the payment amount to total earnings of the employee
        emit employeePaid(_address, currency, payment);
    }


//run payment for a single employee
    function payEmployee(address _address) public onlyOwner{
    //these payment intervals and amounts will be very important for our whole application.

        uint paymentInterval;
        //use library to create a payment interval to multiply by
        paymentInterval = PRBMathUD60x18.div(employees[_address].interval, 365);

        uint intervalSeconds = employees[_address].interval * 86400;

        //need to check if already paid via paidEarly() since the last time this function was called
        //we need to store the number of days since this function was called in our employee struct

        require (block.timestamp >= employees[_address].lastDayPaid + intervalSeconds);

        address currency = employees[_address].currency;
        ERC20 tokenContract = ERC20(currency);

        uint payment;

        
        if (protocolFee > 0) {
            //if protocol fee is turned on, send fee back to protocol before issuing payment
            //consider switching order of operations here, or simply holding it in a separate variable to be claimed in bulk by the network
            //would be ideal to NOT pass this gas payment along to users
            uint feeTotal;
            // check this math, may need to use safeMath or recalculate
            uint grossPayment = PRBMathUD60x18.mul(employees[_address].salary, paymentInterval);
            feeTotal = PRBMathUD60x18.mul(protocolFee, grossPayment);
            payment = SafeMath.sub(PRBMathUD60x18.mul(employees[_address].salary, paymentInterval), feeTotal);
            tokenContract.safeTransfer(protocolVault, feeTotal);
        }

        //use library to multiply by fraction
        if (protocolFee == 0) {
        payment = PRBMathUD60x18.mul(employees[_address].salary, paymentInterval);
        } 

        address payable payee = employees[_address].employeeAddress;
        erc20Balances[currency] -= payment;
        
        //set last day paid to now
        employees[_address].lastDayPaid = block.timestamp;

        tokenContract.safeTransfer(payee, payment);
        //add the payment amount to total earnings of the employee
        emit employeePaid(_address, currency, payment);
    }

    //pay employee one off payment - in event of user error or bonus
    function sendOneOffPayment(address _address, uint _amount) public onlyOwner {

        address currency = employees[_address].currency;
        ERC20 tokenContract = ERC20(currency);

        uint payment;

        if (protocolFee > 0) {
            //if protocol fee is turned on, send fee back to protocol before issuing payment
            //consider switching order of operations here, or simply holding it in a separate variable to be claimed in bulk by the network
            //would be ideal to NOT pass this gas payment along to users
            uint feeTotal;
            // check this math, may need to use safeMath or recalculate
            feeTotal = protocolFee;
            payment = SafeMath.sub(_amount, feeTotal);
            tokenContract.safeTransfer(protocolVault, feeTotal);
        }

        //use library to multiply by fraction
        if (protocolFee == 0) {
        payment = _amount;
        } 

        address payable payee = employees[_address].employeeAddress;
        //can likely remove our erc20 balances mapping
        erc20Balances[currency] -= payment;
        

        tokenContract.safeTransfer(payee, payment);
        //add the payment amount to total earnings of the employee
        emit employeePaid(_address, currency, payment);
    }
}