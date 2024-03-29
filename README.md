# NFT Marketplace - Dencentralized Application (DApp)

<img src="./public/nftMarket1.jpg">

<!-- ABOUT THE PROJECT -->

## About The Project

Implemented a NFT Marketplace based on a Decentralized Application using Next.js and Goerli testnet.The purpose of this application is to allow users to create digital assets (NFT's), and also afterwards they have the option to put those NFT's on the NFT Marketplace for purchasing. This project was written in JavaScript and Solidity.

## What I learned

This was my first time implementing Next.js, Tailwind CSS, and Hardhat. Also deploying to the Goerli testnet network was kind of a first because I had already deployed smart contracts on Remix IDE using Goerli network, just never creating NFT's using ipfs. Deploying through Hardhat was a simple process.

### Languages

- [Solidity](https://docs.soliditylang.org/en/v0.8.9/)
- [JavaScript](https://www.javascript.com/)

## Built With

- [Goerli](https://goerli.net/)
- [Ethers](https://docs.ethers.io/v5/)
- [Hardhat](https://hardhat.org/)
- [MetaMask](https://metamask.io/)
- [nft.storage](https://nft.storage//)
- [Next.js](https://nextjs.org/)
- [Tailwind](https://tailwindcss.com/)

## Reccommended Dependencies

- [Web3 Modal](https://www.npmjs.com/package/web3modal)
- [React Toastify](https://github.com/fkhadra/react-toastify#readme)
- [Solidity Coverage](https://www.npmjs.com/package/solidity-coverage)

# Setting up the Project
1. Clone the project from [GitHub](github.com)
2. Create a dotenv file in the root of the project
3. Provide the required environment variables inside of a dotenv file with the variables named as shown in the parenthesis (NEXT_PUBLIC_PRIVATE_KEY, NEXT_PUBLIC_INFURA_API_KEY, NEXT_PUBLIC_NFT_STORAGE_API_KEY) -> which are essentially your [Private Key](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key), your [Infura API Key](infura.io), & your [nft.storage API Key](https://nft.storage/)
4. Install the packages: `npm i`                                                                                                                   
<img src="./public/npmList.jpg"> 
5. run the command: `npm run dev` <br>
6. Open your browser and type in `localhost:3000` in your address bar, go to the browser to interact. <br>
7. The Dapp is up and running, Sweet! <br>
8. Finally, Create an NFT nad then list it for sale on the Marketplace! 

# Setting up the project in Hardhat((Optional)- Extra steps required for this method, Not Recommended)
This project can be run on hardhat but sometimes hardhat can be finnicky. Anyway, if you wish to give it a shot. Here are the insrtuctions.
1. Open a terminal nad go to the directory you cloned the project in.
2. Provide the required environment variables inside of a dotenv file with the variables named as shown in the parenthesis (NEXT_PUBLIC_PRIVATE_KEY, NEXT_PUBLIC_INFURA_API_KEY, NEXT_PUBLIC_NFT_STORAGE_API_KEY) -> which are essentially your [Private Key](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key), your [Infura API Key](infura.io), & your [nft.storage API Key](https://nft.storage/)
3. Run the command `npx hardhat node`
4. Open another terminal in the same directory in order to deploy the contracts; run the command `npx hardhat run scripts/deploy.js --network localhost`
5. Copy the addresses from the terminal and overwrite the contract addresses in the config file.
6. Go to index.js and comment OUT lines 22 through 25 (switching provider).
7. Comment IN line 21 (new provider).
8. Open a new terminal in the same directory and run the command `npm run dev`.
9. Open your browser and type in `localhost:3000` in your address bar, go to the browser to interact.
10. The Dapp is up and running, Sweet!
11. Finally, Create an NFT nad then list it for sale on the Marketplace!

# Unit Testing
1. Go to the directory where you cloned the project in a brand new terminal window.
2. Run the command `npx hardhat test test\market.test.js`
3. You can see all the test cases described in the terminal output, all tests pass. ;-)

# 1. Smart Contracts
#### Security

- I used re-entrancy guard from the [OpenZeppelin library(nonReentrant)](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/ReentrancyGuard.sol).

#### Functionality

-I only used the blockchain for the parts of the Dapp that require decentralization.<br>
-I kept the functions small and clean.<br>
-I used contracts and code that was already written, where possible. No need to re-invent the wheel.<br>
-I also kept the smart contract logic fairly simple.<br>
-I optimized the contracts using [OpenZeppelin's Solidity Library](https://github.com/OpenZeppelin/openzeppelin-contracts).<br>

# 2. Frontend
#### Functionality

-Users will have the ability to connect their MetaMask wallet in order to complete transactions. They can create NFT's and view them on [Goerli network](https://goerli.etherscan.io/), clicking on the NFT receipt that I've created to make the user expierence more understandable.

#### Framework

[Next.js](https://nextjs.org/) gives the best developer expierence with all the features you need for production. TypeScript support, server rendering, route pre-fetching, smart bundling, and more without a config.

#### Client-Side Wallet

Available as a browser extension and as a mobile app, [MetaMask](https://metamask.io/) equips you with a key vault, secure login, token wallet, and token exchange. Make sure you are on the Goerli network.

# 3. Unit Testing

Hardhat is a fast, extensible, and flexible Ethereum development for professionals. All of the Unit Tests pass.

# 4. Off-chain Storage(IPFS)

I used a third party to IPFS called [nft.storage](https://nft.storage/) the documantation was fairly easy and accessable to go through and understand quickly. IPFS is a protocol and a peer-to-peer network for storing and sharing data in a distributed file system. <br>

NFT.Storage is a storage service that lets you upload off-chain NFT data for free, with the goal to store all NFT data as a public good. The data is stored perpetually in the Filecoin decentralized storage network and made available over IPFS via its unique content ID. You can upload as much data as you want as long as it's part of an NFT (e.g., metadata, images and other assets referenced in a token or its metadata), although there is currently a limit of 31GiB per individual upload.<br>

NFT.Storage is especially useful for individual creators who are minting NFTs, or NFT tooling developers looking to support creators and collectors! NFT.Storage is super easy to use and integrate, gives you back the content ID of your upload which you need when minting an NFT to make it truly immutable, and makes your data performantly available.<br>
