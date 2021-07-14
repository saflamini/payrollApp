// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

//usdc can be sent to this contract
//need to have contract track its usdc balances
//need this contract to be able to pay out usdc to people that its owed to
//in my contract, I'll likely need to track these balances separately

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract usdcInteraction {
    ERC20 public _usdc = ERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);

    mapping (address => uint) companyUSDCBalances;
   
    function fundUSDC(address _from, uint256 _amount) public payable {
       //this function is to be called *after* approve has been called directly on the contract
       //this is the important function to take into payroll app
        _usdc.transferFrom(_from, address(this), _amount);
        companyUSDCBalances[_from] += _amount;
    }

    function getUSDC_ContractBalance(address _companyAddress) public view returns (uint) {
        return companyUSDCBalances[_companyAddress];
    }
}