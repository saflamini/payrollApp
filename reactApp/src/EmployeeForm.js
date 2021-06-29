import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


class EmployeeForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            salary: '',
            interval: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
                    <Form.Control type="text" name="salary" value={this.state.salary} onChange={this.handleChange}></Form.Control>
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