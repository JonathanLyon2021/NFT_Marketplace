require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");
const fs = require("fs");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
networks: {
  hardhat: {
    chainId: 8545 // 1337 is for Geth //
  },
 },
solidity: {
  version: "0.8.4",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}
};
