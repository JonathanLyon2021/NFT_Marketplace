import "../styles/globals.css";
import Link from "next/link";

function MyApp({ Component, pageProps }) {
	return (
		<div>
			<nav className="border-b p-6">
				<p className="text-4xl font-bold">NHL Top-Shelf Marketplace</p>
				<div className="flex mt-4">
					<Link href="/">
						<button className="mr-6 text-pink-500 focus:outline-none focus:ring focus:ring-violet-300">
							Home
						</button>
					</Link>
					<Link href="/create-item">
						<button className="mr-6 text-pink-500 focus:outline-none focus:ring focus:ring-violet-300">
							Sell Digital Asset
						</button>
					</Link>
					<Link href="/my-assets">
						<button className="mr-6 text-pink-500 focus:outline-none focus:ring focus:ring-violet-300">
							Digital Assets in my Wallet
						</button>
					</Link>
					<Link href="/creator-dashboard">
						<button className="mr-6 text-pink-500 focus:outline-none focus:ring focus:ring-violet-300">
							Creator Dashboard
						</button>
					</Link>
				</div>
			</nav>
			<Component {...pageProps} />;
		</div>
	);
}

export default MyApp;
