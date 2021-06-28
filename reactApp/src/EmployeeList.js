import React, {Component} from 'react';
import EmployeeForm from "./EmployeeForm";
import Employee from "./Employee";
import { payrollABI } from './config';
import { payrollAddress } from './config';
import { payrollContract } from './config';
import { v4 as uuidv4 } from 'uuid';
import Web3 from 'web3';
import "./EmployeeList.css";


class EmployeeList extends Component {
 
    constructor(props) {
        super(props);
        this.state ={
            employees: [{name: 'sam'}]
        }

        this.addEmployee = this.addEmployee.bind(this);
        this.renderEmployees = this.renderEmployees.bind(this);
        this.remove = this.remove.bind(this);
        this.updateName = this.updateName.bind(this);
        this.updateSalary = this.updateSalary.bind(this);
        this.updateInterval = this.updateInterval.bind(this)
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

    updateSalary(id, updatedSalary) {
        let updatedEmployees = this.state.employees.map(employee => {
            if(employee.id === id) {
                return {...employee, salary: updatedSalary}
            }
            return employee;
        })
        this.setState({employees: updatedEmployees})
    }

    updateInterval(id, updatedInterval) {
        let updatedEmployees = this.state.employees.map(employee => {
            if(employee.id === id) {
                return {...employee, interval: updatedInterval}
            }
            return employee;
        })
        this.setState({employees: updatedEmployees})
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
                <div key={employee.address + this.props.companyId}>{
                    <Employee 
                    // name={employee.name}
                    address={employee.address}
                    salary={employee.salary}
                    interval={employee.interval} 
                    id={employee.id}
                    removeEmployee={() => this.remove(employee.id)}
                    updateName={this.updateName}
                    updateSalary={this.updateSalary}
                    updateInterval={this.updateInterval}
                    />}
                </div>
            ))
        )
    }


    render() {

      
        return (
            <div className="employeeList">
                <div className="employeeRoster">
                <h3>Employee Roster</h3>
                {this.renderEmployees()}   
                </div>
               
                <h4>Add a New Employee</h4>
                <div>
                <EmployeeForm key={'form'} addEmployee={this.addEmployee}/>

                </div>
                
                

            </div>
        )
    }
}

export default EmployeeList;