import {ethers } from "ethers"; // ethers is a library that allows us to interact with the blockchain
import { useEffect, useState } from "react"; //useEffect is a hook that allows us to run code when the page loads
import axios from "axios"; // axiios makes http requests & calls to the backend (API)
import Web3Modal from "web3modal"; // web3modal is a library that allows us to connect to the wallet
import { nftAddress, nftMarketAddress } from "../config"; // import the address of the NFT.sol & NFTMarket.sol
import NFT from "../artifacts/contracts/NFT.sol/NFT.json"; // import the NFT contract
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json"; // import the NFTMarket contract


export default function MyAssets() {
	const [nfts, setNfts] = useState([]); // set the state of the NFTs to an empty array
	const [loadingState, setLoadingState] = useState("not-loaded"); // set the state of the loading state to not-loaded
	useEffect(() => {
		loadNfts();
		}, []);
		async function loadNfts() {
			const web3Modal = new Web3Modal()
			const connection = await web3Modal.connect()
			const provider = new ethers.providers.Web3Provider(connection)
			const signer = provider.getSigner() //we NEED to get the signer(msg.sender) to interact with the contract
			//also using the signer to get a reference to the marketcontract, because we need to know the msg.sender?? askJason

			//fetching the tokens/ALL the Market items
			const marketContract = new ethers.Contract(nftMarketAddress, Market.abi, signer)
			//^^so if weve navigated to this page and we haven't authenticated w/ a wallet yet... 
			//^^we will automatically see the Wallet Modal pop up
			const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
			//We grab all the market data/NFT's, then two lines down we map over them to get the tokenURI & metadata, price, etc. askJason
			const data = await marketContract.fetchMyNFTs()
			const items = await Promise.all(data.map(async i => {
				const tokenUri = await tokenContract.tokenURI(i.tokenId)
				const meta = await axios.get(tokenUri)
				const link = meta.data?.image?.split("ipfs://")[1];
				const url = `https://nftstorage.link/ipfs/${link}`;
				let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
				let item = {
					price,
					tokenId: i.tokenId.toNumber(),
					seller: i.seller,
					owner: i.owner,
					image: url || " ",
					name: meta.data.name,
					description: meta.data.description,
				}
				return item
			}))
			setNfts(items)
			setLoadingState('loaded') // set the loading state to loaded
		}

		if(loadingState === 'loaded' && !nfts.length) return (
			<h1 className="px-20 py-10 text-3xl">No assets owned</h1>
		)

	return (
		<div className="flex justify-center">
			<div className="p-4">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
					{ nfts.map((nft, i) => (
						<div key={i} className="border shadow rounded-xl overflow-hidden">
							<img src={nft.image} className="rounded overflow-hidden" alt="nft" style={{width: 350, height:450}}/>
							<div className="p-4 bg-black">
								<p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
								
							</div>
							
						</div>
					))
					}
				</div>	
			</div>
		</div>
	);
}
