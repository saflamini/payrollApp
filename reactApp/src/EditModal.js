import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';



class EditModal extends Component {
constructor(props) {
    super(props);
    this.state = {
        employeeObject: {
            address: this.props.address,
            salary: this.props.salary,
            interval: this.props.interval
        },
        salary: "",
        interval: "",
        salaryEditing: false,
        intervalEditing: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSalaryUpdate = this.handleSalaryUpdate.bind(this);
    this.handleIntervalUpdate = this.handleIntervalUpdate.bind(this);
    this.handleDeleteEmployee = this.handleDeleteEmployee.bind(this);
    this.salaryEdit = this.salaryEdit.bind(this);
    this.intervalEdit = this.intervalEdit.bind(this);
    this.updateEmployeeObject = this.updateEmployeeObject.bind(this);
    this.updateSal = this.updateSal.bind(this);
    this.updateInt = this.updateInt.bind(this);
    this.sendUpdate = this.sendUpdate.bind(this);
}

handleChange(evt) {
    this.setState({
        [evt.target.name]: evt.target.value
    })
}

handleSalaryUpdate(evt) {
    evt.preventDefault();
    this.props.updateSalary(this.props.address, this.props.companyId, this.state.salary);
    this.setState({salaryEditing: false})
}

handleIntervalUpdate(evt) {
    evt.preventDefault();
    this.props.updateInterval(this.props.address, this.props.companyId, this.state.interval);
    this.setState({intervalEditing: false})
}

handleDeleteEmployee(evt) {
    evt.preventDefault();
    this.props.removeEmployee(this.props.address);
}

salaryEdit() {
    this.setState({salaryEditing: !this.state.salaryEditing})
}

intervalEdit() {
    this.setState({intervalEditing: !this.state.intervalEditing})
}

salaryEdited() {
    this.state.employeeObject.salary = this.state.salary;
    this.setState({salaryEditing: !this.state.salaryEditing})

}

intervalEdited() {
    this.state.employeeObject.interval = this.state.interval;
    this.setState({intervalEditing: !this.state.intervalEditing})

}

updateEmployeeObject() {
    this.setState({
        address: this.props.address,
        salary: this.props.salary,
        interval: this.props.interval
    })
}

sendUpdate() {
    this.props.handleModalUpdate(this.state.employeeObject);
}

updateSal() {
    this.setState({
        employeeObject: {
            address: this.props.address,
            salary: this.state.salary,
            interval: this.props.interval
        },
        salaryEditing: false
    })
}

updateInt() {
    this.setState({
        employeeObject: {
            address: this.props.address,
            salary: this.props.salary,
            interval: this.state.interval
        },
        intervalEditing: false
    })
}


render() {




if (this.state.salaryEditing) {
    let salaryDisplay;
    salaryDisplay = (

        <Container>
            <Modal show={true}>
                <Modal.Header closeButton onClick={this.props.closeEditModal}>
                  <Modal.Title>Edit Employee Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                
                    {/* <div>
                        <form onSubmit={this.handleSalaryUpdate}>
                            <label htmlFor="salary">Salary </label>
                            <input type="text" name="salary" value={this.state.salary} onChange={this.handleChange}></input> 
                            <button>✅</button>
                        </form>
                    </div> */}
                <Form >
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="salaryEdit">Edit Salary </Form.Label>
                    <Form.Control type="text" name="salary" value={this.state.salary} onChange={this.handleChange}></Form.Control>
                </Form.Group>
                <Button variant="success" onClick={this.updateSal}>Done</Button>
                {/* <Form.Group className="mb-3">
                    <Form.Label htmlFor="intervalEdit">Edit Interval </Form.Label>
                    <Form.Control type="text" name="intervalEdit" value={this.state.intervalEdit} onChange={this.handleChange}></Form.Control>
                </Form.Group> */}
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.closeEditModal}>
            Close
          </Button>
          {/* <Button variant="primary">
            Save Changes
          </Button> */}
        </Modal.Footer>
      </Modal>
      </Container>
    )
    return salaryDisplay;
}

if (this.state.intervalEditing) {
    let intervalDisplay;
    intervalDisplay = (

        <Container>
            <Modal show={true}>
                <Modal.Header closeButton onClick={this.props.closeEditModal}>
                  <Modal.Title>Edit Employee Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                
                    {/* <div>
                        <form onSubmit={this.handleIntervalUpdate}>
                            <label htmlFor="interval">Interval </label>
                            <input type="text" name="interval" value={this.state.interval} onChange={this.handleChange}></input> 
                            <button>✅</button>
                        </form>
                    </div> */}
                <Form >
                {/* <Form.Group className="mb-3">
                    <Form.Label htmlFor="salaryEdit">Edit Salary </Form.Label>
                    <Form.Control type="text" name="salaryEdit" value={this.state.salaryEdit} onChange={this.handleChange}></Form.Control>
                </Form.Group> */}

                <Form.Group className="mb-3">
                    <Form.Label htmlFor="intervalEdit">Edit Interval </Form.Label>
                    <Form.Control type="text" name="interval" value={this.state.interval} onChange={this.handleChange}></Form.Control>
                </Form.Group>
                <Button variant="success" onClick={this.updateInt}>Done</Button>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.closeEditModal}>
            Close
          </Button>
          {/* <Button variant="primary">
            Save Changes
          </Button> */}
        </Modal.Footer>
      </Modal>
      </Container>
    )
    return intervalDisplay;
}
else {
    return (
    <Container>
         <Modal show={true}>
                <Modal.Header closeButton onClick={this.props.closeEditModal}>
                  <Modal.Title>Edit Employee Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
        <p>
            <strong>Address</strong>: {this.state.employeeObject.address}
        </p>
        <p>
            <strong>Salary</strong>: {this.state.employeeObject.salary} <Button size="sm" variant="secondary" onClick={this.salaryEdit}>Edit</Button>
        </p>
        <p>
            <strong>Payment Interval</strong>: {this.state.employeeObject.interval} <Button size="sm" variant="secondary" onClick={this.intervalEdit}>Edit</Button>
        </p>         
        <Button size="sm" variant="danger" onClick={this.handleDeleteEmployee}>Delete</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.closeEditModal}>
            Close
          </Button>
          <Button onClick={this.sendUpdate} variant="success">
            Save Changes
          </Button>
        </Modal.Footer>
        </Modal>
        </Container>
    )
}




    // <Container>
    // <Modal show={this.props.show}>
    //     <Modal.Header closeButton>
    //       <Modal.Title>Edit Employee Info</Modal.Title>
    //     </Modal.Header>
    //     <Modal.Body>{
    //     <div>
    //     if (this.state.salaryEditing) {
    //         let salaryDisplay;
    //         salaryDisplay = (
    //             <div>
    //                 <form onSubmit={this.handleSalaryUpdate}>
    //                     <label htmlFor="salary">Salary </label>
    //                     <input type="text" name="salary" value={this.state.salary} onChange={this.handleChange}></input> 
    //                     <button>✅</button>
    //                 </form>
    //             </div>
    //         )
    //         return salaryDisplay;
    //     }

        {/* if (this.state.intervalEditing) {
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
        <div>}
            <p>
            <strong>Address</strong>: {employeeObject.address} <button onClick={this.salaryEdit}>🖊</button> */}
            {/* </p>
            <p>
            <strong>Salary</strong>: {employeeObject.salary} <button onClick={this.salaryEdit}>🖊</button>
            </p>
            <p>
            <strong>Payment Interval</strong>: {employeeObject.interval} <button onClick={this.intervalEdit}>🖊</button>
            </p>         
            <button onClick={this.handleDeleteEmployee}>Delete</button>
           <Form>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="salaryEdit">Edit Salary </Form.Label>
                    <Form.Control type="text" name="salaryEdit" value={this.state.salaryEdit} onChange={this.handleChange}></Form.Control>
                </Form.Group> */}

                {/* <Form.Group className="mb-3">
                    <Form.Label htmlFor="intervalEdit">Edit Interval </Form.Label>
                    <Form.Control type="text" name="intervalEdit" value={this.state.intervalEdit} onChange={this.handleChange}></Form.Control>
                </Form.Group>
           </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={console.log('closed button click')}>
            Close
          </Button>
          <Button variant="primary">
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      </Container> */}



}}

export default EditModal;