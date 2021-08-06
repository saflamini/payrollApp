import React, {Component} from 'react';
import { web3 } from './config';
import { assets } from './config';
import { BigNumber } from "bignumber.js";
import { decimals } from "./config";
import {assetSymbols} from "./config";
import { CompanyRegistry } from './config';
import { CompanyABI } from './config';
import EmployeeList from './EmployeeList';
import Balance from './Balance';
import EditModal from './EditModal';
import PayModal from "./PayModal";
import RunPayrollModal from "./RunPayrollModal";
import {USDC, DAI, USDT} from "./seedBalances.js";
import './Web3Setup.css';
import ConnectWallet from './ConnectWallet';
import CompanyInfo from "./CompanyInfo";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Navigation from "./Navigation";
import FundPage from "./FundPage";
import Home from "./Home";
import EmployeeFormModal from "./EmployeeFormModal";
import {Route, Switch, Link} from "react-router-dom";
import ManageRoster from './ManageRoster';
import EmployeeInterface from "./EmployeeInterface";
import EmployeeProfile from "./EmployeeProfile";
import Payments from "./Payments";

// import {BrowserRouter} from "react-router-dom";
// import { Contract } from 'web3-eth-contract';
// import { payrollAddress } from './config';
// import EmployeeForm from './EmployeeForm';
// import detectEthereumProvider from '@metamask/detect-provider';
// import { v4 as uuidv4 } from 'uuid';

//need to run all state and key operations here
//use router here to pass necessary prop values to other page components
//Switch
//Route 1-path to /home - render home
//Route 2-path to /fundpage - render fundpage
//Route 3-path to /manageroster - render that page.... and so on



class Web3Setup extends Component {
  
    constructor(props) {
        super(props);
     
        this.state = {
            connected: false,
            account: "",
            companyRegistry: CompanyRegistry,
            companyContract: null,
            company: "Please create a new company or connect a wallet",
            companyAddress: "",
            companyId: null,
            roster: [], 
            usdcBalance: "",
            daiBalance: "",
            usdtBalance: "",
            editingEmployee: false,
            editingAddress: "",
            payingAddress: "",
            runningPayroll: false,
            paying: false,
            creatingEmployee: false,
            paymentList: []
        };

        this.setup = this.setup.bind(this);
        this.isConnected = this.isConnected.bind(this);
        this.disconnected = this.disconnected.bind(this);
        this.getCompany = this.getCompany.bind(this);
        this.getCompanyInfo = this.getCompanyInfo.bind(this);
        this.getCompanyBalances = this.getCompanyBalances.bind(this);
        this.getEmployeeArray = this.getEmployeeArray.bind(this);
        this.showPayrollModal = this.showPayrollModal.bind(this);
        this.closePayrollModal = this.closePayrollModal.bind(this);
        this.renderPayrollModal = this.renderPayrollModal.bind(this);
        this.showEditModal = this.showEditModal.bind(this);
        this.payingEmployee = this.payingEmployee.bind(this);
        this.closePayModal = this.closePayModal.bind(this);
        this.closeEditModal = this.closeEditModal.bind(this);
        this.editingEmployee = this.editingEmployee.bind(this);
        this.handleModalUpdate = this.handleModalUpdate.bind(this);
        this.updateInterval = this.updateInterval.bind(this);
        this.updateSalary = this.updateSalary.bind(this);
        this.removeEmployee = this.removeEmployee.bind(this);
        this.addEmployee = this.addEmployee.bind(this);
        this.fundPayroll = this.fundPayroll.bind(this);
        this.payEmployee = this.payEmployee.bind(this);
        this.runPayroll = this.runPayroll.bind(this);
        this.withdrawFunds = this.withdrawFunds.bind(this);
        this.createCompany = this.createCompany.bind(this);
        this.showPayModal = this.showPayModal.bind(this);
        this.getLastDayPaid = this.getLastDayPaid.bind(this);
        this.sendSinglePayment = this.sendSinglePayment.bind(this);
        this.toggleCreateModal = this.toggleCreateModal.bind(this);
        this.showCreateModal = this.showCreateModal.bind(this);
        this.closeCreateModal = this.closeCreateModal.bind(this);
        this.getEmployeeName = this.getEmployeeName.bind(this);
        this.addEmployeeToDB = this.addEmployeeToDB.bind(this);
        this.addCompanyToDB = this.addCompanyToDB.bind(this);
        this.getAdditionalEmployeeInfo = this.getAdditionalEmployeeInfo.bind(this);
        this.addPaymentToDB = this.addPaymentToDB.bind(this);
        this.addPayrollPaymentsToDB = this.addPayrollPaymentsToDB.bind(this);
        this.getEmployeePaymentInfo = this.getEmployeePaymentInfo.bind(this);
        this.getEmployerPaymentInfo = this.getEmployerPaymentInfo.bind(this);
        this.getPayments = this.getPayments.bind(this);
    }


    componentDidMount() {
        this.setup()
    }

    


    isConnected() {
        let accts = window.ethereum._state.accounts;
    
        if (accts.length === 0) {
            console.log('not connected')
            this.setState({connected: false})
        } else {
            console.log('connected')
            this.setState({account: accts[0]})
            this.setState({connected: true})
            this.getCompany();
            
            // this.getEmployeeArray()
        }
    }

    disconnected() {
        this.setState({connected: false})
    }


    async setup() {

        // This function detects most providers injected at window.ethereum
        // const provider = await detectEthereumProvider();
      
        if (typeof window.ethereum !== 'undefined') {
           
            console.log('MetaMask is installed!');
            // console.log('metamask connected');
          }
          else {
            console.log('you should consider metamask!')
          }

          const acct = await window.ethereum.request({ method: 'eth_accounts' })
          
          if (acct.length > 0) {
              this.setState({
                  connected: true, 
                  account: acct
                })
          }
          
          let currentAccount = null;
            window.ethereum
            .request({ method: 'eth_accounts' })
            .then(handleAccountsChanged)
            .catch((err) => {
                // Some unexpected error.
             // For backwards compatibility reasons, if no accounts are available,
                // eth_accounts will return an empty array.
                console.error(err);
            });
        
            // Note that this event is emitted on page load.
            // If the array of accounts is non-empty, you're already
            // connected.
            window.ethereum.on('accountsChanged', this.isConnected, handleAccountsChanged);
            // For now, 'eth_accounts' will continue to always return an array
            
            function handleAccountsChanged(accounts) {
            if (accounts.length === 0) {
                // MetaMask is locked or the user has not connected any accounts
                console.log('Please connect to MetaMask.');
           
            } else if (accounts[0] !== currentAccount) {
                currentAccount = accounts[0];
            }

        }

        if (currentAccount !== null) {
            this.setState({account: currentAccount})
            this.getCompany();
            // this.getCompanyInfo();
        }

        const accountList = await window.ethereum.request({ method: 'eth_accounts' })
        this.setState({ account: accountList[0] })

        if (acct.length > 0) {
            //if we have a connected metamask account, run getCompany and get companyId
            //these two functions also run if a reload occurs
            this.getCompany()
            // this.getCompanyInfo()
            // this.getCompanyBalances()
            // console.log(this.state.companyAddress)

            // this.getCompanyInfo();
        }

    }


    //gets the company name for display
    async getCompany() {
        let coAddress = await this.state.companyRegistry.methods.getCompanyAddress(this.state.account).call({from: this.state.account});
        console.log(coAddress)

        if (coAddress.length !== 0 && coAddress !== "0x0000000000000000000000000000000000000000") {
            const CompanyContract = new web3.eth.Contract(CompanyABI, coAddress);
            let companyName = await CompanyContract.methods.name().call();
            let companyId = await CompanyContract.methods.getCompanyId().call();
            //probably need to get company name out of here somehow
            this.setState({
                companyContract: CompanyContract,
                companyAddress: coAddress,
                company: companyName,
                companyId: companyId
            })
            this.getCompanyBalances()
            this.getEmployeeArray()

        }  
            
        
        else if (coAddress.length === 0) {

            this.setState({company: "Please create a new company or connect a wallet"})
        }
    }

    //gets company ID for employee creation handling
    async getCompanyInfo() {
        //change to calling the company contract created by the owner
        //need a way to call company ID using the owner's connected address
        //should likely be added as a method to the registry
        // let coId = await payrollContract.methods.getCompanyId(this.state.account).call({from: this.state.account});
        this.getEmployeeArray(); 
        this.getCompanyBalances();
    }

  async getEmployeeName(employeeAddress) {
      try {
        
        const response = await fetch(`http://localhost:5000/${employeeAddress}`);
        const jsonData = await response.json();

        console.log(jsonData);
        return jsonData;

      } catch (err) {
          console.error(err.message)
      }
  }

  async getAdditionalEmployeeInfo(address) {
    try {
        const response = await fetch(`http://localhost:5000/get-employee/${address}`);
        const jsonData = await response.json();

        // console.log(jsonData);
        return jsonData;

      } catch (err) {
          console.error(err.message)
      }
  }

//call company contract
    async getEmployeeArray() {
        
        // console.log(this.state.companyContract)
        
        let employeeArray = await this.state.companyContract.methods.getEmployeesByCompany().call({from: this.state.account});
        console.log(employeeArray)
        if (employeeArray.length > 0) {
        let employeeRender = [];
        for (let i = 0; i < employeeArray.length; i++) {
            let employeeDBInfo = await this.getAdditionalEmployeeInfo(employeeArray[i]);
            // let name = await this.getEmployeeName(employeeArray[i]);
            let first_name = employeeDBInfo.first_name;
            let last_name = employeeDBInfo.last_name;
            let id = employeeDBInfo.employee_id;
            let state = employeeDBInfo.state;
            let filingstatus = employeeDBInfo.filingstatus;
            let allowances = employeeDBInfo.allowances;
            let salary = await this.state.companyContract.methods.getEmployeeSalary(employeeArray[i]).call({from: this.state.account});
            let interval = await this.state.companyContract.methods.getEmployeeInterval(employeeArray[i]).call({from: this.state.account});
            let currency = await this.state.companyContract.methods.getEmployeeCurrency(employeeArray[i]).call({from: this.state.account});
            let adjustedSalary = new BigNumber(salary).shiftedBy(-1 * decimals[assetSymbols[currency]]).c[0];
            
            if (employeeArray[i] !== "0x0000000000000000000000000000000000000000") {
                let lastDay = await this.getLastDayPaid(employeeArray[i]);
                employeeRender.push({
                first_name: first_name,
                id: id,
                last_name: last_name,
                address: employeeArray[i], 
                currency: currency,
                lastDayPaid: lastDay == 0? (Date.now() / 1000 - (interval * 86400)): lastDay,
                salary: adjustedSalary, 
                interval: interval,
                state: state,
                filingstatus: filingstatus,
                allowances: allowances
            })}}

            this.setState({
                roster: employeeRender
            })

            this.getPayments();
        }
    }

    //call company contract
    //split up by asset type
    async getCompanyBalances() {
        let usdcBal = await USDC.methods.balanceOf(this.state.companyAddress).call({from: this.state.account});
        let daiBal = await DAI.methods.balanceOf(this.state.companyAddress).call({from: this.state.account});
        let usdtBal = await USDT.methods.balanceOf(this.state.companyAddress).call({from: this.state.account});
        this.setState({
            usdcBalance: usdcBal,
            daiBalance: daiBal,
            usdtBalance: usdtBal 
        });
    }

    editingEmployee(employeeAddress) {
        this.setState({editingEmployee: true, editingAddress: employeeAddress});
        //the below line may not be necessary
        this.showEditModal(employeeAddress)
    }

    showEditModal(employeeAddress) {
        let currentSalary;
        let currentInterval;
        let currencyAddress;
        for (let i = 0; i < this.state.roster.length; i++) {
            if (this.state.roster[i].address === employeeAddress) {
                currentSalary = this.state.roster[i].salary;
                currentInterval = this.state.roster[i].interval;
                currencyAddress = this.state.roster[i].currency;
                break;
            }
            
        }
        return (
            <EditModal 
            address={employeeAddress}
            salary={currentSalary}
            interval={currentInterval}
            currencySymbol={assetSymbols[currencyAddress]}
            closeEditModal={this.closeEditModal}
            handleModalUpdate={this.handleModalUpdate}
            removeEmployee={this.removeEmployee}
            />
        )
    }

    closeEditModal() {
        this.setState({editingEmployee: false, editingAddress: ""});
    }

    handleModalUpdate(employeeObject) {
        let addr = employeeObject.address;
        let emp;
        for (let i = 0; i < this.state.roster.length; i++) {
            if (this.state.roster[i].address === addr) {
                emp = this.state.roster[i];
                break;
            }
        }
        if (employeeObject.salary !== emp.salary) {
            this.updateSalary(employeeObject.address, employeeObject.salary)
        }
        if (employeeObject.interval !== emp.interval) {
            this.updateInterval(employeeObject.address, employeeObject.interval)
        }
        else {
            // console.log('no changes made');
        }
        this.setState({editingEmployee: false})
    }

    async addCompanyToDB(company_id, company_owner_address, company_address, company_name) { 
        try {
            await this.getCompany();
            const body = {company_id, company_owner_address, company_address, company_name};
            const response = await fetch("http://localhost:5000/create-company", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            
            window.location = "/home";

        } catch (err) {
            console.error(err.message)
        }
    }

    async createCompany(name) {
        await this.state.companyRegistry.methods.createCompany(name).send({from: this.state.account, gas: 6721975})
        .then(console.log)

        await this.getCompany();
        console.log(this.state);
        await this.addCompanyToDB(this.state.companyId, this.state.account, this.state.companyAddress, this.state.company);
        //order of ops a problem here - asking for things for companydb in next function, which it does not yet have?
        // await this.addCompanyToDB());
        // .then(consoCompany()le.log(this.state.companyId))
        // .then(console.log(this.state.companyAddress))
        //company ID must be correctly created in getCompany and set to state
        // .then(await this.addCompanyToDB(this.state.companyId, this.state.account, this.state.companyAddress, this.state.company))
    }

    //for all of these - call the relevant company contract
    async updateInterval(address, newInterval) {
        await this.state.companyContract.methods.editEmployeeInterval(address, newInterval).send({from: this.state.account})
        .then(console.log)
        .then(this.getEmployeeArray())
    }

    async updateSalary(address, newSalary) {
        let employeeCurrency;
        for (let i = 0; i < this.state.roster.length; i++) {
            if (this.state.roster[i].address == address) {
                // let d = decimals[assetSymbols[this.state.roster[i].currency]]
                // let adjustedCurrency = new BigNumber(this.state.roster[i].currency).shiftedBy(-1 * d);
                employeeCurrency = this.state.roster[i].currency;
                break;
            }
        }
        // let newSal = new BigNumber(newSalary).shiftedBy(decimals[assetSymbols[employeeCurrency]]);
        await this.state.companyContract.methods.editEmployeeSalary(address, newSalary).send({from: this.state.account})
        .then(console.log)
        .then(this.getEmployeeArray())
       
    }

    // async addPaymentToDB() {
    //     try {
    //         const body = {}
    //         const response = await fetch("", {
    //             METHOD: "POST",
    //             headers: {"Content-Type": "application/json"},
    //             body: JSON.stringify(body)
    //         })
    //     } catch (err) {
    //         console.error(err.message)
    //     }
    // }

    async addEmployeeToDB(eth_address, company_id, first_name, last_name, salary, currency, fiat_currency, interval, state, filingstatus, allowances) {
        try {
            const body = {eth_address, company_id, first_name, last_name, salary, currency, fiat_currency, interval, state, filingstatus, allowances};
            const response = await fetch("http://localhost:5000/manage-roster", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(body)
            });

            // window.location = "/home";

        } catch (err) {
            console.error(err.message)
        }
    }

    async addEmployee(employee) {
        //get these from create e section, and make sure that company Id is defined in this component
        await this.addEmployeeToDB(web3.utils.toChecksumAddress(employee.address), this.state.companyId, employee.first_name, employee.last_name, employee.salary, employee.currency, 'USD', employee.interval, employee.state, employee.filingstatus, employee.allowances);
        // let newEmployee = {...employee, id: uuidv4()}
        let employeeSalary = new BigNumber(employee.salary).shiftedBy(decimals[employee.currency]);
        await this.state.companyContract.methods.createEmployee(employee.address, assets[employee.currency], employeeSalary, employee.interval).send({from: this.state.account, gas: 6721975})
        .then(console.log)
        .then(this.getCompanyInfo())

    }

    async removeEmployee(address) {
        await this.state.companyContract.methods.deleteEmployee(address).send({from: this.state.account, gas: 6721975})
        .then(console.log)
        .then(this.setState({editingEmployee: false}))
        .then(this.getCompanyInfo())
    }

    async fundPayroll(amount, currencyAddress) {
        await this.state.companyContract.methods.fundERCPayroll(amount, currencyAddress).send({from: this.state.account,  gas: 6721975})
        .then(console.log)
        .then(this.getCompanyBalances());
    }

    async withdrawFunds(amount, currencyAddress) {
        await this.state.companyContract.methods.withdrawFunds(amount, currencyAddress).send({from: this.state.account, gas: 6721975})
        .then(console.log)
        .then(this.getCompanyBalances())
    }

    async addPaymentToDB(first_name, last_name, company_id, employee_id, salary, interval, state, filingstatus, allowances, bonusAmount, paymentType) {
        try {
            const body = {first_name, last_name, company_id, employee_id, salary, interval, state, filingstatus, allowances, bonusAmount, paymentType};
            const response = await fetch("http://localhost:5000/pay-employee", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(body)
            });

            console.log(response.data)

            // window.location = "/home";

        } catch (err) {
            console.error(err.message)
        }
    }

    async payEmployee(address) {
        let employee;
        for (let i = 0; i < this.state.roster.length; i++) {
            if (this.state.roster[i].address == address) {
                employee = this.state.roster[i];
                break;
            }
        }
        await this.state.companyContract.methods.payEmployee(address).send({from: this.state.account}).then(console.log)

        await this.addPaymentToDB(employee.first_name, employee.last_name, this.state.companyId, employee.id, employee.salary, employee.interval, employee.state, employee.filingstatus, employee.allowances, 0, 'singlePayment')
        console.log('address: ' + address)
        this.getCompany()
    }

    async addPayrollPaymentsToDB() {
        //if last day paid is less than 10 s
        //if (block.timestamp >= employees[_address].lastDayPaid + intervalSeconds)
        //if now is >= last day paid + (interval * 365)
        // add a standard payroll payment to the database
        for (let i = 0; i < this.state.roster.length; i++) {
            if (Date.now() >= this.state.roster[i].lastDayPaid + (this.state.roster[i].interval * 86400)) {
                console.log(this.state.roster[i])
                await this.addPaymentToDB(this.state.roster[i].first_name, this.state.roster[i].last_name, this.state.companyId, this.state.roster[i].id, this.state.roster[i].salary, this.state.roster[i].interval, this.state.roster[i].state, this.state.roster[i].filingstatus, this.state.roster[i].allowances, 0, "payrollPayment");
            }
        }
    }

    //issues here
    async runPayroll() {
        console.log(this.state.account);
        try {
            await this.addPayrollPaymentsToDB()
            await this.state.companyContract.methods.runPayroll().send({from: this.state.account, gas: 6721975})
            .then(console.log)
            .then(this.setState({runningPayroll: false}))
            .then(this.getCompany())
        } catch (err) {
            console.error(err.message)
        }
        
    }

    async getLastDayPaid(employeeAddress) {
        let rawDay = await this.state.companyContract.methods.getLastDayPaid(employeeAddress).call({from: this.state.account});
        return rawDay;
    }

    async sendSinglePayment(employeeAddress, amount) {

        let currency;
        for (let i = 0; i < this.state.roster.length; i++) {
            if (this.state.roster[i].address == employeeAddress) {
                currency = assetSymbols[this.state.roster[i].currency];
                break;
            }
        }
        let employee;
        for (let i = 0; i < this.state.roster.length; i++) {
            if (this.state.roster[i].address == employeeAddress) {
                employee = this.state.roster[i];
                break;
            }
        }

        let payment = new BigNumber(amount).shiftedBy(decimals[currency]);
        console.log(employee)
        console.log(this.addPaymentToDB)

        await this.state.companyContract.methods.sendOneOffPayment(employeeAddress, payment).send({from: this.state.account}).then(console.log)
        await this.addPaymentToDB(employee.first_name, employee.last_name, this.state.companyId, employee.id, employee.salary, employee.interval, employee.state, employee.filingstatus, employee.allowances, Number(amount), "supplementalPayment")

        // await this.addPaymentToDB(employee.first_name, employee.last_name, this.state.companyId, employee.id, `$${amount}`, 365, employee.state, employee.filingstatus, employee.allowances).then(console.log)
        .then(this.getCompany());
        //include a loader here

    }

    renderPayrollModal() {
        return (
            <RunPayrollModal 
            runPayroll={this.runPayroll}
            showPayrollModal={this.showPayrollModal}
            closePayrollModal={this.closePayrollModal}
            />
        )
    }
    
    showPayrollModal() {
        this.setState({runningPayroll: true});
        // this.renderPayrollModal(employeeAddress)
    }

    closePayrollModal() {
        this.setState({runningPayroll: false});
    }

    
   payingEmployee(employeeAddress) {
    //    console.log(employeeAddress)
        this.setState({payingAddress: employeeAddress, paying: true})
    }


   

    showPayModal(employeeAddress) {
        console.log(this.state.payingAddress)
        let currentSalary;
        let currentInterval;
        let currencyAddress;
        let lastDayPaid;
        for (let i = 0; i < this.state.roster.length; i++) {
            if (this.state.roster[i].address === employeeAddress) {
                // console.log(this.state.roster[i])
                currentSalary = this.state.roster[i].salary;
                currentInterval = this.state.roster[i].interval;
                currencyAddress = this.state.roster[i].currency;
                lastDayPaid = this.state.roster[i].lastDayPaid;
                break;
            }
        }
        return (
            <PayModal 
            address={employeeAddress}
            salary={currentSalary}
            interval={currentInterval}
            currencySymbol={assetSymbols[currencyAddress]}
            lastDayPaid={lastDayPaid}
            closePayModal={this.closePayModal}
            payEmployee={this.payEmployee}
            sendSinglePayment={this.sendSinglePayment}
            />
        )
    }

    closePayModal() {
        this.setState({
            paying: false, 
            payingAddress: ""
        })
    }

    toggleCreateModal() {
        this.setState({
            creatingEmployee: true
        })
    }

    showCreateModal() {
        return (
            <EmployeeFormModal
            addEmployee={this.addEmployee}
            closeCreateModal={this.closeCreateModal}
            />
        )
    }

    closeCreateModal() {
        this.setState({creatingEmployee: false})
    }


    //create a 'confirm run payroll' modal and pop it up when button in employee list is good to go
   
    //get payment data
    
    async getEmployerPaymentInfo() {
        try {
            const response = await fetch(`http://localhost:5000/employer-payments/${this.state.companyId}`);
            const jsonData = await response.json();
    
            // console.log(jsonData);
            return jsonData;
    
          } catch (err) {
              console.error(err.message)
          }
    }

    async getEmployeePaymentInfo(employeeId) {
        try {
            const response = await fetch(`http://localhost:5000/employee-payments/${employeeId}`);
            const jsonData = await response.json();
    
            // console.log(jsonData);
            return jsonData;
    
          } catch (err) {
              console.error(err.message)
          }
    }

    async getPayments() {
        let employerPaymentData = [];
    
        employerPaymentData = await this.getEmployerPaymentInfo();
        // for (let i = 0; i < employerPaymentData.length; i++) {
        //     let currentE;

        //     for (let i = 0; i < this.state.roster.length; i++) {
        //         console.log(employerPaymentData[i])
        //         if (employerPaymentData[i] !== undefined && employerPaymentData[i].employee_id == this.state.roster[i].id) {
        //             currentE = this.state.roster[i];
        //             console.log(currentE)
        //             employerPaymentData[i].first_name = currentE.first_name;
        //             employerPaymentData[i].last_name = currentE.last_name;
        //         }
        //     }
                
                
            // }

        console.log(employerPaymentData)
        this.setState({
            paymentList: employerPaymentData
        })

    //     let payments = [];

    //     for (let i = 0; i < this.state.roster[i].length; i++) {

    //     if (employerPaymentData.length > 0 && employerPaymentData !== undefined) {
    //         for (let i = 0; i < employerPaymentData.length; i++) {
    //         console.log(this.state.roster[i]);
    //         console.log(employerPaymentData[i])
    //         employeePayment = await this.getEmployeePaymentInfo(this.state.roster[i].id);
    //         console.log('employeePayment')
    //         console.log(employeePayment[0])

    //         if (this.state.roster[i] !== undefined && employeePayment[0] !== undefined && (employerPaymentData[i].employee_id === this.state.roster[i].id)) {
    //             let e = {
    //                 employer_ss_withheld: employerPaymentData[i].employer_ss_withheld,
    //                 employer_medicare_withheld: employerPaymentData[i].employer_medicare_withheld,
    //                 employer_futa_withheld: employerPaymentData[i].employer_futa_withheld,
    //                 employer_state_u_withheld: employerPaymentData[i].employer_state_u_withheld,
    //                 total_employer_cost: employerPaymentData[i].total_employer_cost,
    //                 fullName: `${this.state.roster[i].first_name} ${this.state.roster[i].last_name}`,
    //                 employee_id: this.state.roster[i].id,
    //                 lastPaid: this.state.roster[i].lastDayPaid,
    //                 gross_pay: employeePayment[0].gross_pay,
    //                 federal_tax_withheld: employeePayment[0].federal_tax_withheld,
    //                 state_tax_withheld: employeePayment[0].state_tax_withheld,
    //                 ss_tax_withheld: employeePayment[0].ss_tax_withheld,
    //                 medicare_tax_withheld: employeePayment[0].medicare_tax_withheld,
    //                 net_pay: employeePayment[0].net_pay,
    //             }
    //             console.log(e)
    //             payments.push(e)
    //             }
    //         }
    //     } 
    // }
    //     this.setState({
    //         paymentList: payments
    //     })
    }
 



    render() {
        
        return (
            <div>
            
            <Navigation className="nav" />
            <Container>
                <Row>
                <Col>
                <CompanyInfo 
                account={this.state.account} 
                company={this.state.company} 
                getCompany={this.getCompany} 
                createCompany={this.createCompany}
                addCompanyToDB={this.addCompanyToDB}
                /> 
                </Col>
                <Col>
                {this.state.connected? 
                <Card className="connectWallet">{`${this.state.account.toString().substring(0, 4)}...${this.state.account.toString().substring(38)}`}</Card>
                : <ConnectWallet />
                }
                </Col>
                </Row>
            </Container>

            <Switch>
                <Route exact path="/home" render={ () =>
                    <Home
                    account={this.state.account} 
                    usdcBalance={this.state.usdcBalance} 
                    daiBalance={this.state.daiBalance}
                    usdtBalance={this.state.usdtBalance}
                    fundPayroll={this.fundPayroll} 
                    withdraw={this.withdrawFunds}
                    companyAddress={this.state.account} 
                    roster={this.state.roster}
                    payEmployee={this.payEmployee}
                    editingEmployee={this.editingEmployee} 
                    companyContract={this.companyContract}
                    showPayrollModal={this.showPayrollModal}
                    renderPayrollModal={this.renderPayrollModal}
                    closePayrollModal={this.closePayrollModal}
                    payingEmployee={this.payingEmployee}
                    toggleAddEmployee={this.toggleCreateModal}
                    closeCreateModal={this.closeCreateModal}
                    />
                    }>
                </Route>
                <Route exact path="/fund" render={ () => 
                    <FundPage 
                    account={this.state.account} 
                    usdcBalance={this.state.usdcBalance} 
                    daiBalance={this.state.daiBalance}
                    usdtBalance={this.state.usdtBalance}
                    fundPayroll={this.fundPayroll} 
                    withdraw={this.withdrawFunds}
                    />
                    }>
                </Route>
                <Route exact path="/manage-roster" render={() =>
                <ManageRoster
                account={this.state.account} 
                companyAddress={this.state.account} 
                roster={this.state.roster}
                payingEmployee={this.payingEmployee}
                payEmployee={this.payEmployee}
                editingEmployee={this.editingEmployee} 
                companyContract={this.state.companyContract}
                addEmployee={this.addEmployee}
                showPayrollModal={this.showPayrollModal}
                renderPayrollModal={this.renderPayrollModal}
                closePayrollModal={this.closePayrollModal}
                toggleAddEmployee={this.toggleCreateModal}
                closeCreateModal={this.closeCreateModal}
                />
                }>
                </Route>
                
                <Route exact path="/employee" render={() => 
                <EmployeeInterface
                />}>
                </Route>

                <Route exact path="/manage-roster/:address"
                render={routeProps => <EmployeeProfile {...routeProps} 
                getAdditionalEmployeeInfo={this.getAdditionalEmployeeInfo}
                editingEmployee={this.editingEmployee} 
                payments={this.state.payments}
                /> }
                >
                </Route>

                <Route exact path="/payments"
                render={routeProps => <Payments {...routeProps} 
                roster={this.state.roster}
                companyId={this.state.companyId}
                paymentList={this.state.paymentList}
                />}
                >
                </Route>

            </Switch>
            
                {/* <Container className="top">
                    <Row>
                        
                        <Col>
                        <Container bg="light">
                        <Balance 
                        account={this.state.account} 
                        companyId={this.state.companyId} 
                        usdcBalance={this.state.usdcBalance} 
                        daiBalance={this.state.daiBalance}
                        usdtBalance={this.state.usdtBalance}
                        fundPayroll={this.fundPayroll} 
                        withdraw={this.withdrawFunds}/>
                        </Container>
                        </Col>
                        <Col>
                        <Card  className="employeeForm" bg="light">
                        <Card.Header><h3>Add a New Employee</h3></Card.Header>
                            <EmployeeForm 
                            addEmployee={this.addEmployee}/>
                        </Card>
                        </Col>
                    </Row>
                </Container> */}

                <Container>
                {this.state.editingEmployee? this.showEditModal(this.state.editingAddress): console.log('not editing')}
                {this.state.runningPayroll? this.renderPayrollModal(): console.log('not running payroll')}
                {this.state.paying? this.showPayModal(this.state.payingAddress): console.log('not paying')}
                {this.state.creatingEmployee? this.showCreateModal(): console.log('not creating')}

                {/* <EmployeeList className="employeeList"
                account={this.state.account} 
                companyId={this.state.companyId} 
                companyAddress={this.state.account} 
                roster={this.state.roster}
                payEmployee={this.payEmployee}
                editingEmployee={this.editingEmployee} 
                companyContract={this.state.companyContract}
                runningPayroll={this.toggleRunningPayroll}
                /> */}
                
                </Container>

            </div>
        )
    }
}

export default Web3Setup;