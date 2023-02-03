/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		PRIVATE_KEY: "9cf9999fc47df7394913054856099f8a398d24605cbdec559109f136e7cb8a7c",
		PROJECT_ID:"460a2af81be44b31aed0e928f26cbc53",
		NEXT_PUBLIC_NFT_STORAGE_API_KEY:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkxMzJkMThmZDQ4NjRlNzAxNjUwMzQwNThFOGQyNjkyOTREZDg5ZTgiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzIwODM4MjQ1OTMsIm5hbWUiOiJuZnRUb2tlbiJ9._YJPyY76oRQ6zxCOf7SIu-7r9BvajqY_GVF8QzyLuDk",
	},
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: ["nftstorage.link"],
	  },
};

module.exports = nextConfig;


	
