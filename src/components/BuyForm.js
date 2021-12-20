import React, { Component } from "react";
import "./App.css";

export default class BuyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      output: "",
    };
  }

  render() {
    const setEth = (event) => {
      let ethAmount = event.target.value;
      this.setState({ input: ethAmount, output: ethAmount * this.props.rate });
    };

    const setOurToken = (event) => {
      let ourTokenAmount = event.target.value;
      this.setState({
        input: ourTokenAmount / this.props.rate,
        output: ourTokenAmount,
      });
    };
    return (
      <div>
        <form
          className="form"
          onSubmit={(event) => {
            event.preventDefault()
            this.props.buyToken(this.state.input);
          }}
        >
          <div>
            <div className="flex justifySpaceBtw">
              <div>Eth</div>
              <div>Balance:{this.props.ethBalance}</div>
            </div>
            <input type="text" value={this.state.input} onChange={setEth} />
          </div>

          <div>
            <div className="flex justifySpaceBtw">
              <div>Our Token</div>
              <div>Balance:{this.props.ourTokenBalance}</div>
            </div>
            <input
              type="text"
              value={this.state.output}
              onChange={setOurToken}
            />
          </div>
          <div>1 Eth = {this.props.rate} Our Token</div>
          <div>
            <input type="submit" value="Swap" />
          </div>
        </form>
      </div>
    );
  }
}
