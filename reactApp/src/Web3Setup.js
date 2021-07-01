import React, {Component} from 'react';
import { web3 } from './config';
import { payrollContract } from './config';
// import detectEthereumProvider from '@metamask/detect-provider';
// import { v4 as uuidv4 } from 'uuid';
import EmployeeList from './EmployeeList';
import Balance from './Balance';
import EditModal from './EditModal';
import EmployeeForm from './EmployeeForm';
// import { Contract } from 'web3-eth-contract';
// import { payrollAddress } from './config';
import './Web3Setup.css';
import ConnectWallet from './ConnectWallet';
import CompanyInfo from "./CompanyInfo";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';




class Web3Setup extends Component {
  
    constructor(props) {
        super(props);
     
    
        this.state = {
            connected: false,
            account: "",
            company: "Please create a new company or connect a wallet",
            companyId: null,
            roster: [], 
            balance: "",
            editingEmployee: false,
            editingAddress: ""
        };

        this.setup = this.setup.bind(this);
        this.isConnected = this.isConnected.bind(this);
        this.disconnected = this.disconnected.bind(this);
        this.getCompany = this.getCompany.bind(this);
        this.getCompanyInfo = this.getCompanyInfo.bind(this);
        this.getCompanyBalance = this.getCompanyBalance.bind(this);
        this.getEmployeeArray = this.getEmployeeArray.bind(this);
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
        this.withdrawFunds = this.withdrawFunds.bind(this);
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
            this.getCompanyInfo();
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
            console.log('here');
            this.getCompany();
            this.getCompanyInfo();
        }

        const accountList = await window.ethereum.request({ method: 'eth_accounts' })
        this.setState({ account: accountList[0] })

        if (acct.length > 0) {
            //if we have a connected metamask account, run getCompany and get companyId
            //these two functions also run if a reload occurs
            this.getCompany()
            this.getCompanyInfo();
        }

    }


    //gets the company name for display
    async getCompany() {
        let co = await payrollContract.methods.getCompany(this.state.account).call({from: this.state.account});
        if (co.length !== 0 && co) {
        this.setState({
            company: co
        })}  
        else if (co.length === 0) {
            this.setState({company: "Please create a new company or connect a wallet"})
        }
    }

    //gets company ID for employee creation handling
    async getCompanyInfo() {
        let coId = await payrollContract.methods.getCompanyId(this.state.account).call({from: this.state.account});
        let co = await payrollContract.methods.getCompany(this.state.account).call({from: this.state.account})
        if (co !== "")
        this.setState({
            companyId: coId
        })      
        this.getEmployeeArray(); 
        this.getCompanyBalance();
    }

  

    async getEmployeeArray() {
        let employeeArray = await payrollContract.methods.getEmployeesByCompany(this.state.account).call({from: this.state.account});
        let employeeRender = [];
        for (let i = 0; i < employeeArray.length; i++) {
            let salary = await payrollContract.methods.getEmployeeSalary(employeeArray[i], this.state.companyId).call({from: this.state.account});
            let interval = await payrollContract.methods.getEmployeeInterval(employeeArray[i], this.state.companyId).call({from: this.state.account});
            if (employeeArray[i] !== "0x0000000000000000000000000000000000000000") {
                employeeRender.push({
                address: employeeArray[i], 
                salary: salary, 
                interval: interval
            })}}

            this.setState({
                roster: employeeRender
            })
        }

    async getCompanyBalance() {
        let bal = await payrollContract.methods.getCompanyBalance(this.state.account).call({from: this.state.account});
        this.setState({balance: web3.utils.fromWei(bal.toString(), 'ether')});
    }

    editingEmployee(employeeAddress) {
        this.setState({editingEmployee: true, editingAddress: employeeAddress});
        this.showEditModal(employeeAddress)
    }

    showEditModal(employeeAddress) {
        let currentSalary;
        let currentInterval;
        for (let i = 0; i < this.state.roster.length; i++) {
            if (this.state.roster[i].address === employeeAddress) {
                currentSalary = this.state.roster[i].salary;
                currentInterval = this.state.roster[i].interval;
                break;
            }
            
        }
        return (
            <EditModal 
            address={employeeAddress}
            salary={currentSalary}
            interval={currentInterval}
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
            this.updateSalary(employeeObject.address, this.state.companyId, employeeObject.salary)
        }
        if (employeeObject.interval !== emp.interval) {
            this.updateInterval(employeeObject.address, this.state.companyId, employeeObject.interval)
        }
        else {
            console.log('no changes made');
        }
        this.setState({editingEmployee: false})
    }

    async updateInterval(address, companyId, newInterval) {
        await payrollContract.methods.editEmployeeInterval(address, companyId, newInterval).send({from: this.state.account})
        .then(console.log)
        .then(this.getEmployeeArray())
    }

    async updateSalary(address, companyId, newSalary) {
        await payrollContract.methods.editEmployeeSalary(address, companyId, newSalary).send({from: this.state.account})
        .then(console.log)
        .then(this.getEmployeeArray())
       
    }

    async addEmployee(employee) {
        // let newEmployee = {...employee, id: uuidv4()}
        await payrollContract.methods.createEmployee(employee.address, employee.salary, employee.interval, this.state.companyId).send({from: this.state.account, gas: 6721975})
        .then(console.log)
        .then(this.getCompanyInfo())

    }

    async removeEmployee(address) {
        await payrollContract.methods.deleteEmployee(address, this.state.companyId).send({from: this.state.account, gas: 6721975})
        .then(console.log)
        .then(this.setState({editingEmployee: false}))
        .then(this.getCompanyInfo())
    }

    async fundPayroll(amount) {
        await payrollContract.methods.fundPayroll(this.state.companyId).send({from: this.state.account, value: amount})
        .then(console.log)
        .then(this.getCompanyInfo());
    }

    async withdrawFunds(amount) {
        await payrollContract.methods.withdrawFunds(amount, this.state.companyId).send({from: this.state.account})
        .then(console.log)
        .then(this.getCompanyInfo())
    }

    async payEmployee(address) {
        await payrollContract.methods.payEmployee(address, this.state.companyId).send({from: this.state.account})
        .then(console.log)
        .then(this.getCompanyInfo())
    }

    closeEditModal() {
        this.setState({editingEmployee: false, editingAddress: ""});
    }



    render() {

        
        return (
            
            <div>
            <Container>
                <Row>
                <Col>
                <Card bg="dark" className ="companyInfo">
                <CompanyInfo account={this.state.account} company={this.state.company} getCompany={this.getCompany} /> 
                </Card>
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
                        <Container bg="dark">
                        <Balance account={this.state.account} companyId={this.state.companyId} balance={this.state.balance} fundPayroll={this.fundPayroll} withdraw={this.withdrawFunds}/>
                        </Container>
                        </Col>
                        <Col>
                        <Card  className="employeeForm" bg="dark">
                        <Card.Header><h3>Add a New Employee</h3></Card.Header>
                            <EmployeeForm 
                            addEmployee={this.addEmployee}/>
                        </Card>
                        </Col>
                    </Row>
                </Container>

                <Container>
                {this.state.editingEmployee? this.showEditModal(this.state.editingAddress): console.log('not editing')}
                <EmployeeList className="employeeList"
                account={this.state.account} 
                companyId={this.state.companyId} 
                companyAddress={this.state.account} 
                roster={this.state.roster}
                payEmployee={this.payEmployee}
                editingEmployee={this.editingEmployee} 
                />
                
                </Container>


            </div>
        )
    }
}

export default Web3Setup;