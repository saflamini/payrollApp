import React, {Component} from "react";
import Container from 'react-bootstrap/Container';
import EmployeeProfileInfo from "./EmployeeProfileInfo";
import EmployeePayments from "./EmployeePayments";


class EmployeeProfile extends Component {
    constructor(props) {
    
        super(props);
        this.state = {
            first_name: "",
            last_name: "",
            address: this.props.match.params.address,
            employee_id: "",
            company_id: "",
            interval: "",
            salary: "",
            currency: "USDC",
            state: "",
            allowances: "",
            filingstatus: "Single"
        }

        this.getEmployeeInfo = this.getEmployeeInfo.bind(this);

        this.getEmployeeInfo()
        console.log(this.state.address);
    }

    //generated infinite loop. Need to fix
    // componentDidMount() {
    //     this.displayName()
    // }

    
    async getEmployeeInfo() {
        // let address = this.props.match.params.address;
        let i = await this.props.getAdditionalEmployeeInfo(this.state.address);
        let first_name = i.first_name;
        let last_name = i.last_name;
        let employee_id = i.employee_id;
        let company_id = i.company_id;
        let interval = i.interval;
        let salary = i.salary;
        let state = i.state;
        let allowances = i.allowances;
        let filingstatus= i.filingstatus;

        this.setState({
            first_name: first_name,
            last_name: last_name,
            employee_id: employee_id,
            company_id: company_id,
            interval: interval,
            salary: salary,
            state: state,
            allowances: allowances,
            filingstatus: filingstatus
        });
        // return (
        //     <EmployeeProfileInfo />
        // )
    }

    render() {

        // console.log(this.props.match.params.address);
        
        // console.log(address);
        // let i = this.props.getAdditionalEmployeeInfo(address);

        return (
            <Container>
    
            <h1>Employee Profile</h1>
                
                <EmployeeProfileInfo 
                first_name={this.state.first_name}
                last_name={this.state.last_name}
                address={this.state.address}
                salary={this.state.salary}
                interval={this.state.interval}
                allowances={this.state.allowances}
                state={this.state.state}
                company_id={this.state.company_id}
                employee_id={this.state.employee_id}
                filingstatus={this.state.filingstatus}
                />

                {/* <EmployeePayments 
                payments={this.props.payments}
                employee_id={this.state.employee_id}
                salary={this.state.salary}
                interval={this.state.interval}
                /> */}

            

              
                
            </Container>
        )
    }
}

export default EmployeeProfile;