import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";

export default function Navbar() {
	return (
		<div>
			<nav className="border-b p-6">
				<p className="text-4xl font-bold">NHL Marketplace</p>
				<div className="flex mt-4">
					<Link href="/">
						<button className="mr-4 text-pink-500">Home</button>
					</Link>
					<Link href="/create">
						<button className="mr-6 text-pink-500">Sell Top-Shelf NFT</button>
					</Link>
					<Link href="/library">
						<button className="mr-6 text-pink-500">My Top-ShelfNFTs</button>
					</Link>
					<Link href="/dashboard">
						<button className="mr-6 text-pink-500">Dashboard</button>
					</Link>
				</div>
			</nav>
		</div>
	);
}
