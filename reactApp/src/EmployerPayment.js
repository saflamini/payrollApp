import React, {Component} from "react";

class EmployerPayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
                fullName: this.props.fullName,
                employee_id: this.props.employee_id,
                lastPaid: this.props.lastPaid,
                gross_pay: this.props.gross_pay,
                federal_tax_withheld: this.props.federal_tax_withheld,
                state_tax_withheld: this.props.state_tax_withheld,
                medicare_tax_withheld: this.props.medicare_tax_withheld,
                net_pay: this.props.net_pay,
                employer_ss_withheld: this.props.employer_ss_withheld,
                ss_tax_withheld: this.props.ss_tax_withheld,
                employer_medicare_withheld: this.props.employer_medicare_withheld,
                employer_futa_withheld: this.props.employer_futa_withheld,
                employer_state_u_withheld: this.props.employer_state_u_withheld,
                total_employer_cost: this.props.total_employer_cost
            }
        }
    

    
    render() {
        console.log((new Date(Number(this.props.payment_date)).toLocaleDateString()))
        return (
            <tr>
                <td>{this.props.fullName}</td>
                <td>{this.state.employee_id}</td>
                <td>{(new Date(Number(this.props.payment_date))).toLocaleDateString()}</td>
                <td>{this.state.gross_pay}</td>
                <td>{this.state.federal_tax_withheld}</td>
                <td>{this.state.state_tax_withheld}</td>
                <td>{this.state.net_pay}</td>
                <td>{this.state.employer_ss_withheld}</td>
                <td>{this.state.employer_medicare_withheld}</td>
                <td>{this.state.employer_futa_withheld}</td>
                <td>{this.state.employer_state_u_withheld}</td>
                <td>{this.state.total_employer_cost}</td>
            </tr>
        )
    }
}

export default EmployerPayment;