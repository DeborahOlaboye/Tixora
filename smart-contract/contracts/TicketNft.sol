// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TicketNft is ERC721, Ownable {
    uint256 private _tokenIds; // Replaced Counters with uint256

    address public minter;
    mapping(uint256 => uint256) public ticketOfToken;

    event MinterChanged(address indexed oldMinter, address indexed newMinter);
    event TicketMinted(address indexed to, uint256 indexed tokenId, uint256 indexed ticketId);

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) Ownable(msg.sender) {}

    modifier onlyMinter() {
        require(minter == msg.sender, "TicketNft: caller is not minter");
        _;
    }

    function setMinter(address newMinter) external onlyOwner {
        emit MinterChanged(minter, newMinter);
        minter = newMinter;
    }

    function mintForRegistrant(address to, uint256 ticketId) external onlyMinter returns (uint256) {
        _tokenIds++; // Increment counter
        uint256 newTokenId = _tokenIds;
        _safeMint(to, newTokenId);
        ticketOfToken[newTokenId] = ticketId;
        emit TicketMinted(to, newTokenId, ticketId);
        return newTokenId;
    }
}