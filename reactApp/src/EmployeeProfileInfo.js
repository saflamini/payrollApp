import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import "./EmployeeProfileInfo.css";

class EmployeeProfileInfo extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div>
                <Row>
                    <Col>
                    <Table responsive striped bordered hover bg="light">
                    <thead>
                        <th>General Info</th>
                        <th>Value</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>First Name</td>
                            <td>{this.props.first_name}</td>
                        </tr>
                        <tr>
                            <td>Last Name</td>
                            <td>{this.props.last_name}</td>
                        </tr>
                        <tr>
                            <td>Employee ID</td>
                            <td>{this.props.employee_id}</td>
                        </tr>
                        <tr>
                            <td>Company ID</td>
                            <td>{this.props.company_id}</td>
                        </tr>
                        <tr>
                            <td>Salary</td>
                            <td>${this.props.salary}/year</td>
                        </tr>
                        <tr>
                            <td>Payment Interval</td>
                            <td>Every {this.props.interval / 7} weeks</td>
                        </tr>
                        </tbody>
                        {/* <tr>
                            <td></td>
                            <td>{this.props.first_name}</td>
                        </tr>
                    </tbody>
                    <h4>First Name: {this.props.first_name}</h4>
                    <h4>Last Name: {this.props.last_name}</h4>
                    <h4>Employee ID: {this.props.employee_id}</h4>
                    <h4>Company ID: {this.props.company_id}</h4>
                    <h4>Salary: ${this.props.salary}/year</h4>
                    <h4>Payment Interval: Every {this.props.interval / 7} weeks</h4>
                    <h4>Filing Status: {this.props.filingstatus}</h4>
                    <h4>Number of Allowances: {this.props.allowances}</h4>
                    <h4>State of Residency: {this.props.state}</h4> */}
                </Table>
                </Col>

                <Col>
                <Row>
                <Table responsive striped bordered hover bg="light">
                <thead>
                        <th>HR Info</th>
                        <th>Value</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Filing Status</td>
                            <td>{this.props.filingstatus}</td>
                        </tr>
                        <tr>
                            <td>Number of Allowances</td>
                            <td>{this.props.allowances}</td>
                        </tr>
                        <tr>
                            <td>State of Residency</td>
                            <td>{this.props.state}</td>
                        </tr>
                        <tr>
                            <td>Social Security #</td>
                            <td>123-456-7890</td>
                        </tr>
                    </tbody>
                </Table>
                </Row>
                <Row>
                    <Button className="pay" variant="primary" size="sm">Pay</Button>
                    <Button onClick={this.props.editingEmployee} className="edit" variant="primary" size="sm">Edit</Button>
                </Row>
                </Col>
                </Row>
                
                <Card>
                <Table responsive striped bordered hover bg="light">
                <thead>
                        <th>Payment Info</th>
                        <th>Value</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Filing Status</td>
                            <td>{this.props.filingstatus}</td>
                        </tr>
                        <tr>
                            <td>Next Payment</td>
                            <td>${this.props.salary * ((this.props.interval / 365).toFixed(2))}</td>
                        </tr>
                        <tr>
                            <td>Next Payment Date</td>
                            <td>01/22/2022</td>
                        </tr>
                    </tbody>
                    </Table>
                        <Button className="one-off" variant="primary" size="sm">Send One Off Payment</Button>
                    </Card>
                
            </div>
        )
    }
}

export default EmployeeProfileInfo;