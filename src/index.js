//next steps 
//use web3 to create functionality that will work from front end > calling our functions on the back end
//consider additional back end options, like using link or Eth alarm clock for internvals
//also consider multisig functionality that requires employee or payee input to be paid
// make front end look nice with react...maybe even get real advanced and create a portal for the payee






const Web3 = require('web3');
require('@metamask/detect-provider');
const web3 = new Web3('HTTP://127.0.0.1:7545');

const payrollContract = require("/Users/samflamini/appPractice/payrollApp/build/contracts/Payroll.json");

//connect to metamask with this code

if (typeof window.ethereum !== 'undefined') {
  console.log('MetaMask is installed!');
  console.log('metamask connected');
}
else {
  console.log('you should consider metamask!')
}

const ethereumButton = document.querySelector('#enableEthereumButton');

ethereumButton.addEventListener('click', () => {
  //Will Start the metamask extension
  ethereum.request({ method: 'eth_requestAccounts' });
});

//make sure address is updated by redeploying to dev environment
//this is indeed returning a contract
//which means that web3 is working and that the ABI is working
const contractInstance = new web3.eth.Contract(payrollContract.abi, "0xf8977967BE27b5D223B2177433B0BB6564BB0578");

function contractBalance() {
  web3.eth.getBalance('0xf8977967BE27b5D223B2177433B0BB6564BB0578').then(console.log);
}
        
    class Employee {
    constructor(address, salary, interval, id) {
      this.address = address;
      this.salary = salary;
      this.interval = interval;
      this.id = id;
    }
  };
  
  const createEmployee = document.querySelector("#createEmployee");
  const payEmployee = document.querySelector("#payEmployee");
  const payId = document.querySelector("#payId");
  const fundingPayroll = document.querySelector('#fundingPayroll');
  let fundingAmount = document.querySelector("#fundingAmount");
  let employeeAddress = document.getElementById("address");
  let employeeSalary = document.querySelector("#salary");
  let paymentInterval = document.querySelector("#interval");
  const fundingDisplay = document.querySelector("#fundingDisplay");



  let employees = [];
  
  let idCount = 0;

  async function fund() {
    //call the fundPayroll function to send ETH to contract
    await contractInstance.methods.fundPayroll().send({from: ethereum.selectedAddress, value: fundingAmount.value});
    contractBalance();
    // let fundingBalance = web3.eth.getBalance('0xEEee69C18a68075a0d3f694316D7f40D8E30A795');
    // await document.createTextNode(fundingBalance);
};

  //function to allow us to call function which creates employees which are stored on chain
  //this is not working due to 'transaction cost too high' error...for some reason this operation takes 900 ETH in my dev environment
  //which is odd bc it should only call a single, non payable function
  async function createNewEmployee() {
    await contractInstance.methods.createEmployee(employeeAddress.value, employeeSalary.value, paymentInterval.value).send({ from: ethereum.selectedAddress, gas: 950000});
    idCount++;
    //can change getEmployeeById to take idCount as a param later, for now, we just want to see employee 0
    await console.log(contractInstance.methods.getEmployeeById(id).call());
  }


  async function payEmployeeById(id) {
    await contractInstance.methods.payEmployee(id)
    .send({from: ethereum.selectedAddress, gas: 850000 }, function (err, res) {
      if (err) {
        console.log("an error occured", err)
        return;
      }
      console.log("Hash of the transaction: " + res);
    });
    await console.log(contractInstance.methods.getEmployeeById(id).call());
  }

  async function getEmployee(id) {
    let employee = await contractInstance.methods.getEmployeeById(id).call();
    console.log(employee);
  }

  // getEmployee(0);
  // getEmployee(1);
  // getEmployee(2);
  // getEmployee(3);
  // getEmployee(4);
  // getEmployee(5);
  // getEmployee(6);


  fundingPayroll.addEventListener("submit", function (event) {
    event.preventDefault();
    fund();
    fundingPayroll.reset();
  })

  createEmployee.addEventListener("submit", function(event) {
    event.preventDefault();
    idCount++;
    createNewEmployee();
    employees.push(new Employee(employeeAddress.value, employeeSalary.value, paymentInterval.value, idCount));
    createEmployee.reset();
  })

  payEmployee.addEventListener("submit", function(event) {
    //only paying connected metamask now...need to inclue a form here
    event.preventDefault();
    payEmployeeById(payId.value);
    payEmployee.reset();
  })

  async function getBalance(address) {
    let bal = await contractInstance.methods.getEmployeeBalance(address).call();
    console.log(bal);
  }

  async function getList() {
    let list = await contractInstance.methods.getEmployees().call();
    console.log(list);
  }

  getList();
  getBalance("0x6F788d271c136368222A273767f3b39940f57fD0");






 
 



