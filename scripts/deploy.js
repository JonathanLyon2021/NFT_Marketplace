// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  
  const Market = await hre.ethers.getContractFactory("NFTMarket");
  const market = await Market.deploy();
  await market.deployed();
  console.log("Market deployed to:", market.address);
  
  // We get the contract to deploy
  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(market.address);
  await nft.deployed();
  console.log("NFT deployed to:", nft.address);
  
};

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});