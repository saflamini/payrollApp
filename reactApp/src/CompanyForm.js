import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import "./CompanyForm.css";


class CompanyForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyName: ""
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
        this.props.createCompany(this.state.companyName);
        this.setState({companyName: ""});
    }

    render() {
        return (
            <Container className="coForm">
                <h3>Create Company</h3>
                <Form >
                    <Form.Label htmlFor="companyName">Company Name: </Form.Label>
                    <InputGroup>
                    <Form.Control name="companyName" type="text" value={this.state.companyName} onChange={this.handleChange}></Form.Control>
                    <Button onClick={this.handleSubmit}variant="success" >Create Company</Button>
                    </InputGroup>
                </Form>
            </Container>
        )
    }
}

export default CompanyForm;