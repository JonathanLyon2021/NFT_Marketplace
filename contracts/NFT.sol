// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter; 
    Counters.Counter private _tokenIds; /// @notice the _tokenId is a counter that gives the token a unique id when minted.
    /// @notice Using counters will allow us to increment the tokenID, using the Counters library
    address contractAddress;

    constructor(address marketplaceAddress) ERC721("Metaverse", "Mett") {
        contractAddress = marketplaceAddress;
        /// @dev When we deploy this contract we need to pass in the address of the marketplace 
        /// @notice First we deploy the market and second we deploy the NFT Contract
    }

    function createToken(string memory tokenURI) public returns (uint) {
        _tokenIds.increment();
        if(_tokenIds.current() == 0){
            _tokenIds.increment();
        }
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);
        return newItemId; /// @notice Token Id so we can use that to set it for sale on the market
    }
}
