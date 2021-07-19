import React, {Component} from "react";
import { web3 } from './config';
import { assets } from "./config";
import { BigNumber } from "bignumber.js";
import { decimals } from "./config";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';



class Fund extends Component {
    constructor(props) {
        super(props);
        this.state = {
            funding: "",
            currency: "USDC"
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
        console.log(this.state.currency)
        this.props.funding(new BigNumber(this.state.funding).shiftedBy(decimals[this.state.currency]), assets[this.state.currency]);
        this.setState({funding: ""})
    }

    handleClick(currency) {
        this.setState({
            currency: currency
        })
    }

    render() {
        return (
            <div>

            <Form onSubmit={this.handleSubmit}>
                <Form.Label htmlFor="funding">Add Funds: </Form.Label>
                <InputGroup>
                <Form.Control type="text" name="funding" placeholder="Enter a dollar amount..." onChange={this.handleChange} value={this.state.funding}></Form.Control>
                <DropdownButton variant="dark" id="dropdown-basic-button" title={this.state.currency}>
                        <Dropdown.Item onClick={() => this.handleClick('USDC')}>USDC</Dropdown.Item>
                        <Dropdown.Item onClick={() => this.handleClick('DAI')}>DAI</Dropdown.Item>
                        <Dropdown.Item onClick={() => this.handleClick('USDT')}>USDT</Dropdown.Item>
                    </DropdownButton>
                    <Button type="submit" variant="success" size="sm" >Submit</Button>
                </InputGroup>
            </Form>
            </div>

        )
    }
}

export default Fund;