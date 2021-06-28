import React, {Component} from 'react'; 
import Fund from "./Fund";
import "./Balance.css";
import { payrollContract } from './config';

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
            <div className="container" className="funding">
                <h2>Your Balance</h2>
                <h4>{this.props.balance} ether</h4>
                {this.state.addingFunds ? <Fund funding={this.fundPayroll}/>
                :<button onClick={this.handleClick}>Add Funding</button>
                }
            </div>
        )
    }
}

export default Balance;