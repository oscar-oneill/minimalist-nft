require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

module.exports = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      url: process.env.stagingKey,
      accounts: [`${process.env.privateKey}`]
    },
  },
  etherscan: {
    apiKey: "IHVF5HSCZ3HMHYBEFC155Y8FXBFRQXNVKN",
  }
};