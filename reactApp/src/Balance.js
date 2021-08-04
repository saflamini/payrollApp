import React, {Component} from 'react'; 
import Fund from "./Fund";
import { BigNumber } from "bignumber.js";
import Withdraw from './Withdraw';
import {decimals} from "./config";
import "./Balance.css";
import Card from 'react-bootstrap/esm/Card';
import Container from 'react-bootstrap/esm/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import {Pie} from 'react-chartjs-2';
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
                <Row>
                <Col>
                <Card bg="#FFFFFF" className="balance">
                <h2>Your Balances</h2>
                <h5>{this.props.usdcBalance == 0? '$0.00 USDC'
                :`$${new BigNumber(this.props.usdcBalance).shiftedBy(-1 * (decimals['USDC'])).toFixed(2)} USDC`}</h5> 

                <h5>{this.props.daiBalance == 0? '$0.00 DAI'
                :`$${new BigNumber(this.props.daiBalance).shiftedBy(-1 * (decimals['DAI'])).toFixed(2)} DAI`}</h5>

                <h5>{this.props.usdtBalance == 0? "$0.00 USDT"
                :`$${new BigNumber(this.props.usdtBalance).shiftedBy(-1 * (decimals['USDT'])).toFixed(2)} USDT`}</h5>
                </Card>
                <Card className="addFunds">
                {this.state.addingFunds ? <Fund funding={this.fundPayroll}/>
                :<Button size="sm" className="add-button" onClick={this.handleClick}>Add Funding</Button>
                }
                </Card>
                <Card className="withdrawFunds">
                    <Withdraw withdraw={this.withdraw}/>
                </Card>
                
                </Col>
                <Col>
                <Card className="pie-chart">
                <h3>Total Funding</h3>
                <Pie className="pie"
                data={{
                    labels: ["USDC", "DAI", "USDT"],
                    datasets: [
                    {
                    label: 'Funding Breakdown',
                    data: [
                        new BigNumber(this.props.usdcBalance).shiftedBy(-1 * (decimals['USDC'])).toFixed(2),
                        new BigNumber(this.props.daiBalance).shiftedBy(-1 * (decimals['DAI'])).toFixed(2),
                        new BigNumber(this.props.usdtBalance).shiftedBy(-1 * (decimals['USDT'])).toFixed(2)
                    ],
                    backgroundColor: [
                        "#2774CA", "#FDC034", "#4FAF95"
                    ]
                }]
                }}
                />
               
                </Card>
                </Col>

                </Row>
                
                
                
                
            </Container>
        )
    }
}

export default Balance;