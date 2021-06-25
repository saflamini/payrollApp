import React, {Component} from 'react';

class Employee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameEditing: false,
            salaryEditing: false,
            intervalEditing: false,
            name: '',
            salary: '',
            interval: ''
        }

        this.nameEdit = this.nameEdit.bind(this);
        this.salaryEdit = this.salaryEdit.bind(this);
        this.intervalEdit = this.intervalEdit.bind(this);
        this.handleNameUpdate = this.handleNameUpdate.bind(this);
        this.handleSalaryUpdate = this.handleSalaryUpdate.bind(this);
        this.handleIntervalUpdate = this.handleIntervalUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    nameEdit() {
        this.setState({nameEditing: !this.state.nameEditing})
    }

    salaryEdit() {
        this.setState({salaryEditing: !this.state.salaryEditing})
    }

    intervalEdit() {
        this.setState({intervalEditing: !this.state.intervalEditing})
    }

    //define and bind these 3 methods that edit employee info 
   
    handleNameUpdate(evt) {
        evt.preventDefault();
        this.props.updateName(this.props.id, this.state.name)
        this.setState({nameEditing: false})
    }

    handleSalaryUpdate(evt) {
        evt.preventDefault();
        this.props.updateSalary(this.props.id, this.state.salary);
        this.setState({salaryEditing: false})
    }

    handleIntervalUpdate(evt) {
        evt.preventDefault();
        this.props.updateInterval(this.props.id, this.state.interval);
        this.setState({intervalEditing: false})
    }

    handleChange(evt) {
        this.setState({
            [evt.target.name]: evt.target.value
        })
    }

    render() {
        const employeeObject = {
            // name: this.props.name,
            address: this.props.address,
            salary: this.props.salary,
            interval: this.props.interval
        }


        if (this.state.nameEditing) {
            let nameDisplay;
            nameDisplay = (
                <div>
                    <form onSubmit={this.handleNameUpdate}>
                        <label htmlFor="name">Name </label>
                        <input type="text" name="name" value={this.state.name} onChange={this.handleChange}></input> 
                        <button >✅</button>
                    </form>
                </div>
            )
            return nameDisplay
        }

        if (this.state.salaryEditing) {
            let salaryDisplay;
            salaryDisplay = (
                <div>
                    <form onSubmit={this.handleSalaryUpdate}>
                        <label htmlFor="salary">Salary </label>
                        <input type="text" name="salary" value={this.state.salary} onChange={this.handleChange}></input> 
                        <button>✅</button>
                    </form>
                </div>
            )
            return salaryDisplay;
        }

        if (this.state.intervalEditing) {
            let intervalDisplay;
            intervalDisplay = (
                <div>
                    <form onSubmit={this.handleIntervalUpdate}>
                        <label htmlFor="interval">Interval </label>
                        <input type="text" name="interval" value={this.state.interval} onChange={this.handleChange}></input> 
                        <button>✅</button>
                    </form>
                </div>
            )
            return intervalDisplay;
        }

        else {
            let result;
            result = (
            <div>
                {/* <p>
                    {employeeObject.name} <button onClick={this.nameEdit}>🖊</button>
                </p> */}
                 <p>
                <strong>Address</strong>: {employeeObject.address} <button onClick={this.salaryEdit}>🖊</button>
                </p>
                <p>
                <strong>Salary</strong>: {employeeObject.salary} <button onClick={this.salaryEdit}>🖊</button>
                </p>
                <p>
                <strong>Payment Interval</strong>: {employeeObject.interval} <button onClick={this.intervalEdit}>🖊</button>
                </p>           
                <button onClick={this.props.removeEmployee}>Delete</button>
                </div>
            )
            return result;
        }
       
    }
}

export default Employee;