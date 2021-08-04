import './App.css';
// import {Route, Switch, Link} from "react-router-dom";
import {BrowserRouter} from "react-router-dom";
import Web3Setup from './Web3Setup';
// import FundPage from './FundPage';
// import ConnectWallet from './ConnectWallet'


function App() {
  return (
    <div className="App">
     
        <BrowserRouter>
          <Web3Setup />
        </BrowserRouter>
      
    </div>
  );
}

export default App;
