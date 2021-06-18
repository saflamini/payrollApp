import React, {Component} from 'react';
import Web3 from 'web3';
import { web3 } from './config';
import { payrollContract } from './config';
import detectEthereumProvider from '@metamask/detect-provider';
import EmployeeList from './EmployeeList';
import { Contract } from 'web3-eth-contract';
import { payrollAddress } from './config';
import './Web3Setup.css';
import ConnectWallet from './ConnectWallet';
import CompanyInfo from "./CompanyInfo";

class Web3Setup extends Component {
  
    constructor(props) {
        super(props);
     
    
        this.state = {
            connected: false,
            account: "",
            company: "Please create a new company or connect a wallet",
            companyId: null
        };
        this.setup = this.setup.bind(this);
        this.isConnected = this.isConnected.bind(this);
        this.disconnected = this.disconnected.bind(this);
        this.getCompany = this.getCompany.bind(this);
        this.getCompanyId = this.getCompanyId.bind(this);

    }


    componentDidMount() {
        this.setup()
        // this.getCompany()

    }

    isConnected() {
        let accts = window.ethereum._state.accounts;
    
        if (accts.length === 0) {
            console.log('not connected')
            return this.setState({connected: false})
        } else {
            console.log('connected')
            return this.setState({connected: true})
        }
    }

    disconnected() {
        this.setState({connected: false})
    }


    async setup() {

        // This function detects most providers injected at window.ethereum
  
        const provider = await detectEthereumProvider();
      
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
            console.log(this.state.account);
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
            this.getCompanyId();
        }


        // const web3 = new Web3(window.ethereum.currenProvider || "http://localhost:7545")
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
        if (co.length !== 0)
        this.setState({
            company: co
        })       
        console.log(this.state.company)
    }

    //gets company ID for employee creation handling
    async getCompanyId() {
        let coId = await payrollContract.methods.getCompanyId(this.state.account).call({from: this.state.account});
        let co = await payrollContract.methods.getCompany(this.state.account).call({from: this.state.account})
        if (co !== "")
        this.setState({
            companyId: coId
        })       
        console.log(this.state.companyId)
    }


    render() {

  

        
        return (
            <div>
                {this.state.connected? 
                <span className="connectWallet">{this.state.account}</span>
                : <ConnectWallet />
                }
                <CompanyInfo account={this.state.account} company={this.state.company} getCompany={this.getCompany}/>
                <EmployeeList companyId={this.state.companyId} companyAddress={this.state.account}/>
                
            </div>
        )
    }
}

export default Web3Setup;