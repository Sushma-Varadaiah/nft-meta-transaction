// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract MetaTransactionNFT is ERC1155, Ownable {
    constructor() ERC1155("") {}

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    // NFT will be minted to the person who is sending this transaction
    function mint(uint256 id, uint256 amount) public {
        _mint(_msgSender(), id, amount, "");
    }
}
