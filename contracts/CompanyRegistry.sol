// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "./Company.sol";
import "./utils/Ownable.sol";

contract CompanyRegistry is Ownable{

    address public feeTo;
    address public feeToSetter;

    constructor(address _feeToSetter) {
        feeToSetter = _feeToSetter;
    }

    //map owner address to company address
    mapping (address => address) companies;
    // mapping (uint => address) idToOwner;
    //creating this array to make it possible to turn on protocol fee
    Company[] public companyList;
    // address[] public companyAddresses;
    uint256 public idCounter = 0;
    
    event companyCreated(address indexed _owner, address indexed _companyAddress, string indexed _companyName);
    event newCompanyOwner(address indexed _newOwner, address indexed _companyAddress);

    function getFeeToSetter() public view returns (address) {
        return feeToSetter;
    }

    function createCompany(string memory _name) public {
        //should prob prevent an owner from owning more than one company at a time
        Company newCompany = new Company(msg.sender, idCounter, _name);
        // newCompany.initialize(msg.sender, idCounter, _name);
        companies[msg.sender] = address(newCompany);
        //prob inefficient, rework
        companyList.push(newCompany);
        // companyAddresses.push(address(newCompany));
        idCounter++;
        //for some reason - this looks like it might be creating a new company registry contract, instead of a company contract
        // address newCompanyAddress = address(newCompany);
        emit companyCreated(msg.sender, companies[msg.sender], _name);
    }

    function getCompanyAddress(address _owner) public view returns (address) {
        return address(companies[_owner]);
    }

    function getAllCompanies() public view returns (address[] memory) {
        address[] memory list = new address[](companyList.length);
        for (uint i; i < companyList.length; i++) {
            //return the company address
            list[i] = (address(companyList[i]));
        }
        return list;
    }

    function setFeeTo(address _feeTo) external {
        require(msg.sender == feeToSetter, 'OpenPay: FORBIDDEN');
        feeTo = _feeTo;
    }

    function setFeeToSetter(address _feeToSetter) external {
        require(msg.sender == feeToSetter, 'OpenPay: FORBIDDEN');
        feeToSetter = _feeToSetter;
    }


//ensure that we're able to make this require statement work properly
//this is very important
//     function changeOwner(address _newOwner, uint _companyId) public {
//         //this isn't working because the msg.sender is the contract, not the owner when calling _changeOwner 
//         require(companies[_companyId].owner() == msg.sender);
//         companies[_companyId]._changeOwner(msg.sender, _newOwner);
//         address companyAddress = address(companies[_companyId]);
//         emit newCompanyOwner(_newOwner, companyAddress);
       
//     }
}