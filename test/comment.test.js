// it("Should transfer ownership of the token to the marketplace ", async function () {
    //   let originalOwner;
    //   let marketplaceOwner = "0x0000000000000000000000000000000000000000";
    //   let newOwner;
  
    //   const listingPrice = etherToWei("0.025");
    //   const auctionPrice = askingPriceToWei("1");
  
    //   // Create an NFT
    //   const tokenId = await createNFT(addr1);
    //   originalOwner = await nft.ownerOf(tokenId);
  
    //   // Place the NFT for sale
    //   let item = await market
    //     .connect(addr1)
    //     .createMarketItem(nft.address, tokenId, auctionPrice, {
    //       value: listingPrice,
    //     });
  
    //   // Retrieve the item ID from the event object
    //   let newListing = await item.wait();
    //   let event = newListing.events[2];
    //   let value = event.args.owner;
    //   newOwner = value;
  
    //   expect(originalOwner).to.not.eq(newOwner);
    //   expect(newOwner).to.eq(marketplaceOwner);
    // });
  
//     it("Should emit a MarketItemStatus event", async function () {
//       // Set the listing fee
//       const listingPrice = etherToWei("0.025");
//       const auctionPrice = askingPriceToWei("1");
  
//       // Create an NFT
//       const tokenId = await createNFT(addr1);
  
//       // Place the NFT for sale
//       let item = await market
//         .connect(addr1)
//         .createMarketItem(nft.address, tokenId, auctionPrice, {
//           value: listingPrice,
//         });
  
//       // Retrieve the item ID from the event object
//       let newListing = await item.wait();
//       let events = newListing.events;
//       let event = events[events.length - 1];
//       let args = event.args;
  
//       expect(event.event).to.eq("MarketItemStatus");
//       expect(args.itemId.toString()).to.eq("1");
//       expect(args.nftContract.toString()).to.eq(nft.address);
//       expect(args.tokenId.toString()).to.eq(tokenId.toString());
//       expect(args.seller.toString()).to.eq(addr1.address);
//       expect(args.owner.toString()).to.eq(
//         "0x0000000000000000000000000000000000000000"
//       );
//       expect(args.price.toString()).to.eq(auctionPrice.toString());
//       expect(args.sold).to.eq(false);
//     });