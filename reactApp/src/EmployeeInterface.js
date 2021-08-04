import React, {Component} from "react";
import ConnectWallet from "./ConnectWallet";
import Card from 'react-bootstrap/Card';

class EmployeeInterface extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connected: false,
            employeeAccount: ""

        }
    }

    render() {
        return (
            <div>
                {this.state.connected? 
                <Card bg="primary" className="connectWallet">{`${this.state.employeeAccount.toString().substring(0, 4)}...${this.state.employeeAccount.toString().substring(38)}`}</Card>
                : <ConnectWallet />
                }
            </div>
        )
    }
}

export default EmployeeInterface;