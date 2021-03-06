import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {assets, decimals, assetSymbols} from "./config";
import { BigNumber } from "bignumber.js";
import "./EditModal.css";



class EditModal extends Component {
constructor(props) {
    super(props);
    this.state = {
        employeeObject: {
            address: this.props.address ,
            salary: this.props.salary,
            currency: this.props.currencySymbol,
            interval: this.props.interval
        },
        salary: "",
        interval: "",
        salaryEditing: false,
        intervalEditing: false,
        deleting: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleDeleteEmployee = this.handleDeleteEmployee.bind(this);
    this.salaryEdit = this.salaryEdit.bind(this);
    this.intervalEdit = this.intervalEdit.bind(this);
    this.deletingEmployee = this.deletingEmployee.bind(this);
    this.updateEmployeeObject = this.updateEmployeeObject.bind(this);
    this.updateSal = this.updateSal.bind(this);
    this.updateInt = this.updateInt.bind(this);
    this.sendUpdate = this.sendUpdate.bind(this);
}

handleChange(evt) {
    this.setState({
        [evt.target.name]: evt.target.value
    })
}

handleDeleteEmployee(evt) {
    evt.preventDefault();
    this.props.removeEmployee(this.props.address);
}

salaryEdit() {
    this.setState({salaryEditing: !this.state.salaryEditing})
}

intervalEdit() {
    this.setState({intervalEditing: !this.state.intervalEditing})
}

deletingEmployee() {
    this.setState({deleting: !this.state.deleting})
}

salaryEdited() {
    this.setState({salary: this.state.employeeObject.salary})
    this.setState({salaryEditing: !this.state.salaryEditing})

}

intervalEdited() {
    this.setState({interval: this.state.employeeObject.interval})
    this.setState({intervalEditing: !this.state.intervalEditing})

}

updateEmployeeObject() {
    this.setState({
        address: this.props.address,
        salary: this.props.salary,
        interval: this.props.interval
    })
}

sendUpdate() {
    //converts the state salary value to the proper # of decimals
    let d = decimals[this.state.employeeObject.currency];
    console.log(this.state.employeeObject.currency)
    let num = new BigNumber(this.state.employeeObject.salary).shiftedBy(d);
    console.log(num);
    console.log('hi')
    let adjustedEmployeeObject = {
        address: this.state.employeeObject.address,
        salary: new BigNumber(this.state.employeeObject.salary).shiftedBy(d).c[0],
        interval: this.state.employeeObject.interval
    }
    this.props.handleModalUpdate(adjustedEmployeeObject);
}

updateSal() {
    console.log(decimals[this.state.employeeObject.currency]);
    let d = decimals[this.state.employeeObject.currency]
    console.log(this.state.salary)
    this.setState({
        employeeObject: {
            address: this.props.address,
            salary: this.state.salary,
            currency: this.props.currencySymbol,
            interval: this.props.interval
        },
        salaryEditing: false
    })
}

updateInt() {
    this.setState({
        employeeObject: {
            address: this.props.address,
            salary: this.props.salary,
            currency: this.props.currencySymbol,
            interval: this.state.interval
        },
        intervalEditing: false
    })
}


render() {




if (this.state.salaryEditing) {
    let salaryDisplay;
    salaryDisplay = (

        <Container>
            <Modal show={true} onHide={this.props.closeEditModal}>
                <Modal.Header closeButton onClick={this.props.closeEditModal}>
                  <Modal.Title>Edit Employee Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                
                <Form >
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="salaryEdit">Edit Salary </Form.Label>
                    <Form.Control type="text" name="salary" value={this.state.salary} onChange={this.handleChange}></Form.Control>
                </Form.Group>
                <Button variant="primary" onClick={this.updateSal}>Done</Button>
                <Button className="goBack" variant="secondary" onClick={this.salaryEdit}>Cancel</Button>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.closeEditModal}>
            Close
          </Button>

        </Modal.Footer>
      </Modal>
      </Container>
    )
    return salaryDisplay;
}

if (this.state.intervalEditing) {
    let intervalDisplay;
    intervalDisplay = (

        <Container>
            <Modal show={true} onHide={this.props.closeEditModal}>
                <Modal.Header closeButton onClick={this.props.closeEditModal}>
                  <Modal.Title>Edit Employee Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form >
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="intervalEdit">Edit Interval </Form.Label>
                    <Form.Control type="text" name="interval" value={this.state.interval} onChange={this.handleChange}></Form.Control>
                </Form.Group>
                <Button variant="primary" onClick={this.updateInt}>Done</Button> 
                <Button className="goBack" variant="secondary" onClick={this.intervalEdit}>Cancel</Button>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.closeEditModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      </Container>
    )
    return intervalDisplay;
}

if (this.state.deleting) {
    let deletionDisplay;
    deletionDisplay = (

        <Container>
            <Modal show={true} onHide={this.props.closeEditModal}>
                <Modal.Header closeButton onClick={this.props.closeEditModal}>
                  <Modal.Title>Edit Employee Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                
                <Form >
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="salaryEdit">Are you sure you want to delete this employee? </Form.Label>
                    <p>
                    <Button variant="danger" onClick={this.handleDeleteEmployee}>Yes</Button>
                    <Button className="goBack" variant="secondary" onClick={this.deletingEmployee}>No</Button>
                    </p>
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.closeEditModal}>
            Close
          </Button>

        </Modal.Footer>
      </Modal>
      </Container>
    )
    return deletionDisplay;
}

else {
    return (
    <Container>
         <Modal show={true} onHide={this.props.closeEditModal}>
                <Modal.Header closeButton onClick={this.props.closeEditModal}>
                  <Modal.Title>Edit Employee Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
        <p>
            <strong>Address</strong>: {this.state.employeeObject.address}
        </p>
        <p>
            <strong>Salary</strong>: {`$${this.state.employeeObject.salary} ${this.state.employeeObject.currency} per year`} <Button size="sm" variant="secondary" onClick={this.salaryEdit}>Edit</Button>
        </p>
        <p>
            <strong>Payment Interval</strong>: {`Every ${this.state.employeeObject.interval} days`} <Button size="sm" variant="secondary" onClick={this.intervalEdit}>Edit</Button>
        </p>         
        <Button size="sm" variant="danger" onClick={this.deletingEmployee}>Delete</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.closeEditModal}>
            Close
          </Button>
          <Button onClick={this.sendUpdate} variant="primary">
            Save Changes
          </Button>
        </Modal.Footer>
        </Modal>
        </Container>
    )
}

}}

export default EditModal;