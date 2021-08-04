import React, { Component } from "react";
import EmployeeList from "./EmployeeList";
import Balance from "./Balance";
// import Navigation from "./Navigation";
import Container from "react-bootstrap/esm/Container";
// import ConnectWallet from "./ConnectWallet";
import './Home.css'
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
                    withdraw={this.props.withdraw}
                    />
                </Container>
                <Container className="bottom">
                    <EmployeeList 
                    className="employeeList"
                    account={this.props.account} 
                    companyAddress={this.props.account} 
                    roster={this.props.roster}
                    payEmployee={this.props.payEmployee}
                    editingEmployee={this.props.editingEmployee} 
                    payingEmployee={this.props.payingEmployee}
                    companyContract={this.props.companyContract}
                    showPayrollModal={this.props.showPayrollModal}
                    renderPayrollModal={this.props.renderPayrollModal}
                    closePayrollModal={this.props.closePayrollModal}
                    toggleAddEmployee={this.props.toggleAddEmployee}
                    closeCreateModal={this.props.closeCreateModal}
                    />
                </Container>
            </div>
        )
    }
}

export default Home;