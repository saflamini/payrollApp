import React, {Component} from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import "./Navigation.css"

class Navigation extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Container>
                <Navbar>
                    <Container>
                        <Navbar.Brand className="nav" href="#home">Tx Payroll</Navbar.Brand>
                        <Nav className="navbar-light">
                            <Nav.Link  href="/home" variant="tabs">Home</Nav.Link>
                            <Nav.Link className="nav-item" href="/fund">Fund</Nav.Link>
                            <Nav.Link className="nav-item" href="/manage-roster">Manage Roster</Nav.Link>
                            <Nav.Link className="nav-item" href="/payments">Payments</Nav.Link>
                            <Nav.Link className="nav-item" href="/analytics">Analytics</Nav.Link>
                        </Nav>
                    </Container>
                </Navbar>

            </Container>
        )
    }
}

export default Navigation;