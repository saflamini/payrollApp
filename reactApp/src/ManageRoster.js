import React, {Component} from "react";
import EmployeeList from "./EmployeeList";
// import Navigation from "./Navigation";
// import EmployeeFormModal from "./EmployeeFormModal";
// import EmployeeForm from "./EmployeeForm";
// import Card from "react-bootstrap/Card"
import "./EmployeeList.css";

class ManageRoster extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
            {/* <Navigation /> */}
            {/* <Card  className="employeeForm" bg="light">
                    <Card.Header><h3>Add a New Employee</h3></Card.Header>
                    <EmployeeForm 
                        addEmployee={this.props.addEmployee}/>
                    </Card> */}
                <EmployeeList 
                className="employeeList"
                account={this.props.account} 
                companyAddress={this.props.account} 
                roster={this.props.roster}
                payEmployee={this.props.payEmployee}
                payingEmployee={this.props.payingEmployee}
                editingEmployee={this.props.editingEmployee} 
                companyContract={this.props.companyContract}
                showPayrollModal={this.props.showPayrollModal}
                renderPayrollModal={this.props.renderPayrollModal}
                closePayrollModal={this.props.closePayrollModal}
                toggleAddEmployee={this.props.toggleAddEmployee}
                closeCreateModal={this.props.closeCreateModal}
                />
            </div>
        )
    }
}

export default ManageRoster;