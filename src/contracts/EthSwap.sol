pragma solidity >=0.4.21 <0.6.0;

import "./Token.sol";

contract EthSwap {
    string public name = "EthSwap Instant Exchange";
    Token public token;
    uint public rate = 100;

    constructor(Token _token) public {
        token = _token;
    }

    event TokensPurchased(
        address account,
        address token,
        uint amount,
        uint rate
    );


    event TokensSold(
        address account,
        address token,
        uint amount,
        uint rate
    );

    function buyTokens() public payable{
        // Redemption rate = # of tokens they receive for 1 ether
        // Amount of Ethereum * redemption rate
        uint tokenAmount = msg.value * rate;
        
        // require that EthSwap has enough token
        require(token.balanceOf(address(this)) >= tokenAmount);

        token.transfer(msg.sender, tokenAmount);

        //Emit an event
        emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint _amount) public{
        // user can't sell more token they have
        require(token.balanceOf(msg.sender) >= _amount);
        
        uint etherAmount = _amount/rate;

        //Require that EthSwap has enough ether
        require(address(this).balance >= etherAmount);

        token.transferFrom(msg.sender, address(this), _amount);
        msg.sender.transfer(etherAmount);

         //Emit an event
        emit TokensSold(msg.sender, address(token),_amount, rate);
    }
}