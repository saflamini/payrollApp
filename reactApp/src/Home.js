import React, { Component } from "react";
import EmployeeList from "./EmployeeList";
import Balance from "./Balance";
import Container from "react-bootstrap/esm/Container";



class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>

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
            </div>
        )
    }
}

export default Home;