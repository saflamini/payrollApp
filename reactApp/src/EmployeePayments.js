import React, {Component} from "react";
import Table from "react-bootstrap/Table";

class EmployeePayments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paymentList: ""
        }

        this.getPayments = this.getPayments.bind(this);

        // this.getPayments();
    }

    async componentDidMount() {
        // await this.getPayments()
    }

    getPayments() {
        let list = []
        for (let i = 0; i < this.props.payments.length; i++) {
            if (this.props.payments[i].employee_id = this.props.employee_id) {
                console.log(this.props.payments[i])
                list.push(this.props.payments[i])
                // let list = this.state.paymentList
                // let newList = list.push(this.props.payments[i]);
            }
        }
        this.setState({
            paymentList: list
        })
    }

    render() {

        
        return(
            <Table>
                <Table responsive striped bordered hover bg="light">
                <thead>
                        <th>Payments</th>
                        <th>Value</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Gross Employee Pay</td>
                            <td>{`$${((this.props.salary) * (this.props.interval / 365)).toFixed(2)}`}</td>
                        </tr>
                        <tr>
                            <td>Total Employer Cost</td>
                            <td>{this.props.payments.total_employer_cost}</td>
                        </tr>
                        <tr>
                            <td>FUTA</td>
                            <td>{this.props.payments.employer_futa_withheld}</td>
                        </tr>
                        <tr>
                            <td>State Unemployment</td>
                            <td>{this.props.payments.employer_state_u_withheld}</td>
                        </tr>
                        <tr>
                            <td>Social Security Taxes</td>
                            <td>{this.props.payments.employer_ss_withheld}</td>
                        </tr>
                        <tr>
                            <td>Medicare Taxes</td>
                            <td>{this.props.payments[0].employer_medicare_withheld}</td>
                        </tr>
                        
                    </tbody>
                </Table>
            </Table>
        )
    }
}

export default EmployeePayments;