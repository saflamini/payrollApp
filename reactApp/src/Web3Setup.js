import React, {Component} from 'react';
import Web3 from 'web3';
import { web3 } from './config';
import { payrollContract } from './config';
// import detectEthereumProvider from '@metamask/detect-provider';
import { v4 as uuidv4 } from 'uuid';
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
        this.getCompanyId = this.getCompanyId.bind(this);
        this.getEmployees = this.getEmployees.bind(this);
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
            this.getCompanyId();
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

            // console.log(this.state.account);
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
            this.getCompanyId();
            this.getEmployees();
        }

        const accountList = await window.ethereum.request({ method: 'eth_accounts' })
        this.setState({ account: accountList[0] })

        if (acct.length > 0) {
            //if we have a connected metamask account, run getCompany and get companyId
            //these two functions also run if a reload occurs
            this.getCompany()
            this.getCompanyId();
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
    async getCompanyId() {
        let coId = await payrollContract.methods.getCompanyId(this.state.account).call({from: this.state.account});
        let co = await payrollContract.methods.getCompany(this.state.account).call({from: this.state.account})
        if (co !== "")
        this.setState({
            companyId: coId
        })       
        // this.getEmployees();
        this.getCompanyBalance();
        this.getEmployeeArray();
        // payrollContract.methods.getEmployeeSalary("0x00471Eaad87b91f49b5614D452bd0444499c1bd9", this.state.companyId).call({from: this.state.account}).then(console.log)

    }

    async getEmployees() {
        let employeeArray = await payrollContract.getPastEvents('employeeCreated', {filter: {_companyId: this.state.companyId}}, {fromBlock: "earliest"});
        let employeeRoster = [];
        for (let i = 0; i < employeeArray.length; i++) {
            if(employeeArray[i].returnValues._companyId === this.state.companyId) {
                // let salary = await payrollContract.methods.getEmployeeSalary(employeeArray[i].returnValues._address).call({from: this.state.account});
                // let interval = await payrollContract.methods.getEmployeeInterval(employeeArray[i].returnValues._address).call({from: this.state.account});
                employeeRoster.push({
                    address: employeeArray[i].returnValues._address,
                    // salary: `${web3.utils.fromWei(salary.toString(), 'ether')} eth`,
                    // interval: `Every ${interval / 7} weeks`
                    salary: `${web3.utils.fromWei(employeeArray[i].returnValues._salary.toString(), 'ether')} eth`,
                    interval: `Every ${employeeArray[i].returnValues._interval / 7} weeks`
                })
            }
        }
        console.log(employeeRoster);
        this.setState({roster: employeeRoster});

        // let employeeInformation = [];
        // for (let i = 0; i < employeeRoster.length; i++) {
        //     let employeeInfo = await payrollContract.getPastEvents('employeeInfo', {filter: {_address: employeeRoster[i]}}, {fromBlock: "earliest"})
        //     employeeInformation.push(`Employee ${employeeRoster[i]} is being paid ${employeeInfo[i].returnValues._salary} wei with an interval of ${employeeInfo[i].returnValues._interval}`);
        //     // console.log(employeeInformation.returnValues._interval);
        // }
        // console.log(employeeInformation)
      
        // let employeeInfo = payrollContract.events.employeeInfo({fromBlock: 0});
        // console.log(employeeInfo)
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
            console.log(employeeRender);
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
    }

    async updateSalary(address, companyId, newSalary) {
        console.log(address);
        console.log(companyId);
        console.log(newSalary);
        await payrollContract.methods.editEmployeeSalary(address, companyId, newSalary).send({from: this.state.account})
        .then(console.log)
       
    }

    addEmployee(employee, address) {
        let newEmployee = {...employee, id: uuidv4()}
        payrollContract.methods.createEmployee(employee.address, employee.salary, employee.interval, this.state.companyId).send({from: this.state.account, gas: 6721975})
        .then(console.log)
        // .then(
        // this.setState(state => ({ 
        //     employees: [...state.employees, newEmployee]
        // }))
       
        // )
    }

    async removeEmployee(address) {
        await payrollContract.methods.deleteEmployee(address, this.state.companyId).send({from: this.state.account})
        .then(console.log)
        //error handling might be nice here
        this.setState({editingEmployee: false});
        // this.setState(state => {
        //     roster: state.roster.filter(employee => employee.address !== address)
        // });
    }

    closeEditModal() {
        console.log('closing')
        this.setState({editingEmployee: false, editingAddress: ""});
    }



    render() {

        
        return (
            <div>
            <Container>
                {this.state.connected? 
                <Card bg="success" className="connectWallet">{this.state.account}</Card>
                : <ConnectWallet />
                }
            </Container>
            
                <Container className="top">
                    <Row>
                        
                        <Col>
                        <Container bg="dark">
                        <CompanyInfo account={this.state.account} company={this.state.company} getCompany={this.getCompany} />
                        <Balance address={this.state.account} companyId={this.state.companyId} balance={this.state.balance}/>
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
                // showEditModal={this.showEditModal}
                // closeEditModal={this.closeEditModal}
                editingEmployee={this.editingEmployee} 
                />
                
                </Container>

            </div>
        )
    }
}

export default Web3Setup;