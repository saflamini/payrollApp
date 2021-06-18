import React, {Component} from 'react';
import EmployeeForm from "./EmployeeForm";
import Employee from "./Employee";
import { payrollABI } from './config';
import { payrollAddress } from './config';
import { payrollContract } from './config';
import { v4 as uuidv4 } from 'uuid';
import Web3 from 'web3';


class EmployeeList extends Component {
 
    constructor(props) {
        super(props);
        this.state ={
            employees: [
                {name: 'Sam Flamini', address: "", salary: 100000, interval: 26, id: uuidv4()}
            ]
        }

        this.addEmployee = this.addEmployee.bind(this);
        this.renderEmployees = this.renderEmployees.bind(this);
        this.remove = this.remove.bind(this);
        this.updateName = this.updateName.bind(this);
        this.updateSalary = this.updateSalary.bind(this);
        this.updateInterval = this.updateInterval.bind(this)
    }


    addEmployee(employee, address) {
        let newEmployee = {...employee, id: uuidv4()}
        payrollContract.methods.createEmployee(employee.address, employee.salary, employee.interval, this.props.companyId).send({from: this.props.companyAddress, gas: 6721975})
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

    renderEmployees() {
        return (
            this.state.employees.map(employee => (
                <div key={employee.id}>{
                    <Employee 
                    name={employee.name}
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
            <div>
                <h1>Employee List</h1>
                <div>
                <EmployeeForm key={'form'} addEmployee={this.addEmployee}/>

                </div>
                
                {this.renderEmployees()}

            </div>
        )
    }
}

export default EmployeeList;