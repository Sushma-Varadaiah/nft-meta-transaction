// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@opengsn/contracts/src/BaseRelayRecipient.sol";

interface ImetaTransactionNFT {
    function mint(uint256 id, uint256 amount) external;
}

contract MetaTransactionHandler is BaseRelayRecipient {
    address NFTMetaAddress;

    constructor(address _NFTMetaAddress, address _forwarder) {
        NFTMetaAddress = _NFTMetaAddress;
        _setTrustedForwarder(_forwarder);
    }

    function mintMetaTransactionNFT(uint256 _id, uint256 _amount) public {
        ImetaTransactionNFT(NFTMetaAddress).mint(_id, _amount);
    }

    function versionRecipient() external pure override returns (string memory) {
        return "2.0.0";
    }
}
