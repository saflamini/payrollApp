import React, {Component} from "react";
import PaymentList from "./PaymentList";

class Payments extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div>
                <h2>Employee Payments</h2>
                <PaymentList
                roster={this.props.roster}
                companyId={this.props.companyId}
                paymentList={this.props.paymentList}
                />
            </div>
        )
    }

}

export default Payments;