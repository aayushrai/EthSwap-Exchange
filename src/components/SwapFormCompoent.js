import React, { Component } from "react";
import "./App.css";

export default class SwapFormCompoent extends Component {
  render() {
    return (
      <div>
        <form className="form">
          <div>
            <div className="flex justifySpaceBtw">
              <div>Eth</div>
              <div>Balance:{this.props.ethBalance}</div>
            </div>
            <input type="number" />
          </div>

          <div>
            <div className="flex justifySpaceBtw">
              <div>Our Token</div>
              <div>Balance:{this.props.ourTokenBalance}</div>
            </div>
            <input type="number" />
          </div>

          <div>
            <input type="submit" value="Swap" />
          </div>
        </form>
      </div>
    );
  }
}
