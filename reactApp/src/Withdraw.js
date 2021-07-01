import React, {Component} from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

class Withdraw extends Component {
    constructor(props) {
        super(props);
        this.state = {
            withdrawal: ""
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
        this.props.withdraw(this.state.withdrawal);
        this.setState({withdrawal: ""})
    }

    render() {
        return (
            <div>

            <Form onSubmit={this.handleSubmit}>
                <Form.Label htmlFor="withdrawal">Withdraw Funds: </Form.Label>
                <InputGroup>
                <Form.Control type="text" name="withdrawal" placeholder="Enter a number in wei..." onChange={this.handleChange} value={this.state.withdrawal}></Form.Control>
                <Button type="submit" variant="success" size="sm" >Submit</Button>
                </InputGroup>
            </Form>
            </div>
        )
    }
}

export default Withdraw;

