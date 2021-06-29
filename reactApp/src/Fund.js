import React, {Component} from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';



class Fund extends Component {
    constructor(props) {
        super(props);
        this.state = {
            funding: ""
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
        this.props.funding(this.state.funding);
        this.setState({funding: ""})
    }

    render() {
        return (
            <div>

            <Form onSubmit={this.handleSubmit}>
                <Form.Label htmlFor="funding">Add Funds: </Form.Label>
                <InputGroup>
                <Form.Control type="text" name="funding" placeholder="Enter a number in wei..." onChange={this.handleChange} value={this.state.funding}></Form.Control>
                <Button type="submit" variant="success" size="sm" >Submit</Button>
                </InputGroup>
            </Form>
            </div>

        )
    }
}

export default Fund;