import React, {Component} from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";

class Navigation extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Container>
                <Navbar>
                    <Container>
                        <Navbar.Brand href="#home">OpenPay</Navbar.Brand>
                        <Nav className="me-auto">
                            <Nav.Link href="/home">Home</Nav.Link>
                            <Nav.Link href="/fund">Fund</Nav.Link>
                            <Nav.Link href="/manage-roster">Manage Roster</Nav.Link>
                            <Nav.Link href="/hr-compliance">HR and Compliance</Nav.Link>
                            <Nav.Link href="/analytics">Analytics</Nav.Link>
                        </Nav>
                    </Container>
                </Navbar>

            </Container>
        )
    }
}

export default Navigation;