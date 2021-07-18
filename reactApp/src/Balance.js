import React, {Component} from 'react'; 
import Fund from "./Fund";
import { BigNumber } from "bignumber.js";
import Withdraw from './Withdraw';
import {decimals} from "./config";
import "./Balance.css";
import Card from 'react-bootstrap/esm/Card';
import Container from 'react-bootstrap/esm/Container';
import Button from 'react-bootstrap/esm/Button';


class Balance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addingFunds: "false"
        }
        this.handleClick = this.handleClick.bind(this);
        this.fundPayroll = this.fundPayroll.bind(this);
        this.withdraw = this.withdraw.bind(this);
    }


    handleClick() {
        this.setState({addingFunds: true});
    }

    // fundPayroll(amount) {
    //     payrollContract.methods.fundPayroll(this.props.companyId).send({from: this.props.address, value: amount})
    //     .then(console.log);
    // }

    fundPayroll(amount, currency) {
        console.log(amount);
        console.log(currency);
        this.props.fundPayroll(amount, currency)
        // payrollContract.methods.fundPayroll(this.props.companyId).send({from: this.props.address, value: amount})
        // .then(console.log);
    }

    withdraw(amount, currencyAddress) {
        this.props.withdraw(amount, currencyAddress)
    }

   

    render() {
        //will need to come back to this for sake of performance and styling
        //haven't gotten conditional form to work here
        //could benefit from triggering a re-render after new funds are added
        // 86202995005 8620 3795005
        //new BigNumber(this.state.funding).shiftedBy(decimals[this.state.currency]
        return (
            <Container>
                <Card bg="light" className="balance">
                <h2>Your Balances</h2>
                <h5>{`${new BigNumber(this.props.usdcBalance).shiftedBy(-1 * (decimals['USDC'])).toFixed(2)} usdc`}</h5> 
                <h5>{`${new BigNumber(this.props.daiBalance).shiftedBy(-1 * (decimals['DAI'])).toFixed(2)} dai`}</h5>
                <h5>{`${new BigNumber(this.props.usdtBalance).shiftedBy(-1 * (decimals['USDT'])).toFixed(2)} usdt`}</h5>
                </Card>
                <Card bg="light" className="addFunds">
                {this.state.addingFunds ? <Fund funding={this.fundPayroll}/>
                :<Button size="sm" variant="success" onClick={this.handleClick}>Add Funding</Button>
                }
                </Card>
                <Card bg="light" className="withdrawFunds">
                    <Withdraw withdraw={this.withdraw}/>
                </Card>
            </Container>
        )
    }
}

export default Balance;