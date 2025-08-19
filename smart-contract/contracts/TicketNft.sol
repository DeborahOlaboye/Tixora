// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract TicketNft is ERC721, Ownable {
    uint256 private _tokenIds;
    address public minter;
    string public imageUri; // Single image URI for all NFTs
    mapping(uint256 => uint256) public ticketOfToken;
    mapping(uint256 => string) public eventNameOfToken; // Store eventName per token
    mapping(uint256 => string) public descriptionOfToken; // Store description per token

    mapping(uint256 => uint256) public eventTimestampOfToken;
    mapping(uint256 => string) public locationOfToken;


    event MinterChanged(address indexed oldMinter, address indexed newMinter);
    event TicketMinted(address indexed to, uint256 indexed tokenId, uint256 indexed ticketId);
    event ImageUriUpdated(string newImageUri);

    constructor(
        string memory name_,
        string memory symbol_,
        string memory imageUri_
    ) ERC721(name_, symbol_) Ownable(msg.sender) {
        require(bytes(imageUri_).length > 0, "imageUri required");
        imageUri = imageUri_;
    }

    modifier onlyMinter() {
        require(minter == msg.sender, "TicketNft: caller is not minter");
        _;
    }

    function setMinter(address newMinter) external onlyOwner {
        require(newMinter != address(0), "zero address"); // Added validation
        emit MinterChanged(minter, newMinter);
        minter = newMinter;
    }

    // Updated to match ITicketNft interface
    // function mintForRegistrant(address to, uint256 ticketId, string memory eventName, string memory description) external returns (uint256);
    function mintForRegistrant(
        address to,
        uint256 ticketId,
        string memory eventName,
        string memory description,
        uint256 eventTimestamp,
        string memory location
    ) external returns (uint256) {
        require(to != address(0), "zero address");
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        _safeMint(to, newTokenId);
        ticketOfToken[newTokenId] = ticketId;
        eventNameOfToken[newTokenId] = eventName;
        descriptionOfToken[newTokenId] = description;
        eventTimestampOfToken[newTokenId] = eventTimestamp; // New mapping
        locationOfToken[newTokenId] = location; // New mapping
        emit TicketMinted(to, newTokenId, ticketId);
        return newTokenId;
    }

    // Implement tokenURI for ERC721 metadata
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        // require(_exists(tokenId), "URI query for nonexistent token");
        string memory json = string(
            abi.encodePacked(
                '{"name": "', eventNameOfToken[tokenId], ' #', Strings.toString(tokenId), '",',
                '"description": "', descriptionOfToken[tokenId], '",',
                '"image": "', imageUri, '",',
                '"attributes": [',
                '{"trait_type": "Event ID", "value": "', Strings.toString(ticketOfToken[tokenId]), '"},',
                '{"trait_type": "Event Date", "value": "', Strings.toString(eventTimestampOfToken[tokenId]), '"},',
                '{"trait_type": "Location", "value": "', locationOfToken[tokenId], '"}',
                ']}'
            )
        );
        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(json))));
    }

    function setImageUri(string memory newImageUri) external onlyOwner {
        require(bytes(newImageUri).length > 0, "imageUri required");
        imageUri = newImageUri;
        emit ImageUriUpdated(newImageUri); // New event
    }
}
