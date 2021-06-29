import React, {Component} from 'react';
import EmployeeForm from "./EmployeeForm";
import Employee from "./Employee";
import { payrollABI } from './config';
import { payrollAddress } from './config';
import { payrollContract } from './config';
import { v4 as uuidv4 } from 'uuid';
import Web3 from 'web3';
import "./EmployeeList.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import EditModal from './EditModal';



class EmployeeList extends Component {
 
    constructor(props) {
        super(props);
        this.state ={
            employees: [{name: 'sam'}],
            editing: false,
            showEdit: false,
            showCreate: false
        }

        this.addEmployee = this.addEmployee.bind(this);
        this.renderEmployees = this.renderEmployees.bind(this);
        this.remove = this.remove.bind(this);
        this.updateName = this.updateName.bind(this);
        this.updateSalary = this.updateSalary.bind(this);
        this.updateInterval = this.updateInterval.bind(this);
        this.payEmployee = this.payEmployee.bind(this);
        this.removeEmployee = this.removeEmployee.bind(this);
        this.handleEditing = this.handleEditing.bind(this);
        this.getEditingEmployee = this.getEditingEmployee.bind(this);
    }

    //this creates an employee on the back end.
    //but how to render them based on the connected company??
    addEmployee(employee, address) {
        let newEmployee = {...employee, id: uuidv4()}
        payrollContract.methods.createEmployee(employee.address, employee.salary, employee.interval, this.props.companyId).send({from: this.props.companyAddress, gas: 6721975})
        .then(console.log)
        .then(
        this.setState(state => ({ 
            employees: [...state.employees, newEmployee]
        }))
       
        )
    }

    // addEmployee(employee) {
    //     let newEmployee = {...employee, id: uuidv4()}
    //     this.setState(state => ({ 
    //         employees: [...state.employees, newEmployee]
    //     }))
    // }

    fundPayroll(amount) {
        
    }


    remove(id) {
        this.setState({
            employees: this.state.employees.filter(employee => employee.id !== id)
        })
    }

    updateName(id, updatedName) {
        let updatedEmployees = this.state.employees.map(employee => {
            if(employee.id === id) {
                return {...employee, name: updatedName}
            }
            return employee;
        })
        this.setState({employees: updatedEmployees})
    }

    // updateSalary(id, updatedSalary) {
    //     let updatedEmployees = this.state.employees.map(employee => {
    //         if(employee.id === id) {
    //             return {...employee, salary: updatedSalary}
    //         }
    //         return employee;
    //     })
    //     this.setState({employees: updatedEmployees})
    // }

    // updateInterval(id, updatedInterval) {
    //     let updatedEmployees = this.state.employees.map(employee => {
    //         if(employee.id === id) {
    //             return {...employee, interval: updatedInterval}
    //         }
    //         return employee;
    //     })
    //     this.setState({employees: updatedEmployees})
    // }  

    async updateSalary(address, companyId, newSalary) {
        this.props.handleModalUpdate()
        console.log(address);
        console.log(companyId);
        console.log(newSalary);
        await payrollContract.methods.editEmployeeSalary(address, companyId, newSalary).send({from: this.props.account})
        .then(console.log)
       
    }

    async updateInterval(address, companyId, newInterval) {
        this.props.handleModalUpdate()
        await payrollContract.methods.editEmployeeInterval(address, companyId, newInterval).send({from: this.props.account})
        .then(console.log)
    }

    async payEmployee(address, companyId) {
        await payrollContract.methods.payEmployee(address, companyId).send({from: this.props.account})
        .then(console.log)
    }

    //need to remove deleted employee from display
    async removeEmployee(address, companyId) {
        await payrollContract.methods.deleteEmployee(address, companyId).send({from: this.props.account})
        .then(console.log)
        // this.setState(state => {
        //     roster: state.roster.filter(employee => employee.address !== address)
        // });
    }

    showEdit(employeeId) {
        this.setState({editing: true, editingEmployee: employeeId});
    }

    handleEditing(employeeAddress) {
        this.props.editingEmployee(employeeAddress);
    }

   

    // renderEmployees() {
    //     return (
    //         this.state.employees.map(employee => (
    //             <div key={employee.id}>{
    //                 <Employee 
    //                 name={employee.name}
    //                 salary={employee.salary}
    //                 interval={employee.interval} 
    //                 id={employee.id}
    //                 removeEmployee={() => this.remove(employee.id)}
    //                 updateName={this.updateName}
    //                 updateSalary={this.updateSalary}
    //                 updateInterval={this.updateInterval}
    //                 />}
    //             </div>
    //         ))
    //     )
    // }
    renderEmployees() {
        return (
            this.props.roster.map(employee => (
                <tbody key={employee.address + this.props.companyId}>{
                    <Employee 
                    // name={employee.name}
                    address={employee.address}
                    account={this.props.account}
                    salary={employee.salary}
                    interval={employee.interval} 
                    id={employee.id}
                    companyId={this.props.companyId}
                    removeEmployee={this.removeEmployee}
                    payEmployee={this.payEmployee}
                    updateName={this.updateName}
                    updateSalary={this.updateSalary}
                    updateInterval={this.updateInterval}
                    handleEditing={this.handleEditing}
                    />}
                </tbody>
            ))
        )
    }

    getEditingEmployee() {
        let targetEmployee;
        for(let i = 0; i < this.props.roster.length; i++) {
            if (this.props.roster[i].address === this.props.editingAddress) {
                targetEmployee = this.props.roster[i];
                break;
            }
            console.log(targetEmployee)
            return targetEmployee;
        }
    }

    render() {

        // if(this.state.editing) {
        //     let e = this.getEditingEmployee();
        //     console.log(e);
        //     return (
        //     <EditModal 
        //     show={true} 
        //     address={e.address} 
        //     salary={e.salary} 
        //     interval={e.interval}/>
  
        // )
        // }
  
    
        return (

            <div className="employeeList">
                <Container>
                    <Row>
                        {/* <Col xs={10}> */}
                        <h3>Employee Roster</h3>
                        <Table responsive striped bordered hover variant="dark">
                        <thead>
                            <tr>
                            <th>Address</th>
                            <th>Salary</th>
                            <th>Interval</th>
                            <th>Pay</th>
                            <th>Edit</th>
                            </tr>
                        </thead>
                        {this.renderEmployees()}  
                        </Table> 
                   
                        {/* </Col> */}

                        {/* <Col>
                        <div>
                        <h4>Add a New Employee</h4>
                        <EmployeeForm key={'form'} addEmployee={this.addEmployee}/>
                        </div> 
                        </Col> */}
                    </Row>
                </Container>
            </div>
        )
    }
}

export default EmployeeList;