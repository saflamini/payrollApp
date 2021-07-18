import React, {Component} from 'react';
import { web3 } from './config';
import { assets } from './config';
import { BigNumber } from "bignumber.js";
import { decimals } from "./config";
import {assetSymbols} from "./config";
import { CompanyRegistry } from './config';
import { CompanyABI } from './config';
// import detectEthereumProvider from '@metamask/detect-provider';
// import { v4 as uuidv4 } from 'uuid';
import EmployeeList from './EmployeeList';
import Balance from './Balance';
import EditModal from './EditModal';
import EmployeeForm from './EmployeeForm';
import RunPayrollModal from "./RunPayrollModal";
// import { Contract } from 'web3-eth-contract';
// import { payrollAddress } from './config';
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
import {Route, Switch, Link} from "react-router-dom";
import {BrowserRouter} from "react-router-dom";

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
            runningPayroll: false
        };

        this.setup = this.setup.bind(this);
        this.isConnected = this.isConnected.bind(this);
        this.disconnected = this.disconnected.bind(this);
        this.getCompany = this.getCompany.bind(this);
        this.getCompanyInfo = this.getCompanyInfo.bind(this);
        this.getCompanyBalances = this.getCompanyBalances.bind(this);
        this.getEmployeeArray = this.getEmployeeArray.bind(this);
        //focus here when we get back (show a pop up window which will allow user to confirm that they want to run payroll, and see total projected outflow)
        this.toggleRunningPayroll = this.toggleRunningPayroll.bind(this);
        this.showRunPayroll = this.showRunPayroll.bind(this);
        this.showEditModal = this.showEditModal.bind(this);
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
            //probably need to get company name out of here somehow
            this.setState({
                companyContract: CompanyContract,
                companyAddress: coAddress,
                company: companyName
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
        console.log('company info is called')
        this.getEmployeeArray(); 
        this.getCompanyBalances();
    }

  
//call company contract
    async getEmployeeArray() {
        // console.log(this.state.companyContract)
        let employeeArray = await this.state.companyContract.methods.getEmployeesByCompany().call({from: this.state.account});
        console.log(employeeArray)
        let employeeRender = [];
        for (let i = 0; i < employeeArray.length; i++) {
            let salary = await this.state.companyContract.methods.getEmployeeSalary(employeeArray[i]).call({from: this.state.account});
            let interval = await this.state.companyContract.methods.getEmployeeInterval(employeeArray[i]).call({from: this.state.account});
            let currency = await this.state.companyContract.methods.getEmployeeCurrency(employeeArray[i]).call({from: this.state.account});
            let adjustedSalary = new BigNumber(salary).shiftedBy(-1 * decimals[assetSymbols[currency]]).c[0];
            if (employeeArray[i] !== "0x0000000000000000000000000000000000000000") {
                employeeRender.push({
                address: employeeArray[i], 
                currency: currency,
                salary: adjustedSalary, 
                interval: interval
            })}}

            this.setState({
                roster: employeeRender
            })
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
        this.showEditModal(employeeAddress)
    }

    showEditModal(employeeAddress) {
        let currentSalary;
        let currentInterval;
        let currencyAddress;
        for (let i = 0; i < this.state.roster.length; i++) {
            if (this.state.roster[i].address === employeeAddress) {
                console.log(this.state.roster[i])
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
            console.log('no changes made');
        }
        this.setState({editingEmployee: false})
    }

    async createCompany(name) {
        await this.state.companyRegistry.methods.createCompany(name).send({from: this.state.account, gas: 6721975})
        .then(console.log)
        .then(this.getCompany())
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

    async addEmployee(employee) {
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
        console.log(amount);
        // console.log(currencyAddress.toString());
        await this.state.companyContract.methods.fundERCPayroll(amount, currencyAddress).send({from: this.state.account,  gas: 6721975})
        .then(console.log)
        .then(this.getCompanyBalances());
    }

    async withdrawFunds(amount, currencyAddress) {
        console.log(amount);
        console.log(currencyAddress);
        await this.state.companyContract.methods.withdrawFunds(amount, currencyAddress).send({from: this.state.account, gas: 6721975})
        .then(console.log)
        .then(this.getCompanyBalances())
    }

    async payEmployee(address) {
        await this.state.companyContract.methods.payEmployee(address).send({from: this.state.account})
        .then(console.log)
        .then(this.getCompany())
    }

    closeEditModal() {
        this.setState({editingEmployee: false, editingAddress: ""});
    }

    toggleRunningPayroll() {
        this.setState({runningPayroll: !this.state.runningPayroll})
    }

    async runPayroll() {
        await this.state.companyContract.methods.runPayroll().send({from: this.state.account, gas: 6021975}).then(console.log)
        this.setState({runningPayroll: false})
        this.getCompany()
    }
   


    //create a 'confirm run payroll' modal and pop it up when button in employee list is good to go
    //then focus on some routing and other features
    showRunPayroll() {
        return (
            <RunPayrollModal 
            runPayroll={this.runPayroll}
            toggleRunningPayroll={this.toggleRunningPayroll}
            />
        )
    }

 



    render() {
        
        return (
            <div>
                {/* <Switch>
                    <Route exact path="/balance" component={Balance}></Route>
                </Switch> */}
            <Navigation />
            <Container>
                <Row>
                <Col>
                <CompanyInfo account={this.state.account} company={this.state.company} getCompany={this.getCompany} createCompany={this.createCompany}/> 
                </Col>
                <Col>
                {this.state.connected? 
                <Card bg="success" className="connectWallet">{`${this.state.account.toString().substring(0, 4)}...${this.state.account.toString().substring(38)}`}</Card>
                : <ConnectWallet />
                }
                </Col>
                </Row>
            </Container>
            
                <Container className="top">
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
                </Container>

                <Container>
                {this.state.editingEmployee? this.showEditModal(this.state.editingAddress): console.log('not editing')}
                {this.state.runningPayroll? this.showRunPayroll(): console.log('not running payroll')}
                <EmployeeList className="employeeList"
                account={this.state.account} 
                companyId={this.state.companyId} 
                companyAddress={this.state.account} 
                roster={this.state.roster}
                payEmployee={this.payEmployee}
                editingEmployee={this.editingEmployee} 
                companyContract={this.state.companyContract}
                runningPayroll={this.toggleRunningPayroll}
                />
                
                </Container>


            </div>
        )
    }
}

export default Web3Setup;