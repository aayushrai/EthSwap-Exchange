import React, { Component } from "react";
import "./App.css";
import EthSwap from "../abis/EthSwap.json";
import Token from "../abis/Token.json";
import BuyForm from "./BuyForm";
import Web3 from "web3";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      balance: "",
      token: {},
      ethSwap: {},
      tokenBalance: 0,
      loading: true,
      rate: 100,
      ethSwapSigner: {},
    };
    this.enableEtherium();
  }

  enableEtherium = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
    } else {
      alert("No web3 browser found || no ethereum wallet");
    }
  };
  render() {
    const connectWallet = async () => { 
      if (window.web3) {
        window.web3.eth.getAccounts((error, accounts) =>
          getEthUserAccount(accounts[0])
        );
      }
    };

    // load token contract
    const getTokenContract = async () => {
      const networkID = await window.web3.eth.net.getId();
      const tokenAbi = Token.abi;
      const tokenData = Token.networks[networkID];
      if (tokenData) {
        let tokenContractAddress = tokenData.address;
        let tokenContract = new window.web3.eth.Contract(
          tokenAbi,
          tokenContractAddress
        );
        this.setState({ token: tokenContract });
      } else {
        alert(
          "Please Switch to correct network, this token does not deployed on this network"
        );
      }
    };

    // load ethswap contract
    const getEthSwapContract = async () => {
      const networkID = await window.web3.eth.net.getId();
      const ethSwapAbi = EthSwap.abi;
      const ethSwapData = EthSwap.networks[networkID];
      if (ethSwapData) {
        let ethSwapContractAddress = ethSwapData.address;
        let ethSwapContract = new window.web3.eth.Contract(
          ethSwapAbi,
          ethSwapContractAddress
        );
        this.setState({
          ethSwap: ethSwapContract,
        });
      } else {
        alert(
          "Please Switch to correct network, this EthSwap does not deployed on this network"
        );
      }
    };

    const getEthUserAccount = async (newAccount) => {
      this.setState({ account: newAccount });
      await getEthUserBalance(newAccount.toString());
      await getTokenContract();
      await getEthSwapContract();
      await getUserTokenBalance();
      this.setState({ loading: false });
    };

    const getEthUserBalance = (address) => {
      window.web3.eth.getBalance(address).then((balance) => {
        balance = window.web3.utils.fromWei(balance);
        this.setState({ balance });
      });
    };

    const getUserTokenBalance = async () => {
      this.state.token.methods
          .balanceOf(this.state.account)
          .call({ from: this.state.account }, (error, result) => {
            this.setState({
              tokenBalance: window.web3.utils.fromWei(result.toString()),
            });
          });
    };

    const buyToken = async (etherAmount) => {
      let toWei = window.web3.utils.toWei(etherAmount);
      this.state.ethSwap.methods.buyTokens
        .send({ from: this.state.account, value: toWei })
        .then((hash) => console.log(hash));
    };

    const chainChangedHandler = () => {
      window.location.reload();
    };

    // // whenever we change account in metamask then refetch the account
    window.ethereum.on("accountsChanged", connectWallet);

    // // whenever we change the chain in metamask then it's reload the page
    window.ethereum.on("chainChanged", chainChangedHandler);

    let mainComponent;
    if (this.state.loading) {
      mainComponent = <div>Loading.......</div>;
    } else {
      mainComponent = (
        <BuyForm
          ethBalance={this.state.balance}
          ourTokenBalance={this.state.tokenBalance}
          buyToken={buyToken}
          rate={this.state.rate}
        />
      );
    }

    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dapp University
          </a>
          <div style={{ color: "white" }}>Address : {this.state.account}</div>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                {this.state.account === "" && (
                  <button onClick={connectWallet}>Connect Wallet</button>
                )}
                {mainComponent}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
