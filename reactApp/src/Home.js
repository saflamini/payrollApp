import React, { Component } from "react";
import EmployeeList from "./EmployeeList";
import Balance from "./Balance";
import Navigation from "./Navigation";
import Container from "react-bootstrap/esm/Container";
import ConnectWallet from "./ConnectWallet";

//still in testing - page does not work 


class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
             {/* <Navigation/> */}
                <Container bg="light">
                    <Balance 
                    account={this.props.account} 
                    usdcBalance={this.props.usdcBalance} 
                    daiBalance={this.props.daiBalance}
                    usdtBalance={this.props.usdtBalance}
                    fundPayroll={this.props.fundPayroll} 
                    withdraw={this.props.withdrawFunds}
                    />
                </Container>
                <Container>
                    <EmployeeList className="employeeList"
                    account={this.props.account} 
                    companyAddress={this.props.account} 
                    roster={this.props.roster}
                    payEmployee={this.props.payEmployee}
                    editingEmployee={this.props.editingEmployee} 
                    companyContract={this.props.companyContract}
                    runningPayroll={this.props.toggleRunningPayroll}
                    />
                </Container>
            </div>
        )
    }
}

export default Home;