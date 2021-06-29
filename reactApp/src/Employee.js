import React, {Component} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import EditModal from './EditModal';
import { web3 } from './config';


class Employee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameEditing: false,
            salaryEditing: false,
            intervalEditing: false,
            name: '',
            salary: '',
            interval: '',
            editingAddress: ''
        }

        this.nameEdit = this.nameEdit.bind(this);
        // this.salaryEdit = this.salaryEdit.bind(this);
        // this.intervalEdit = this.intervalEdit.bind(this);
        this.handleNameUpdate = this.handleNameUpdate.bind(this);
        // this.handleSalaryUpdate = this.handleSalaryUpdate.bind(this);
        // this.handleIntervalUpdate = this.handleIntervalUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePayEmployee = this.handlePayEmployee.bind(this);
        // this.handleDeleteEmployee = this.handleDeleteEmployee.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }

    nameEdit() {
        this.setState({nameEditing: !this.state.nameEditing})
    }

    // salaryEdit() {
    //     this.setState({salaryEditing: !this.state.salaryEditing})
    // }

    // intervalEdit() {
    //     this.setState({intervalEditing: !this.state.intervalEditing})
    // }

    //define and bind these 3 methods that edit employee info 
   
    handleNameUpdate(evt) {
        evt.preventDefault();
        this.props.updateName(this.props.id, this.state.name)
        this.setState({nameEditing: false})
    }

    // handleSalaryUpdate(evt) {
    //     evt.preventDefault();
    //     this.props.updateSalary(this.props.address, this.props.companyId, this.state.salary);
    //     this.setState({salaryEditing: false})
    // }

    // handleIntervalUpdate(evt) {
    //     evt.preventDefault();
    //     this.props.updateInterval(this.props.address, this.props.companyId, this.state.interval);
    //     this.setState({intervalEditing: false})
    // }

    handlePayEmployee(evt) {
        evt.preventDefault();
        this.props.payEmployee(this.props.address, this.props.companyId);
        //add in a loader while payment goes through and a signal that it was indeed processed
    }

    // handleDeleteEmployee(evt) {
    //     evt.preventDefault();
    //     this.props.removeEmployee(this.props.address, this.props.companyId);
    // }

    handleChange(evt) {
        this.setState({
            [evt.target.name]: evt.target.value
        })
    }

    toggleModal() {
        this.props.handleEditing(this.props.address, this.props.companyId)
    }
       

    render() {

        

        const employeeObject = {
            // name: this.props.name,
            address: this.props.address,
            salary: this.props.salary,
            interval: this.props.interval
        }

        //we should probably pass the editing state up to either employeelist or web3 setup 
        //and render the modal + handle actions there
        // if (this.state.editing) {
        // return (
        // <div>
        // <EditModal show={true}/>
        // </div>
        // )}
    
        // if (this.state.nameEditing) {
        //     // let nameDisplay;
        //     // nameDisplay = (
        //     //     <div>
        //     //         <form onSubmit={this.handleNameUpdate}>
        //     //             <label htmlFor="name">Name </label>
        //     //             <input type="text" name="name" value={this.state.name} onChange={this.handleChange}></input> 
        //     //             <button >✅</button>
        //     //         </form>
        //     //     </div>
        //     // )
        //     // return nameDisplay
        // }

        // if (this.state.salaryEditing) {
        //     let salaryDisplay;
        //     salaryDisplay = (
        //         <div>
        //             <form onSubmit={this.handleSalaryUpdate}>
        //                 <label htmlFor="salary">Salary </label>
        //                 <input type="text" name="salary" value={this.state.salary} onChange={this.handleChange}></input> 
        //                 <button>✅</button>
        //             </form>
        //         </div>
        //     )
        //     return salaryDisplay;
        // }

        // if (this.state.intervalEditing) {
        //     let intervalDisplay;
        //     intervalDisplay = (
        //         <div>
        //             <form onSubmit={this.handleIntervalUpdate}>
        //                 <label htmlFor="interval">Interval </label>
        //                 <input type="text" name="interval" value={this.state.interval} onChange={this.handleChange}></input> 
        //                 <button>✅</button>
        //             </form>
        //         </div>
        //     )
        //     return intervalDisplay;
        // }

        // else {
            let result;
            result = (
            // <div>
            //      <p>
            //     <strong>Address</strong>: {employeeObject.address} <button onClick={this.salaryEdit}>🖊</button>
            //     </p>
            //     <p>
            //     <strong>Salary</strong>: {employeeObject.salary} <button onClick={this.salaryEdit}>🖊</button>
            //     </p>
            //     <p>
            //     <strong>Payment Interval</strong>: {employeeObject.interval} <button onClick={this.intervalEdit}>🖊</button>
            //     </p>
            //     <button onClick={this.handlePayEmployee}>Pay</button>           
            //     <button onClick={this.handleDeleteEmployee}>Delete</button>
            //     </div>
      
            <tr>
                <td>{employeeObject.address}</td>
                <td>{`${web3.utils.fromWei(employeeObject.salary.toString(), 'ether')} eth`} </td>
                <td>{`${(employeeObject.interval / 7).toFixed(2)} weeks`}</td>
                <td><Button variant="success" onClick={this.handlePayEmployee}>Pay</Button> </td>
                <td><Button variant="success" onClick={this.toggleModal}>Edit</Button></td>
            </tr>
               

            )
            return result;
        }
    }


export default Employee;