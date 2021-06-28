import React, {Component} from "react";

class Fund extends Component {
    constructor(props) {
        super(props);
        this.state = {
            funding: ""
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
        console.log('working')
        this.props.funding(this.state.funding);
        this.setState({funding: ""})
    }

    render() {
        return (
            <div>

            <form onSubmit={this.handleSubmit}>
                <label htmlFor="funding">Add Funds: </label>
                <input type="text" name="funding" placeholder="Add funds..." onChange={this.handleChange} value={this.state.funding}></input>
                <button>Submit</button>
            </form>
            </div>

        )
    }
}

export default Fund;