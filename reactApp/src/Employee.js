import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { web3 } from './config';


class Employee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameEditing: false,
            salaryEditing: false,
            intervalEditing: false,
            // name: '',
            salary: '',
            interval: '',
            editingAddress: '',
            currencyAddress: '',
            paid: true
        }

        // this.nameEdit = this.nameEdit.bind(this);
        // this.handleNameUpdate = this.handleNameUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePayEmployee = this.handlePayEmployee.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }

    // nameEdit() {
    //     this.setState({nameEditing: !this.state.nameEditing})
    // }

   
    handleNameUpdate(evt) {
        evt.preventDefault();
        this.props.updateName(this.props.id, this.state.name)
        this.setState({nameEditing: false})
    }


    handlePayEmployee(evt) {
        evt.preventDefault();
        this.setState({paid: false})
        setTimeout(() => {
            this.props.payEmployee(this.props.address)
            .then(console.log())
            .then(this.setState({paid: true}))
        }, 2000);
    }
        //add in a loader while payment goes through and a signal that it was indeed processed
    


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

            let result;
            result = (
      
            <tr>
                <td>{employeeObject.address}</td>
                <td>{`${web3.utils.fromWei(employeeObject.salary.toString(), 'ether')} eth`} </td>
                <td>{`${(employeeObject.interval / 7).toFixed(2)} weeks`}</td>
                <td>{this.state.paid?<Button variant="success" onClick={this.handlePayEmployee}>Pay</Button>
                :<Spinner animation="border" variant="success"></Spinner>}</td>
                <td><Button variant="success" onClick={this.toggleModal}>Edit</Button></td>
            </tr>
               

            )
            return result;
        }
    }


export default Employee;