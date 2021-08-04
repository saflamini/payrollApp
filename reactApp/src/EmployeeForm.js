import React, {Component} from 'react';
// import { assets } from './config';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import InputGroup from 'react-bootstrap/InputGroup';




class EmployeeForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            address: '',
            currency: 'USDC',
            salary: '',
            interval: '',
            filingstatus: 'Single'
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
        console.log('working')
        this.props.addEmployee(this.state);
        this.setState({first_name: '', last_name: '', address: '', salary: '', interval: ''})
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
                    <Form.Control type="text" name="address" value={this.state.address} onChange={this.handleChange}></Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
                <Form.Label htmlFor="salary">Salary </Form.Label>
                    <InputGroup>
                    <Form.Control type="text" name="salary" value={this.state.salary} onChange={this.handleChange}></Form.Control>
                    <DropdownButton variant="dark" id="dropdown-basic-button" title={this.state.currency}>
                        <Dropdown.Item onClick={() => this.handleClick('USDC')}>USDC</Dropdown.Item>
                        <Dropdown.Item onClick={() => this.handleClick('DAI')}>DAI</Dropdown.Item>
                        <Dropdown.Item onClick={() => this.handleClick('USDT')}>USDT</Dropdown.Item>
                    </DropdownButton>
                    </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label htmlFor="interval">Interval </Form.Label>
                    <Form.Control type="text" name="interval" value={this.state.interval} onChange={this.handleChange}></Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label htmlFor="state">State </Form.Label>
                    <Form.Control type="text" name="state" value={this.state.interval} onChange={this.handleChange}></Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
                <Form.Label htmlFor="filingstatus">Salary </Form.Label>
                    <InputGroup>
                    <DropdownButton variant="dark" id="dropdown-basic-button" title={this.state.filingstatus}>
                        <Dropdown.Item onClick={() => this.handleClick('Married - Filing Jointly')}>Married Filing Jointly</Dropdown.Item>
                        <Dropdown.Item onClick={() => this.handleClick('Single')}>Single</Dropdown.Item>
                        <Dropdown.Item onClick={() => this.handleClick('Head of HH')}>Head of HH</Dropdown.Item>
                    </DropdownButton>
                    </InputGroup>
                </Form.Group>

                <Button variant="success" onClick={this.handleSubmit}>Create Employee</Button>
            </Form>
        </Container>
    )}
}

export default EmployeeForm;

// /* <p>
//                     <label htmlFor="address">Ethereum Address </label>
//                     <input type="text" name="address" value={this.state.address} onChange={this.handleChange}></input>
//                 </p>
//                 <p>
//                     <label htmlFor="salary">Salary </label>
//                     <input type="text" name="salary" value={this.state.salary} onChange={this.handleChange}></input>
//                 </p>
//                 <p>
//                     <label htmlFor="interval">Interval </label>
//                     <input type="text" name="interval" value={this.state.interval} onChange={this.handleChange}></input>
//                 </p>