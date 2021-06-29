import React, {Component} from 'react'; 
import Fund from "./Fund";
import "./Balance.css";
import { payrollContract } from './config';
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
    }


    handleClick() {
        this.setState({addingFunds: true});
    }

    fundPayroll(amount) {
        payrollContract.methods.fundPayroll(this.props.companyId).send({from: this.props.address, value: amount})
        .then(console.log);
    }

   

    render() {
        //will need to come back to this for sake of performance and styling
        //haven't gotten conditional form to work here
        //could benefit from triggering a re-render after new funds are added
        return (
            <Container>
                <Card bg="dark" className="balance">
                <h2>Your Balance</h2>
                <h5>{`${Number(this.props.balance).toFixed(3)} ether`}</h5>
                </Card>
                <Card bg="dark" className="addFunds">
                <h3>Add Additional Funding</h3>
                {this.state.addingFunds ? <Fund funding={this.fundPayroll}/>
                :<Button size="sm" variant="success" onClick={this.handleClick}>Add Funding</Button>
                }
                </Card>
            </Container>
        )
    }
}

export default Balance;