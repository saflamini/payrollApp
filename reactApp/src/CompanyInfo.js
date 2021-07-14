import React, {Component} from "react";
// import { CompanyRegistry } from './config';
import CompanyForm from "./CompanyForm";
import "./CompanyInfo.css"

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
   
    async createCompany(name) {
        this.props.createCompany(name);
        // await CompanyRegistry.methods.createCompany(name).send({from: this.props.account, gas: 6721975})
        // .then(console.log)
    }

    //this is likely not needed
   async getCompany() {
       this.props.getCompany();
        // let co = await CompanyRegistry.methods.getCompanyAddress(this.props.account).call({from: this.props.account});
        //state is not handled here, going to comment out
        // this.setState({
        //     company: co
        // })       
    }

    render() {

        return (
            <div>
                {this.props.company === "Please create a new company or connect a wallet"?
                <CompanyForm 
                createCompany={this.createCompany} 
                />:<h1 className="companyName" >{this.props.company}</h1>
                }
                {/* <h3>Company Address: {this.props.account}</h3> */}
                {/* <button onClick={this.getCompany}>Get Company</button> */}
            </div>
        )
    }
}

export default CompanyInfo;