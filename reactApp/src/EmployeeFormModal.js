import React, {Component} from "react";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from "react-bootstrap/Modal";
import Spinner from 'react-bootstrap/Spinner';



class EmployeeFormModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            address: '',
            currency: 'USDC',
            salary: '',
            interval: '',
            state: '',
            filingstatus: 'Single',
            allowances: '',
            created: true
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleFilingClick = this.handleFilingClick.bind(this);
    }

    handleChange(evt) {
        this.setState({
            [evt.target.name]: evt.target.value
        })
    }

    handleSubmit(evt) {
        evt.preventDefault();
        this.setState({created: false})
        setTimeout(() => {
            this.props.addEmployee(this.state)
            .then(console.log())
            .then(this.setState({first_name: '', last_name: '', address: '', salary: '', interval: '', state: '', allowances: '', filingstatus: 'Single', created: true}))
        }, 2000);
    }

    handleClick(currency) {
        this.setState({
            currency: currency
        })
    }

    handleFilingClick(status) {
        this.setState({filingstatus: status})
    }

    render() {
        
        return (
        <Container>
             <Modal show={true} onHide={this.props.closeCreateModal}>
                    <Modal.Header closeButton onClick={this.props.closeCreateModal}>
                      <Modal.Title>Add New Employee</Modal.Title>
                    </Modal.Header>
            <Modal.Body>
            <Container>
            <Form>
                {/* <Form.Group className="mb-3">
                    <Form.Label htmlFor="name">Name </Form.Label>
                    <Form.Control type="text" name="name" value={this.state.name} onChange={this.handleChange}></Form.Control>
                </Form.Group>  */}
                 <Form.Group className="mb-3">
                    <Form.Label htmlFor="first_name">First Name </Form.Label>
                    <Form.Control type="text" name="first_name" value={this.state.first_name} onChange={this.handleChange}></Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label htmlFor="last_name">Last Name </Form.Label>
                    <Form.Control type="text" name="last_name" value={this.state.last_name} onChange={this.handleChange}></Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label htmlFor="address">Ethereum Address </Form.Label>
                    <Form.Control type="text" name="address" placeholder="0x..."value={this.state.address} onChange={this.handleChange}></Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
                <Form.Label htmlFor="salary">Salary </Form.Label>
                    <InputGroup>
                    <Form.Control type="text" name="salary" placeholder="Enter annual value" value={this.state.salary} onChange={this.handleChange}></Form.Control>
                    <DropdownButton variant="dark" id="dropdown-basic-button" title={this.state.currency}>
                        <Dropdown.Item onClick={() => this.handleClick('USDC')}>USDC</Dropdown.Item>
                        <Dropdown.Item onClick={() => this.handleClick('DAI')}>DAI</Dropdown.Item>
                        <Dropdown.Item onClick={() => this.handleClick('USDT')}>USDT</Dropdown.Item>
                    </DropdownButton>
                    </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label htmlFor="interval">Interval </Form.Label>
                    <Form.Control type="text" name="interval" placeholder="Enter a number in days" value={this.state.interval} onChange={this.handleChange}></Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label htmlFor="state">State </Form.Label>
                    <Form.Control type="text" name="state" placeholder="Enter abbreviation: OH, IL, CA, etc..." value={this.state.state} onChange={this.handleChange}></Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
                <Form.Label htmlFor="filingstatus">Filing Status </Form.Label>
                    <InputGroup>
                    <DropdownButton variant="dark" id="dropdown-basic-button" title={this.state.filingstatus}>
                        <Dropdown.Item onClick={() => this.handleFilingClick('Married')}>Married Filing Jointly</Dropdown.Item>
                        <Dropdown.Item onClick={() => this.handleFilingClick('Single')}>Single</Dropdown.Item>
                        <Dropdown.Item onClick={() => this.handleFilingClick('Head')}>Head of HH</Dropdown.Item>
                    </DropdownButton>
                    </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label htmlFor="allowances"># of Allowances </Form.Label>
                    <Form.Control type="text" name="allowances" placeholder="Enter a number" value={this.state.allowances} onChange={this.handleChange}></Form.Control>
                </Form.Group>


            </Form>
        </Container>
              
            </Modal.Body>
            <Modal.Footer>
                {this.state.created? <Button variant="primary" onClick={this.handleSubmit}>Create Employee</Button>
                :<Spinner animation="border" variant="primary"></Spinner>}
              <Button variant="secondary" onClick={this.props.closeCreateModal}>
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

export default EmployeeFormModal;