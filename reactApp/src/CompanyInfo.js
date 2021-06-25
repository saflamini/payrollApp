import React, {Component} from "react";
import { web3 } from './config';
import { payrollAddress } from './config'; 
import { payrollContract } from './config';
import CompanyForm from "./CompanyForm";

//create company info component

class CompanyInfo extends Component {
    constructor(props) {
        super(props);
        // this.state = {company: this.props.company}
        this.createCompany = this.createCompany.bind(this);
        this.getCompany = this.getCompany.bind(this);
    }

    // componentDidMount() {
    //     // let co = await payrollContract.methods.getCompany(this.props.account).call({from: this.props.account});
    //     // console.log(co)
    //     // this.setState({
    //     //     company: co
    //     // })      
    // }
   
    createCompany(name) {
        payrollContract.methods.createCompany(name).send({from: this.props.account, gas: 6721975})
        .then(console.log)
    }

   async getCompany() {
        let co = await payrollContract.methods.getCompany(this.props.account).call({from: this.props.account});
        this.setState({
            company: co
        })       
    }

    render() {

        return (
            <div>
                {this.props.company === "Please create a new company or connect a wallet"?
                <CompanyForm 
                createCompany={this.createCompany}
                />:<h1>{this.props.company}</h1>
                }
                {/* <h3>Company Address: {this.props.account}</h3> */}
                {/* <button onClick={this.getCompany}>Get Company</button> */}
            </div>
        )
    }
}

export default CompanyInfo;