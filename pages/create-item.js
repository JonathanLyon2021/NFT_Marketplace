import { useState, useRef } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import { NFTStorage } from "nft.storage";
import { nftAddress, nftMarketAddress } from "../config";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateItem() {
	const fileUpload = useRef(null);
	const apiKey =
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGUwZGY2N0QwMDE3MjVlMDNGNzk1MzRBODVGNWJiYTVBYjE2Y2M2YTYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3MjYwMTEzNDcwMSwibmFtZSI6Im5obFRvcFNoZWxmIn0.TR6Sb2qeZI-svNnSLbW7u7CTwRXwDOxKtRKVk4l0hhc";
	const client = new NFTStorage({ token: apiKey });
	// const fileInput = document.querySelector('input[type="file"]');
	const [fileUrl, setFileUrl] = useState(null);
	const [formInput, updateFormInput] = useState({
		price: "",
		name: "",
		description: "",
	});
	const [nftTransactionHash, setNftTransactionHash] = useState("");
	const [marketTransactionHash, setMarketTransactionHash] = useState("");

	const [isTransacting, setIsTransacting] = useState(false);
	//const buttonText = "Create Digital Asset"
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	async function onChange() {
		try {
			const url = URL.createObjectURL(fileUpload.current.files[0]);
			setFileUrl(url);
		} catch (e) {
			console.log("Error:", e);
			let errorMessage = "";
			if (e.message.includes("user rejected transaction")) {
				errorMessage = "User rejected transaction";
			}
			toast.error(errorMessage, {
				theme: "colored",
			});
		}
	}

	//creates item and saves it to ipfs
	async function createItem() {
		const { name, description, price } = formInput;
		if (!name || !description || !price || !fileUrl) return;

		try {
			const { name, type } = fileUpload.current.files[0];
			console.log(
				"new File:",
				new File(fileUpload.current.files, name, {
					type,
				})
			);
			const metadata = await client.store({
				name,
				description,
				image: new File(fileUpload.current.files, name, {
					type,
				}),
				properties: {
					price,
				},
			});
			const link = metadata.url.split("ipfs://")[1];
			const url = `https://nftstorage.link/ipfs/${link}`;
			console.log("url:", url);
			createSale(url);
			//setTimeout(disableFunction("createButton"), 1);
		} catch (e) {
			console.log("Error uploading file: ", e);
			let errorMessage = "";
			if (e.message.includes("user rejected transaction")) {
				errorMessage = "User rejected transaction";
			}
			toast.error(errorMessage, {
				theme: "colored",
			});
		}
	}

	async function createSale(metadata) {
		console.log("metadata:", metadata);
		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();

		let contract = new ethers.Contract(nftAddress, NFT.abi, signer);
		try {
			setIsTransacting(true);
			setIsLoading(true);
			let transaction = await contract.createToken(metadata);
			let tx = await transaction.wait();

			console.log("tx:", tx);
			if (tx.byzantium == true) {
				console.log("txHash:", tx.transactionHash);
				setNftTransactionHash(tx.transactionHash);
				toast.success("NFT created successfully", {
					theme: "colored",
				});
			}
			let event = tx.events[0];
			let value = event.args[2];
			let tokenId = value.toNumber();
			const price = ethers.utils
				.parseUnits(formInput.price, "ether");
				//.toString();

			contract = new ethers.Contract(
				nftMarketAddress,
				Market.abi,
				signer
			);
			let listingFee = await contract.getListingPrice();
			listingFee = listingFee.toString();

			transaction = await contract.createMarketItem(
				nftAddress,
				tokenId,
				price,
				{
					value: listingFee,
				}
			);

			const marketTx = await transaction.wait();
			console.log("marketTx:", marketTx);

			//router.push("/");
			if (marketTx.byzantium == true) {
				setMarketTransactionHash(marketTx.transactionHash);
				toast.success("Market Item Created successfully", {
					theme: "colored",
				});
			}
		} catch (e) {
			console.log("Error:", e);
			setIsTransacting(false);
			setIsLoading(false);
			let errorMessage = "";
			if (e.message.includes("user rejected transaction")) {
				errorMessage = "User rejected transaction";
			}
			toast.error(errorMessage, {
				theme: "colored",
			});
		}
	}

	const handleButtonClick = () => {
		setIsTransacting(false);
		router.push("/");
	};

	return (
		<>
			<ToastContainer position="top-center" pauseOnFocusLoss={false} />
			{!isTransacting ? (
				<div className="flex justify-center">
					<div className="w-1/2 flex flex-col pd-12">
						<input
							placeholder="Asset Name"
							className="mt-8 border rounded p-4"
							onChange={(e) =>
								updateFormInput({
									...formInput,
									name: e.target.value,
								})
							}
						/>
						<textarea
							placeholder="Asset Description"
							className="mt-2 border rounded p-4"
							onChange={(e) =>
								updateFormInput({
									...formInput,
									description: e.target.value,
								})
							}
						/>
						<input
							placeholder="Asset Price in Goerli"
							className="mt-2 border rounded p-4"
							onChange={(e) =>
								updateFormInput({
									...formInput,
									price: e.target.value,
								})
							}
						/>
						<input
							ref={fileUpload}
							type="file"
							name="Asset"
							className="my-4"
							onChange={onChange}
						/>
						{fileUrl && (
							<img
								className="rounded mt-4"
								width="350"
								src={fileUrl}
							/>
						)}
						<button
							onClick={createItem}
							className={
								isLoading
									? "font-bold mt-4 bg-purple-500 text-white rounded p-4 shadow-lg"
									: "font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
							}
							disabled={isLoading}
						>
							{isLoading ? "Loading..." : "Create Digital Asset"}
						</button>
					</div>

					<p className="text-4xl font-bold">Create an NFT</p>
				</div>
			) : (
				// Transaction Hashes
				<div>
					<div className="flex pd-12 flex-row-reverse mr-5">
						<button
							onClick={handleButtonClick}
							className="border rounded px-4 py-2 bg-purple-500 text-white font-bold"
						>
							Back to home
						</button>
					</div>
					{nftTransactionHash && (
						<div className="flex flex-col mt-2 border rounded p-4">
							<h3>Transaction Receipts</h3>
							<p>View your Transactions on Etherscan:</p>
							{nftTransactionHash && (
								<p>
									<a
										href={`https://goerli.etherscan.io/tx/${nftTransactionHash}`}
										target="_blank"
									>
										{`NFT transaction receipt: ${nftTransactionHash}`}
									</a>
								</p>
							)}
							{marketTransactionHash && (
								<p>
									<a
										href={`https://goerli.etherscan.io/tx/${marketTransactionHash}`}
										target="_blank"
									>
										{`Market transaction receipt: ${marketTransactionHash}`}
									</a>
								</p>
							)}
						</div>
					)}

					{/* Transaction Instructions/Steps */}
					<div className="m-10">
						<h1>Transaction in progress. Please wait...</h1>
						<h3>Step 1</h3>
						<p>
							Confim wallet transaction in order to create the NFT
						</p>
						<h3>Step 2</h3>
						<p>
							Optional: Confirm wallet transaction in order to
							list NFT in Marketplace
						</p>
						<h3>Step 3</h3>
						<p>Wait for transaction to be mined...</p>
						<h3>Step 4</h3>
						<p>Optional: Review transaction on Etherscan</p>
					</div>
				</div>
			)}
		</>
	);
}
