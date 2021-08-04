import React, {Component} from "react";
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';

class RunPayrollModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container>
            <Modal show={true} onHide={this.props.closePayrollModal}>
                <Modal.Header closeButton onClick={this.props.closePayrollModal}>
                  <Modal.Title>Run Payroll</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <h5>Are you sure you want to run payroll?</h5>
                
        </Modal.Body>
        <Modal.Footer>
        <Button variant="primary" onClick={this.props.runPayroll}>Run</Button> 
        <Button className="goBack" variant="secondary" onClick={this.props.closePayrollModal}>Cancel</Button>
        </Modal.Footer>
      </Modal>
      </Container>
        )
    }
}

export default RunPayrollModal;
