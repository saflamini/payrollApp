import { BigNumber } from "bignumber.js";

const Web3 = require('web3');
const web3 = new Web3('http://127.0.0.1:8545');


const assets = {
    usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    dai: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7"
  }

const ERC20ABI = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name_",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "symbol_",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "addedValue",
          "type": "uint256"
        }
      ],
      "name": "increaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "subtractedValue",
          "type": "uint256"
        }
      ],
      "name": "decreaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]

  const USDCAddress = assets["usdc"]
  const DAIAddress = assets["dai"]
  const USDTAddress = assets["usdt"]

export const USDC = new web3.eth.Contract(ERC20ABI, USDCAddress);
export const DAI = new web3.eth.Contract(ERC20ABI, DAIAddress);
export const USDT = new web3.eth.Contract(ERC20ABI, USDTAddress)

// const USDC = new web3.eth.Contract(ERC20ABI, USDCAddress);
// const DAI = new web3.eth.Contract(ERC20ABI, DAIAddress);
// const USDT = new web3.eth.Contract(ERC20ABI, USDTAddress)




  const whale = "0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503"
  //change these two for each restart
  // const user = ""; //account 10
  const user2 = "0x0cd12bdD13d53B2961C17C3D36842b68bee3B4Ec" //account 9
  const companyAddress = "0xec4630280D4Ad7641091B2E3832E9b89b04c6598"
  


  // USDC.methods.transfer(user2, (new BigNumber(1000000).shiftedBy(6))).send({from: whale}).then(console.log);
  // DAI.methods.transfer(user2, (new BigNumber(1000000).shiftedBy(18))).send({from: whale}).then(console.log);
  // USDT.methods.transfer(user2, (new BigNumber(1000000).shiftedBy(6))).send({from: whale}).then(console.log);

  // USDC.methods.approve(companyAddress, 900000000000).send({from: whale}).then(console.log);
  // DAI.methods.approve(companyAddress, 900000000000).send({from: whale}).then(console.log);
  // USDT.methods.approve(companyAddress, 900000000000).send({from: whale}).then(console.log);

  // USDC.methods.approve(companyAddress, (new BigNumber(1000000).shiftedBy(6))).send({from: user2,  gas: 6721975}).then(console.log);
  // DAI.methods.approve(companyAddress, (new BigNumber(1000000).shiftedBy(18))).send({from: user2,  gas: 6721975}).then(console.log);
  //   USDT.methods.approve(companyAddress, (new BigNumber(1000000).shiftedBy(6))).send({from: user2,  gas: 6721975}).then(console.log);

// console.log(USDT.methods)
// USDT.methods.balanceOf(companyAddress).call().then(console.log);
// USDT.methods.balanceOf(user).call().then(console.log)

// USDT.methods.approve(companyAddress, 6000000).send({from: user,  gas: 6721975}).then(console.log)
// USDT.methods.allowance(companyAddress, user).call().then(console.log)


  //transfer tokens from whale to account we intend to use

  //ganache-cli --fork https://mainnet.infura.io/v3/09026dadca7744ea9d976f85b2a9723e --unlock 0x47ac0fb4f2d84898e4d9e7b4dab3c24507ad503