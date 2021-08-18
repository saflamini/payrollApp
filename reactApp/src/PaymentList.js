import React, {Component} from "react";
import Table from "react-bootstrap/Table";
import EmployerPayment from "./EmployerPayment";
import "./PaymentList.css";

class PaymentList extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.renderPayments = this.renderPayments.bind(this);
        // this.getEmployeePaymentInfo = this.getEmployeePaymentInfo.bind(this);
        // this.getEmployerPaymentInfo = this.getEmployerPaymentInfo.bind(this);
        // this.getPayments = this.getPayments.bind(this);


        
    }

    componentDidMount() {
        // this.getPayments()
        // this.renderPayments();
        // console.log('hi boi')
    }

    async componentDidUpdate() {
        // await this.getPayments()
        // componentWillUnmount() {
        //     this.getPayments();
        // }
    }

   


    // async getEmployerPaymentInfo() {
    //     try {
    //         const response = await fetch(`http://localhost:5000/employer-payments/${this.props.companyId}`);
    //         const jsonData = await response.json();
    
    //         // console.log(jsonData);
    //         return jsonData;
    
    //       } catch (err) {
    //           console.error(err.message)
    //       }
    // }

    // async getEmployeePaymentInfo(employeeId) {
    //     try {
    //         const response = await fetch(`http://localhost:5000/employee-payments/${employeeId}`);
    //         const jsonData = await response.json();
    
    //         // console.log(jsonData);
    //         return jsonData;
    
    //       } catch (err) {
    //           console.error(err.message)
    //       }
    // }

    // async getPayments() {
    //     let employerPaymentData = [];
    
    //     employerPaymentData = await this.getEmployerPaymentInfo();

    //     let employeePayments = [];

    //     for (let i = 0; i < this.props.roster.length; i++) {
    //         let e = {
    //             fullName: "",
    //             employee_id: null,
    //             lastPaid: "",
    //             gross_pay: 0,
    //             federal_tax_withheld: 0,
    //             state_tax_withheld: 0,
    //             medicare_tax_withheld: 0,
    //             net_pay: 0,
    //             employer_ss_withheld: 0,
    //             ss_tax_withheld: 0,
    //             employer_medicare_withheld: 0,
    //             employer_futa_withheld: 0,
    //             employer_state_u_withheld: 0,
    //             total_employer_cost: 0
    //         };

    //         for (let i = 0; i < employerPaymentData.length; i++) {
    //             if (employerPaymentData[i].employee_id == this.props.roster[i].id) {
    //                 e.employer_ss_withheld = employerPaymentData[i].employer_ss_withheld;
    //                 e.employer_medicare_withheld = employerPaymentData[i].employer_medicare_withheld;
    //                 e.employer_futa_withheld = employerPaymentData[i].employer_futa_withheld;
    //                 e.employer_state_u_withheld = employerPaymentData[i].employer_state_u_withheld;
    //                 e.total_employer_cost = employerPaymentData[i].total_employer_cost;
    //                 break;
    //             }
    //         }

    //         let employeePayment = await this.getEmployeePaymentInfo(this.props.roster[i].id);
    //         // console.log(employeePayment)

    //         e.fullName = `${this.props.roster[i].first_name} ${this.props.roster[i].last_name}`;
    //         e.employee_id = this.props.roster[i].id;
    //         e.lastPaid = this.props.roster[i].lastDayPaid;
    //         e.gross_pay = employeePayment[i].gross_pay;
    //         e.federal_tax_withheld = employeePayment[i].federal_tax_withheld;
    //         e.state_tax_withheld = employeePayment[i].state_tax_withheld;
    //         e.ss_tax_withheld = employeePayment[i].ss_tax_withheld;
    //         e.medicare_tax_withheld = employeePayment[i].medicare_tax_withheld;
    //         e.net_pay = employeePayment[i].net_pay;

    //         employeePayments.push(e)
    //     }      

    //     if (employeePayments.length > 0) {
    //         this.setState({
    //             paymentList: employeePayments
    //         })
            
    //     }
       
    // }

    renderPayments() {
        console.log(this.props)
        console.log(this.props.paymentList[0])
        

        console.log(this.props.paymentList)
        if (this.props.paymentList.length > 0) {

        return (
                this.props.paymentList.map(payment => (
                   
                <tbody key={payment.payment_date}>{
                   <EmployerPayment 
                    fullName={
                        `${payment.first_name} ${payment.last_name}`
                    }
                    employee_id={payment.employee_id}
                    payment_date={payment.payment_date}
                    gross_pay={payment.gross_pay}
                    federal_tax_withheld={payment.federal_tax_withheld}
                    state_tax_withheld={payment.state_tax_withheld}
                    net_pay={payment.net_pay}
                    employer_ss_withheld={payment.employer_ss_withheld}
                    employer_medicare_withheld={payment.employer_medicare_withheld}
                    employer_futa_withheld={payment.employer_futa_withheld}
                    employer_state_u_withheld={payment.employer_state_u_withheld}
                    total_employer_cost={payment.total_employer_cost}
                    />}
                </tbody>
                ))
            )
        }
        
    }

           
                    
            
                


            



        //     async function getEmployeeInfo() {
        //         this.getEmployeePaymentInfo = this.getEmployeePaymentInfo.bind(this);
        //         let employeePaymentInfo = await this.getEmployeePaymentInfo(employee.id);
        //         return employeePaymentInfo;
        //     }

        //     async function getEmployerInfo() {
        //         console.log('hi')
        //         let employerPaymentInfo = await this.getEmployerPaymentInfo();
        //         return employerPaymentInfo;
        //     }

        // let employeePayments = getEmployeeInfo();
        // let employerPayments = getEmployerInfo();
        // console.log(employeePayments)


            // console.log(`${employee.first_name} ${employee.last_name}`)
            // console.log(employee.id)
            // console.log(employeePaymentInfo.payment_date)
            // console.log(employeePaymentInfo.gross_pay)
            // console.log(employeePaymentInfo.federal_tax_withheld)
            // console.log(employeePaymentInfo.state_tax_withheld)
            // console.log(employeePaymentInfo.net_pay)
            // console.log(employerPaymentInfo.ss_tax_withheld + employerPaymentInfo.employer_ss_withheld)
            // console.log(employerPaymentInfo.medicare_tax_withheld + employerPaymentInfo.employer_medicare_withheld)
            // console.log(employerPaymentInfo.employer_futa_withheld)
            // console.log(employerPaymentInfo.employer_state_u_withheld)

            
    //         return (
                
    //             <tr>
    //                 <td>{`${this.props.roster[i].first_name} ${this.props.roster[i].last_name}`}</td>
    //                 <td>{this.props.roster[i].id}</td>
    //                 <td>{employeePaymentInfo[i].payment_date}</td>
    //                 <td>{employeePaymentInfo[i].gross_pay}</td>
    //                 <td>{employeePaymentInfo[i].federal_tax_withheld}</td>
    //                 <td>{employeePaymentInfo[i].state_tax_withheld}</td>
    //                 <td>{employeePaymentInfo[i].net_pay}</td>
    //                 <td>{employeePaymentInfo[i].ss_tax_withheld + employerPaymentInfo[i].employer_ss_withheld}</td>
    //                 <td>{employeePaymentInfo[i].medicare_tax_withheld + employerPaymentInfo[i].employer_medicare_withheld}</td>
    //                 <td>{employerPaymentInfo[i].employer_futa_withheld}</td>
    //                 <td>{employerPaymentInfo[i].employer_state_u_withheld}</td>
    //             </tr>
    //         )
    //     }
    // }


    render() {
        // this.getPayments();

        return(
            <div>
                <Table className="payments"responsive bordered hover size="sm">
                        <thead>
                            <tr>
                            <th>Name</th>
                            {/* <th>Employee ID</th> */}
                            <th>Payment Date</th>
                            <th>Gross Pay</th>
                            <th>Federal Tax</th>
                            <th>State Tax</th>
                            <th>Net Pay</th>
                            <th>SS</th>
                            <th>Medicare</th>
                            <th>FUTA</th>
                            <th>State U</th>
                            <th>Total Cost</th>
                            </tr>
                        </thead>
                        {this.renderPayments()} 
                    </Table> 
            </div>
        )
    }
}

export default PaymentList;