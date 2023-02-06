/** @type {import('next').NextConfig} */
// import * as dotenv from 'dotenv';
// dotenv.config()

const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: ["nftstorage.link"],
	  },
};

module.exports = nextConfig;


	
