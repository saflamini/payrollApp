import React, {Component} from "react";
import { web3 } from './config';
import detectEthereumProvider from '@metamask/detect-provider';



class ConnectWallet extends Component {
    constructor(props) {
        super(props);
        this.enableWallet = this.enableWallet.bind(this)
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

    render() {
        return (
            <button onClick={this.enableWallet} className="connectWallet">Connect Wallet</button>
        )
    }
}

export default ConnectWallet;