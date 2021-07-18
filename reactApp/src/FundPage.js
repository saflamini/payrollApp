import React, {Component} from "react";
import Fund from "./Fund";
import Withdraw from "./Withdraw";
import Balance from "./Balance";
import Container from "react-bootstrap/Container";
import Navigation from "./Navigation";
import ConnectWallet from "./ConnectWallet";

class FundPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container>
                <Navigation />
                <ConnectWallet />
                <Balance />
             
            </Container>

        )
    }
}

export default FundPage;