import { useState, useRef } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import { NFTStorage } from "nft.storage";
import { nftAddress, nftMarketAddress } from "../config";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { ToastContainer, toast } from "react-toastify";
import styles from "../styles/CreateItem.module.css";
import "react-toastify/dist/ReactToastify.css";

export default function CreateItem() {
	const fileUpload = useRef(null);
	const apiKey =
		process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY;
	const client = new NFTStorage({ token: apiKey });
	const [fileUrl, setFileUrl] = useState(null);
	const [formInput, updateFormInput] = useState({
		price: "",
		name: "",
		description: "",
	});
	const [nftTransactionHash, setNftTransactionHash] = useState("");
	const [marketTransactionHash, setMarketTransactionHash] = useState("");
	const [isTransacting, setIsTransacting] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [ipfsIsLoading, setIpfsIsLoading] = useState(false);
	const router = useRouter();

	async function onChange() {
		try {
			const url = URL.createObjectURL(fileUpload.current.files[0]);
			setFileUrl(url);
		} catch (e) {
			console.log("Error:", e);
			let errorMessage = e.message;

			if (e.message.includes("user rejected transaction")) {
				errorMessage = "User rejected transaction";
			}
			toast.error(errorMessage, {
				theme: "colored",
			});
		}
	}

	{
		/*creates item and saves it to ipfs(nft.storage)*/
	}
	async function createItem() {
		const { name, description, price } = formInput;
		if (!name || !description || !price || !fileUrl) {
			let blankMessage = "Please fill out all fields";
			toast.error(blankMessage, {
				theme: "dark",
			});
		}

		try {
			const { name: fileName, type } = fileUpload.current.files[0];
			setIpfsIsLoading(true);
			const metadata = await client.store({
				name,
				description,
				image: new File(fileUpload.current.files, fileName, {
					type,
				}),
				properties: {
					price,
				},
			});
			setIpfsIsLoading(false);
			const link = metadata.url.split("ipfs://")[1];
			const url = `https://nftstorage.link/ipfs/${link}`;
			createSale(url);
		} catch (e) {
			console.log("Error uploading file: ", e);
			let errorMessage = e.message;
			if (e.message.includes("user rejected transaction")) {
				errorMessage = "User rejected transaction";
			}
			toast.error(errorMessage, {
				theme: "colored",
			});
		}
	}

	async function createSale(metadata) {
		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();
		let contract = new ethers.Contract(nftAddress, NFT.abi, signer);
		try {
			setIsTransacting(true);
			let transaction = await contract.createToken(metadata);
			setIsLoading(true);
			let tx = await transaction.wait();
			setIsLoading(false);
			if (tx.status == true) {
				setNftTransactionHash(tx.transactionHash);
				toast.success("NFT created successfully", {
					theme: "colored",
				});
			}
			let event = tx.events[0];
			let value = event.args[2];
			let tokenId = value.toNumber();
			const price = ethers.utils
				.parseUnits(formInput.price, "ether")
				.toString();

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
			setIsLoading(true);
			const marketTx = await transaction.wait();
			setIsLoading(false);
			if (marketTx.status == true) {
				setMarketTransactionHash(marketTx.transactionHash);
				toast.success("Market Item Created successfully", {
					theme: "colored",
				});
			}
		} catch (e) {
			setIsLoading(false);
			console.log("Error:", e);
			setIsTransacting(false);
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

						{!ipfsIsLoading ? (
							<button
								type="button"
								onClick={createItem}
								class="mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
							>
								Create Digital Asset
							</button>
						) : (
							<button
								disabled
								type="button"
								class="mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
							>
								<svg
									aria-hidden="true"
									role="status"
									class="inline w-4 h-4 mr-3 text-white animate-spin"
									viewBox="0 0 100 101"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
										fill="#E5E7EB"
									/>
									<path
										d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
										fill="currentColor"
									/>
								</svg>
								Creating Digital Asset...
							</button>
						)}
					</div>
					<p className="text-4xl font-bold">Create an NFT</p>
				</div>
			) : (
				<div>
					{nftTransactionHash && (
						<div className="flex flex-col mt-2 border rounded p-4 flex-row-reverse">
							<div>
								<button
									onClick={handleButtonClick}
									className="border rounded px-4 py-3 bg-purple-600 text-white font-bold flex justify-right"
								>
									Back to home
								</button>
							</div>
							<h1 className="flex justify-center">
								<font color="purple">
									<b>Transaction Receipts</b>
								</font>
							</h1>
							<p className="flex justify-center">
								<strong>
									View your Transactions on Etherscan:
								</strong>
							</p>
							<br></br>
							{nftTransactionHash && (
								<p>
									<a
										href={`https://goerli.etherscan.io/tx/${nftTransactionHash}`}
										target="_blank"
									>
										<strong>
											NFT transaction receipt:{" "}
										</strong>
										<font color="blue">{` ${nftTransactionHash}`}</font>
										<br></br>
										<br></br>
									</a>
								</p>
							)}
							{marketTransactionHash && (
								<p>
									<a
										href={`https://goerli.etherscan.io/tx/${marketTransactionHash}`}
										target="_blank"
									>
										<strong>
											Market transaction receipt:{" "}
										</strong>
										<font color="blue">
											{` ${marketTransactionHash}`}{" "}
										</font>
									</a>
								</p>
							)}
						</div>
					)}

					{/* Transaction Instructions/Steps */}
					<h1 className="flex justify-center">
						<b>Transaction in progress. Please wait...</b>
					</h1>
					{isLoading && <div className={styles.loading}></div>}
					<h1 className="flex justify-center">
						<b>Step 1 :</b>
						<font>
							{" "}
							Confim wallet transaction in order to create the NFT
						</font>
					</h1>
					<br></br>
					<h1 className="flex justify-center">
						<b>Step 2 :</b>
						<font>
							Confirm wallet transaction in order to list the NFT
							on the Marketplace
						</font>
					</h1>
					<br></br>
					<h1 className="flex justify-center">
						<b>Step 3 :</b>
						<font>Wait for transaction to be mined...</font>
					</h1>
					<br></br>
					<h1 className="flex justify-center">
						<b>Step 4 :</b>
						<font>
							(Optional) Review transaction on Etherscan by
							clicking on the transaction hashes. Both of which
							are highlighted above in blue!
						</font>
					</h1>
				</div>
			)}
		</>
	);
}
