import React, { Component } from "react";
import "./App.css";
import { ethers } from "ethers";
import EthSwap from "../abis/EthSwap.json";
import Token from "../abis/Token.json";
import SwapFormCompoent from "./SwapFormCompoent";

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
    };
  }
  render() {
    const networkID = 5777;

    const connectWallet = async () => {
      if (window.ethereum) {
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((result) => {
            getEthUserAccount(result[0]);
          });
      } else {
        alert("Meta Mask is not installed!!!");
      }
    };

    // load token contract
    const getTokenContract = async () => {
      const tokenAbi = Token.abi;
      const tokenData = Token.networks[networkID];
      if (tokenData) {
        let tokenContractAddress = tokenData.address;
        let tokenProvider = new ethers.providers.Web3Provider(window.ethereum);
        let tokenSigner = tokenProvider.getSigner();
        let tokenContract = new ethers.Contract(
          tokenContractAddress,
          tokenAbi,
          tokenSigner
        );
        this.setState({ token: tokenContract });
        console.log(tokenContract);
      } else {
        alert(
          "Please Switch to correct network, this token does not deployed on this network"
        );
      }
    };

    // load ethswap contract
    const getEthSwapContract = async () => {
      const ethSwapAbi = EthSwap.abi;
      const ethSwapData = EthSwap.networks[networkID];
      if (ethSwapData) {
        let ethSwapContractAddress = ethSwapData.address;
        let ethSwapProvider = new ethers.providers.Web3Provider(
          window.ethereum
        );
        let ethSwapSigner = ethSwapProvider.getSigner();
        let ethSwapContract = new ethers.Contract(
          ethSwapContractAddress,
          ethSwapAbi,
          ethSwapSigner
        );
        this.setState({ ethSwap: ethSwapContract });
        console.log(ethSwapContract);
      } else {
        alert(
          "Please Switch to correct network, this EthSwap does not deployed on this network"
        );
      }
    };

    const getEthUserAccount = (newAccount) => {
      this.setState({ account: newAccount });
      getEthUserBalance(newAccount.toString());
      getTokenContract();
      getUserTokenBalance();
      getEthSwapContract();
      this.setState({ loading: false });
    };

    const getEthUserBalance = (address) => {
      window.ethereum
        .request({ method: "eth_getBalance", params: [address, "latest"] })
        .then((balance) => {
          balance = ethers.utils.formatEther(balance);
          this.setState({ balance });
        });
    };

    const getUserTokenBalance = async () => {
      let tokenBalance = await this.state.token.balanceOf(this.state.account);
      this.setState({ tokenBalance: tokenBalance.toString() });
    };
    const chainChangedHandler = () => {
      window.location.reload();
    };

    // whenever we change account in metamask then refetch the account
    window.ethereum.on("accountsChanged", connectWallet);

    // whenever we change the chain in metamask then it's reload the page
    window.ethereum.on("chainChanged", chainChangedHandler);

    let mainComponent;
    if (this.state.loading) {
      mainComponent = <div>Loading.......</div>;
    } else {
      mainComponent = (
        <SwapFormCompoent
          ethBalance={this.state.balance}
          ourTokenBalance={this.state.tokenBalance}
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
                {this.state.account === "" && <button onClick={connectWallet}>Connect Wallet</button>}
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
