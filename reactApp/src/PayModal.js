import React, {Component} from "react";
import Container from "react-bootstrap/esm/Container";
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
// import {assets, decimals, assetSymbols} from "./config";
// import { BigNumber } from "bignumber.js";

class PayModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employeeObject: {
                address: this.props.address ,
                salary: this.props.salary,
                currency: this.props.currencySymbol,
                lastDayPaid: this.props.lastDayPaid,
                interval: this.props.interval
            },
            salary: "",
            oneOffPayment: "",
            paid: true,
            paidOneOff: true
    }
    this.handleChange = this.handleChange.bind(this);
    this.pay = this.pay.bind(this);
    this.sendOneOff = this.sendOneOff.bind(this);
}

    handleChange(evt) {
        this.setState({
            [evt.target.name]: evt.target.value
        })
    }

    pay(evt) {
        evt.preventDefault();
        console.log(this.state.employeeObject.address)
        this.setState({paid: false})
        setTimeout(() => {
            this.props.payEmployee(this.state.employeeObject.address)
            .then(console.log())
            .then(this.setState({paid: true}))
        }, 2000);
    }

    sendOneOff(evt) {
        evt.preventDefault();
        this.setState({paidOneOff: false})
        setTimeout(() => {
            this.props.sendSinglePayment(this.state.employeeObject.address, this.state.oneOffPayment)
            .then(console.log())
            .then(this.setState({paidOneOff: true, oneOffPayment: ""}))
        }, 2000);
    }

    render() {
        
                return (
                <Container>
                     <Modal show={true} onHide={this.props.closePayModal}>
                            <Modal.Header closeButton onClick={this.props.closePayModal}>
                              <Modal.Title>Pay Employee</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                    <p>
                        <strong>Address</strong>: {this.state.employeeObject.address}
                    </p>
                    <p>
                        <strong>Salary</strong>: {`$${this.state.employeeObject.salary} ${this.state.employeeObject.currency} per year`} 
                    </p>
                    <p>
                        <strong>Payment Interval</strong>: {`Every ${this.state.employeeObject.interval} days`} 
                    </p>         
                    <p>
                        <strong>Last Payroll Payment</strong>: {(new Date(this.state.employeeObject.lastDayPaid * 1000)).toLocaleDateString()}
                    </p>
                    <p>
                        <strong>Next Date Elligible for Payroll Payment</strong>:  {
                            (new Date((this.state.employeeObject.lastDayPaid * 1000) + (this.state.employeeObject.interval * 86400 * 1000)).toLocaleDateString()) <= (Date.now())?
                            <strong>Elligible</strong>
                            : (new Date((this.state.employeeObject.lastDayPaid * 1000) + (this.state.employeeObject.interval * 86400 * 1000)).toLocaleDateString())
                        }
                    </p>
                    
                    <Form >
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="oneOffPayment"><strong>Send One Off Payment: </strong> </Form.Label>
                            <Form.Control type="text" name="oneOffPayment" placeholder="Enter a value here in USD..."value={this.state.oneOffPayment} onChange={this.handleChange}></Form.Control>
                        </Form.Group>
                        {this.state.paidOneOff? <Button variant="primary" onClick={this.sendOneOff}>Send One Off Payment</Button>
                        :<Spinner animation="border" variant="primary"></Spinner>}
                        
                    </Form>
                      
                    </Modal.Body>
                    <Modal.Footer>
                        {this.state.paid? <Button onClick={this.pay}>Pay Employee</Button>
                        :<Spinner animation="border" variant="primary"></Spinner>}
                      <Button variant="secondary" onClick={this.props.closePayModal}>
                        Close
                      </Button>
                      {/* <Button onClick={this.sendUpdate} variant="success"> */}
                        {/* Save Changes */}
                      {/* </Button> */}
                    </Modal.Footer>
                    </Modal>
                    </Container>
                )
            }
            
            }
        

    export default PayModal;
