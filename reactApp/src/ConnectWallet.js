import React, {Component} from "react";
// import detectEthereumProvider from '@metamask/detect-provider';
import Button from 'react-bootstrap/Button';


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
            <Button variant="success" onClick={this.enableWallet} className="connectWallet">Connect Wallet</Button>
        )
    }
}

export default ConnectWallet;