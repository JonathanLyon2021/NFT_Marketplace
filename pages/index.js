import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { nftAddress, nftMarketAddress } from "../config";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./create-item.js";

export default function Home() {
	const [nfts, setNfts] = useState([]);
	const [loadingState, setLoadingState] = useState("not-loaded");

	useEffect(() => {
		loadNFTs();
	}, []);

	async function loadNFTs() {
		//const provider = new ethers.providers.JsonRpcProvider(); //used for local hardhat
		const provider = new ethers.providers.InfuraProvider(
			"goerli",
			process.env.INFURA_API_KEY
		);
		const tokenContract = new ethers.Contract(
			nftAddress,
			NFT.abi,
			provider   //used for local hardhat also
		);
		const marketContract = new ethers.Contract(
			nftMarketAddress,
			Market.abi,
			provider    //used for local hardhat also
		);
		const data = await marketContract.fetchMarketItems();
		//this is a json representation from ipfs for instanceof(description, image, name, etc.)
		const items = await Promise.all(
			data.map(async (i) => {
				const itemId = Number(i.itemId.toString());
				const tokenId = Number(i.tokenId.toString());
				const tokenUri = await tokenContract.tokenURI(tokenId);
				const meta = await axios.get(tokenUri);
				let price = ethers.utils.formatUnits(
					i.price.toString(),
					"ether"
				);
				const link = meta.data?.image?.split("ipfs://")[1];
				const url = `https://nftstorage.link/ipfs/${link}`;

				//We are mapping over the items array, setting this stuff to the item.
				let item = {
					itemId,
					price,
					tokenId: i.tokenId.toNumber(),
					seller: i.seller,
					owner: i.owner,
					image: url || " ",
					name: meta.data.name,
					description: meta.data.description,
				};
				return item;
			})
		);
		setNfts(items);
		setLoadingState("loaded"); //set loading state to loaded
	}

	async function buyNft(nft) {
		//web3Modal connects to the wallet
		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();
		const contract = new ethers.Contract(
			nftMarketAddress,
			Market.abi,
			signer
		);
		const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
		const transaction = await contract.createMarketSale(
			nftAddress,
			nft.itemId,
			{
				value: price,
			}
		);
		await transaction.wait();
		loadNFTs(); //this should show the nft's that are not sold, technically speaking, "still available to purchase"
	}

	if (loadingState === "loaded" && !nfts.length)
		return (
			<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>
		);

	return (
		<div>
			<ToastContainer position="top-center" pauseOnFocusLoss={false} />
			<div className="flex justify-center">
				<div className="px-4" style={{ maxWidth: "1600px" }}>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
						{nfts.map((nft, i) => (
							<div
								key={i}
								className="border shadow rounded-xl overflow-hidden"
							>
								<img
									alt="nft"
									src={nft.image}
									style={{
										width: "285px",
										height: "265px",
									}}
									width={350}
									height={350}
								/>
								<div className="p-4">
									<p
										style={{ height: "30px" }}
										className="text-2xl font-semibold"
									>
										{nft.name}
									</p>
									<div>
										<div
											className="text-gray-400"
											style={{ height: "10px" }}
										>
											{nft.description}
										</div>
									</div>
								</div>
								<div className="p-4 bg-black">
									<p className="text-2xl mb-4 font-bold text-white">
										{nft.price} ETH
									</p>
									<button
										className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
										onClick={() => buyNft(nft)}
									>
										Buy
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
