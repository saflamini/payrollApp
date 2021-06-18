import React, {Component} from 'react';

class CompanyForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyName: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(evt) {
        this.setState({
            [evt.target.name]: evt.target.value
        })
    } 

    handleSubmit(evt) {
        evt.preventDefault();
        this.props.createCompany(this.state.companyName);
        this.setState({companyName: ""});
    }

    render() {
        return (
            <div>
                <h3>Create Company</h3>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="companyName">Company Name: </label>
                    <input name="companyName" type="text" value={this.state.companyName} onChange={this.handleChange}></input>
                    <button>Create Company</button>
                </form>
            </div>
        )
    }
}

export default CompanyForm;