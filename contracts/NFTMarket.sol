// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


 contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    address payable owner; /// @notice makes a commission on every item sold
    uint256 listingPrice = 0.025 ether; /// @notice listing price is 0.025 goerli ether

    constructor() {
      owner = payable(msg.sender);
    }

    struct MarketItem {
      uint256 itemId;
      address nftContract;
      uint256 tokenId;
      address payable seller;
      address payable owner;
      uint256 price;
      bool sold;
    }

  /// @notice mapping from itemId to MarketItem
    mapping(uint256 => MarketItem) private idToMarketItem;

    event MarketItemCreated (
      uint256 indexed itemId,
      address indexed nftContract,
      uint256 indexed tokenId,
      address seller,
      address owner,
      uint256 price,
      bool sold
    );

    /// @dev Returns the listing price of the contract 
    function getListingPrice() public view returns (uint256) {
      return listingPrice;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can do this");
        _;
    }
  
    function getOwner() external view onlyOwner returns (address) {
        return owner;
    }

    function getOwnerBalance() external view onlyOwner returns (uint256) {
        return owner.balance;
    }

  /// @dev This function places an item for sale on the market place
    function createMarketItem(
      address nftContract,
      uint256 tokenId,
      uint256 price
    ) public payable nonReentrant {
      require(price > 0, "Price must be at least 1 wei");
      require(msg.value == listingPrice, "Price must be equal to listing price");

      _itemIds.increment();
      uint256 itemId = _itemIds.current();

      idToMarketItem[itemId] =  MarketItem(
        itemId,
        nftContract,
        tokenId,
        payable(msg.sender),
        payable(address(this)),// NFTMarketplace contract address  
        price,
        false
      );

    /// @notice transfers ownership of the token to the marketplace
      IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
      emit MarketItemCreated(
        itemId,
        nftContract,
        tokenId,
        msg.sender,
        address(this),
        price,
        false
      );
    }

    /// @dev Creates the sale of a marketplace item 
    /// @notice Transfers ownership of the item, as well as funds between parties 
    function createMarketSale(
      address nftContract,
      uint256 itemId
      ) public payable nonReentrant {
      uint price = idToMarketItem[itemId].price;
      uint tokenId = idToMarketItem[itemId].tokenId;
      require(msg.value == price, "Please submit the asking price in order to complete the purchase");

      idToMarketItem[itemId].seller.transfer(msg.value);
      IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
      idToMarketItem[itemId].owner = payable(msg.sender);
      idToMarketItem[itemId].sold = true;
      _itemsSold.increment();
      payable(owner).transfer(listingPrice);
    }

    /* Returns all unsold market items */
    function fetchMarketItems() public view returns (MarketItem[] memory) {
      uint itemCount = _itemIds.current();
      uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
      uint currentIndex = 0;

      MarketItem[] memory items = new MarketItem[](unsoldItemCount);
      for (uint i = 0; i < itemCount; i++) {
        if (idToMarketItem[i + 1].owner == address(this)) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    /* Returns only items that a user has purchased */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
      uint totalItemCount = _itemIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].owner == msg.sender) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].owner == msg.sender) {
          uint currentId = idToMarketItem[i + 1].itemId;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    /* Returns only items a user has listed */
    function fetchItemsCreated() public view returns (MarketItem[] memory) {
      uint totalItemCount = _itemIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].seller == msg.sender) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].seller == msg.sender) {
          uint currentId = idToMarketItem[i + 1].itemId;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }
}