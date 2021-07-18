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
            name: '',
            address: '',
            currency: 'USDC',
            salary: '',
            interval: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
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
        this.setState({name: '', address: '', salary: '', interval: ''})
    }

    handleClick(currency) {
        this.setState({
            currency: currency
        })
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