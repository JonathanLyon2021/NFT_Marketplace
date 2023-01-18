require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");
const fs = require("fs");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
networks: {
  hardhat: {
    chainId: 8545 // 1337 is for Geth //
  },
  /*mumbai: {
    url: `https://polygon-mumbai.infura.io/v3/${projectId}}`,
    accounts: [privateKey] //priv.key inside git.ignore
  },
  mainnet: {
    url: `https://polygon-mainnet.infura.io/v3/${projectId}`,
    accounts: [privateKey]  //priv.key inside git.ignore
  },*/
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
