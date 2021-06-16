import React, {Component} from 'react';
import Web3 from 'web3';
import { web3 } from './config';
import { payrollContract } from './config';
import detectEthereumProvider from '@metamask/detect-provider';
import EmployeeList from './EmployeeList';
import { Contract } from 'web3-eth-contract';

class Web3Setup extends Component {
  
    constructor(props) {
        super(props);
        console.log(web3)
        console.log(payrollContract)
    
        this.state = {
            connected: false,
            account: ""
        };
        this.setup = this.setup.bind(this);
        this.enableWallet = this.enableWallet.bind(this);
        this.isConnected = this.isConnected.bind(this);
        this.disconnected = this.disconnected.bind(this);
        this.sendSome = this.sendSome.bind(this);
    }

    enableWallet() {
        window.ethereum.request({ method: 'eth_requestAccounts' })
        .then
        (window.ethereum.request({ method: 'eth_accounts'}))
        .then(console.log)
        .then(
            this.setState({connected: true})
        )
    }

   
    componentDidMount() {
        this.setup()
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
          console.log(acct)
          if (acct.length > 0) {
              this.setState({connected: true})
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
        // const web3 = new Web3(window.ethereum.currenProvider || "http://localhost:7545")
        const accountList = await window.ethereum.request({ method: 'eth_accounts' })
        const accounts = await web3.eth.getAccounts()
        this.setState({ account: accountList[0] })

       
        return provider;    

    }

    //this works for sending eth, but I'm not sure why I need to create a new web3 variable in each function
     sendSome() {
         payrollContract.methods.fundPayroll().send({from: this.state.account, value: '2000000000000000000'})
         web3.eth.sendTransaction({from: window.ethereum.selectedAddress , to: "0xf394cBbc09CB21e6D39542ec3De9fa73b7057836", value: "2000000000000000000"})
        .then(function(receipt){
        console.log(receipt)
        });
}


    render() {
        
        return (
            <div>
                {this.state.connected? 
                <span>Connected</span>
                : <button onClick={this.enableWallet}>Connect Wallet</button>
                }
                <p>
                    <button onClick={this.sendSome}>Fund Payroll</button>
                    </p>
                <EmployeeList />
                
            </div>
        )
    }
}

export default Web3Setup;