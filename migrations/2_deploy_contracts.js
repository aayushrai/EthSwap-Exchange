const EthSwap = artifacts.require("EthSwap");
const Token = artifacts.require("Token");

module.exports = async function(deployer) {
  // Deploy EthSwap
  await deployer.deploy(EthSwap);
  const ethSwap = await EthSwap.deployed();

  // Deploy Token
  await deployer.deploy(Token);
  const token = await Token.deployed();

  // Transfer all token to ethSwap

  await token.transfer(ethSwap.address, '1000000000000000000000000')
};
