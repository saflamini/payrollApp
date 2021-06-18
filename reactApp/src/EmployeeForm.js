import React, {Component} from 'react';

class EmployeeForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            salary: '',
            interval: ''
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
        this.props.addEmployee(this.state);
        this.setState({name: '', address: '', salary: '', interval: ''})
    }

    render() {
        return (

        <div>
            <form onSubmit={this.handleSubmit}>
                <p>
                    <label htmlFor="name">Name </label>
                    <input type="text" name="name" value={this.state.name} onChange={this.handleChange}></input>
                </p>
                <p>
                    <label htmlFor="address">Ethereum Address </label>
                    <input type="text" name="address" value={this.state.address} onChange={this.handleChange}></input>
                </p>
                <p>
                    <label htmlFor="salary">Salary </label>
                    <input type="text" name="salary" value={this.state.salary} onChange={this.handleChange}></input>
                </p>
                <p>
                    <label htmlFor="interval">Interval </label>
                    <input type="text" name="interval" value={this.state.interval} onChange={this.handleChange}></input>
                </p>
                <button>Create Employee</button>
            </form>
        </div>
    )}
}

export default EmployeeForm;