import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';



class EditModal extends Component {
constructor(props) {
    super(props);
    this.state = {
        salary: "",
        interval: "",
        salaryEditing: false,
        intervalEditing: false
    }
    this.handleChange = this.handleChange.bind(this);
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


if (this.state.salaryEditing) {
    let salaryDisplay;
    salaryDisplay = (

        <Container>
            <Modal show={this.props.show}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit Employee Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                
                    <div>
                        <form onSubmit={this.handleSalaryUpdate}>
                            <label htmlFor="salary">Salary </label>
                            <input type="text" name="salary" value={this.state.salary} onChange={this.handleChange}></input> 
                            <button>✅</button>
                        </form>
                    </div>
                <Form>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="salaryEdit">Edit Salary </Form.Label>
                    <Form.Control type="text" name="salaryEdit" value={this.state.salaryEdit} onChange={this.handleChange}></Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
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
      </Container>
    )
    return salaryDisplay;
}

if (this.state.intervalEditing) {
    let intervalDisplay;
    intervalDisplay = (

        <Container>
            <Modal show={this.props.show}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit Employee Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                
                    <div>
                        <form onSubmit={this.handleIntervalUpdate}>
                            <label htmlFor="interval">Interval </label>
                            <input type="text" name="interval" value={this.state.interval} onChange={this.handleChange}></input> 
                            <button>✅</button>
                        </form>
                    </div>
                <Form>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="salaryEdit">Edit Salary </Form.Label>
                    <Form.Control type="text" name="salaryEdit" value={this.state.salaryEdit} onChange={this.handleChange}></Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
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
      </Container>
    )
    return intervalDisplay;
}
else {
    return (
    <Container>
         <Modal show={this.props.show}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit Employee Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
        <p>
            <strong>Address</strong>: {employeeObject.address} <button onClick={this.salaryEdit}>🖊</button> 
        </p>
        <p>
            <strong>Salary</strong>: {employeeObject.salary} <button onClick={this.salaryEdit}>🖊</button>
        </p>
        <p>
            <strong>Payment Interval</strong>: {employeeObject.interval} <button onClick={this.intervalEdit}>🖊</button>
        </p>         
        <button onClick={this.handleDeleteEmployee}>Delete</button>
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