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

const contractInstance = new web3.eth.Contract(payrollContract.abi, "0xB2b0950Bb7833E130d5A05AE156F5D91CD6CF53f");

function contractBalance() {
  web3.eth.getBalance('0xB2b0950Bb7833E130d5A05AE156F5D91CD6CF53f').then(console.log);
}
    
//class for front end (off chain) employee creation
    class Employee {
    constructor(name, address, salary, interval, id) {
      this.name = name;
      this.address = address;
      this.salary = salary;
      this.interval = interval;
      this.id = id;
    }
  };
  

  const createEmployee = document.querySelector("#createEmployee");
  const payEmployee = document.querySelector("#payEmployee");

  let deleteEmployee = document.querySelector("#deleteEmployee");
  let paymentAddress = document.querySelector("#paymentAddress");
  let deleteAddress = document.querySelector("#deleteAddress");

  const fundingPayroll = document.querySelector('#fundingPayroll');
  let fundingAmount = document.querySelector("#fundingAmount");

  let employeeName = document.querySelector("#employeeName");
  let employeeAddress = document.getElementById("address");
  let employeeSalary = document.querySelector("#salary");
  let paymentInterval = document.querySelector("#interval");
  const fundingDisplay = document.querySelector("#fundingDisplay");



  let employeeList = [];
  
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
    await contractInstance.methods.createEmployee(employeeAddress.value, employeeSalary.value, paymentInterval.value)
    .send({ from: ethereum.selectedAddress, gas: 950000}, function (err, res) {
      if (err) {
        console.log("an error occured", err)
        return;
      }
      console.log("Hash of the transaction: " + res);
    });
  //   let sal = await contractInstance.methods.getEmployeeSalary(employeeAddress.value).call();
  //   console.log("hey is this working?" + sal);
  }


  async function payEmployeeByAddress(address) {
    await contractInstance.methods.payEmployee(address)
    .send({from: ethereum.selectedAddress, gas: 850000 }, function (err, res) {
      if (err) {
        console.log("an error occured", err)
        return;
      }
      console.log("Hash of the transaction: " + res);
    });
    return true;
    // console.log(await contractInstance.methods.getEmployeeBalance(address));
  }

  async function deletion(address) {
    await contractInstance.methods.deleteEmployee(address)
    .send({from: ethereum.selectedAddress, gas: 85000 }, function (err, res) {
      if (err) {
        console.log("an error occured", err)
        return;
      }
      console.log('Hash of tx' + res);
    });
  }

  //handles dynamic employee creation in the DOM
  //issues with it: 
  //does not automatically update earnings when employee is paid
  //does not support editing
  //does not support deletion
  //should probably put a 'pay' button next to each created employee
  //each employee in our employees list should have 3 buttons: pay, edit, delete
  //each employee in our employees list should dynamically update earnings when paid, and other params when edited
  //each employee should display xyz 'ether' for salary and xyz 'days' for interval

async function display(address, id) {
  //crete div to put employee info into
   let employeeDisplay = document.querySelector("#employeeDisplay");
   
   let name = employeeList[id].name;
   let earnings = await contractInstance.methods.getEmployeeBalance(address).call();
   let salary = await contractInstance.methods.getEmployeeSalary(address).call();
   let interval = await contractInstance.methods.getEmployeeInterval(address).call();

   console.log(name);
   console.log(id);
   console.log(address);
   console.log(earnings)
   console.log(salary)
   console.log(interval)
   //create employee name
   let newEmployeeName = document.createElement('h3');
   newEmployeeName.innerText = name;
   employeeDisplay.appendChild(newEmployeeName);

   //create a ul element
    let newEmployeeInfo = document.createElement('ul');
    //append the element to the employee display div
    employeeDisplay.appendChild(newEmployeeInfo);

   let newEmployeeEarnings = document.createElement('li');
   newEmployeeEarnings.innerText = `${web3.utils.fromWei(earnings.toString(), 'ether')} eth`;
   newEmployeeInfo.appendChild(newEmployeeEarnings);

   let newEmployeeSalary = document.createElement('li');
   newEmployeeSalary.innerText = `${web3.utils.fromWei(salary.toString(), 'ether')} ether`;
   newEmployeeInfo.appendChild(newEmployeeSalary);

   let newEmployeeInterval = document.createElement('li');
   newEmployeeInterval.innerText = `${interval} days`;
   newEmployeeInfo.appendChild(newEmployeeInterval);

   let payButton = document.createElement("button");
   payButton.innerText = "Pay";
   employeeDisplay.appendChild(payButton);
   payButton.addEventListener('click', () => {
     payEmployeeByAddress(address);
     console.log('this function was executed');
   });

   let editButton = document.createElement("button");
   editButton.innerText = "Edit";
   employeeDisplay.appendChild(editButton);

   let deleteButton = document.createElement("button");
   deleteButton.innerText = "Delete";
   employeeDisplay.appendChild(deleteButton);
   deleteButton.addEventListener('click', () => {
     deletion(address);
     console.log('this function was executed');
  });
}


  fundingPayroll.addEventListener("submit", function (event) {
    event.preventDefault();
    fund();
    fundingPayroll.reset();
  })

//create new employee
  createEmployee.addEventListener("submit", function(event) {
    //prevent form submission
    event.preventDefault();
    //a cache variable to make sure that the employee doesn't yet exist
    let status = true;
    //loop through front end storage of employees and make sure the inputted address doesn't exist yet
    //this will eventually need to call a local DB - or need to just call the chain directly...and use that as error handling
    //will eventually need to refactor here
    for (let i = 0; i < employeeList.length; i++) {
      if (employeeList[i].address === employeeAddress.value) {
        console.log('This address already exists. Please enter a new address');
        status = false;
        break;
    }};
    if (status === true) {
      //if address doesn't yet exist
      //increment our cache idCount variable that we use for displaying employees
    idCount++;
    //add employee to local list
    employeeList.push(new Employee(employeeName.value, employeeAddress.value, employeeSalary.value, paymentInterval.value, idCount));
    //create new employee on chain
    async function create() {
      await createNewEmployee();
      //display this new employee, using our front end array & cache variable
      //would be good to have all of this come directly from the chain itself..but we are getting most of the data from the chain
        display(employeeList[idCount - 1].address.toString(), idCount - 1);
      }
    create();
    }
    //reset the form
    createEmployee.reset();
  });

  //can eventually remove these as each employee will have a pay and delete option
  //need to add edit functionality
  payEmployee.addEventListener("submit", function(event) {
    //only paying connected metamask now...need to inclue a form here
    event.preventDefault();
    payEmployeeByAddress(paymentAddress.value);
    payEmployee.reset();
  })

  deleteEmployee.addEventListener("submit", function(event) {
    event.preventDefault();
    deletion(deleteAddress.value);
    deleteEmployee.reset();
  });