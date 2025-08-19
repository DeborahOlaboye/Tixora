// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IEventTicketing {
    function getStatus(uint256 ticketId) external view returns (uint8);
}

interface ITicketNft {
    function ticketOfToken(uint256 tokenId) external view returns (uint256);
}

contract TicketResaleMarket is ReentrancyGuard {
    // ---- Types ----
    enum Status { Upcoming, Passed, Canceled, Closed }

    struct Listing {
        uint256 ticketId;
        uint256 tokenId;
        address seller;
        uint256 price;          // in wei (CELO)
        bool active;
    }

    // ---- Storage ----
    IEventTicketing public eventTicketing;
    IERC721 public ticketNft;
    uint16 public royaltyBps;               // e.g., 250 = 2.5%
    address payable public feeRecipient;

    // tokenId => Listing
    mapping(uint256 => Listing) public listings;

    // ---- Events ----
    event TicketListed(
        uint256 indexed tokenId,
        uint256 indexed ticketId,
        address indexed seller,
        uint256 price
    );
    event TicketSold(
        uint256 indexed tokenId,
        uint256 indexed ticketId,
        address indexed seller,
        address buyer,
        uint256 price,
        uint256 royaltyAmount
    );
    event RoyaltyUpdated(uint16 newRoyaltyBps);
    event FeeRecipientUpdated(address indexed newRecipient);

    // ---- Constructor ----
    constructor(
        address eventTicketingAddress,
        address ticketNftAddress,
        address payable feeRecipient_,
        uint16 royaltyBps_
    ) ReentrancyGuard() {
        require(eventTicketingAddress != address(0), "EventTicketing address required");
        require(ticketNftAddress != address(0), "TicketNft address required");
        require(feeRecipient_ != address(0), "feeRecipient required");
        require(royaltyBps_ <= 10_000, "royalty too high");

        eventTicketing = IEventTicketing(eventTicketingAddress);
        ticketNft = IERC721(ticketNftAddress);
        feeRecipient = feeRecipient_;
        royaltyBps = royaltyBps_;
    }

    // ---- Admin (unchanged behavior) ----
    function setRoyalty(uint16 newRoyaltyBps) external {
        require(newRoyaltyBps <= 10_000, "royalty too high");
        royaltyBps = newRoyaltyBps;
        emit RoyaltyUpdated(newRoyaltyBps);
    }

    function setFeeRecipient(address payable newRecipient) external {
        require(newRecipient != address(0), "zero addr");
        feeRecipient = newRecipient;
        emit FeeRecipientUpdated(newRecipient);
    }

    // ---- Resale Lifecycle ----

    /// @notice List a ticket for resale (owner must approve this contract).
    function listTicket(uint256 tokenId, uint256 price) external {
        require(price > 0, "price must be > 0");
        require(ticketNft.ownerOf(tokenId) == msg.sender, "not owner");
        require(
            ticketNft.isApprovedForAll(msg.sender, address(this)) ||
            ticketNft.getApproved(tokenId) == address(this),
            "not approved"
        );
        require(!listings[tokenId].active, "already listed");

        uint256 ticketId = ITicketNft(address(ticketNft)).ticketOfToken(tokenId);
        require(eventTicketing.getStatus(ticketId) == uint8(Status.Upcoming), "event not upcoming");

        listings[tokenId] = Listing({
            ticketId: ticketId,
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            active: true
        });

        emit TicketListed(tokenId, ticketId, msg.sender, price);
    }

    /// @notice Buy a listed ticket.
    function buyTicket(uint256 tokenId) external payable nonReentrant {
        Listing storage listing = listings[tokenId];
        require(listing.active, "not listed");
        require(msg.value >= listing.price, "insufficient CELO");
        require(eventTicketing.getStatus(listing.ticketId) == uint8(Status.Upcoming), "event not upcoming");

        _executeSale(listing, msg.sender, msg.value);
    }

    /// @notice Cancel a listing (same event semantics preserved: TicketListed with price=0).
    function cancelListing(uint256 tokenId) external {
        Listing storage listing = listings[tokenId];
        require(listing.active, "not listed");
        require(listing.seller == msg.sender, "not seller");

        listing.active = false;
        emit TicketListed(tokenId, listing.ticketId, msg.sender, 0); // price=0 => cancellation signal
    }

    // ---- Internal ----

    /// @dev Reduced parameters to avoid stack pressure; derives tokenId from the listing itself.
    function _executeSale(
        Listing storage listing,
        address buyer,
        uint256 totalValue
    ) internal {
        // Effects
        listing.active = false;

        uint256 price = listing.price;
        uint256 royaltyAmount = (price * royaltyBps) / 10_000;
        uint256 sellerAmount = price - royaltyAmount;

        // Interactions
        ticketNft.safeTransferFrom(listing.seller, buyer, listing.tokenId);

        if (royaltyAmount > 0) {
            (bool royaltyOk, ) = feeRecipient.call{value: royaltyAmount}("");
            require(royaltyOk, "royalty transfer failed");
        }
        if (sellerAmount > 0) {
            (bool sellerOk, ) = payable(listing.seller).call{value: sellerAmount}("");
            require(sellerOk, "seller transfer failed");
        }

        // Refund excess if any
        if (totalValue > price) {
            (bool refundOk, ) = payable(buyer).call{value: totalValue - price}("");
            require(refundOk, "refund failed");
        }

        emit TicketSold(
            listing.tokenId,
            listing.ticketId,
            listing.seller,
            buyer,
            price,
            royaltyAmount
        );
    }

    // ---- Views ----
    function getListing(uint256 tokenId)
        external
        view
        returns (uint256, uint256, address, uint256, bool)
    {
        Listing memory l = listings[tokenId];
        return (l.ticketId, l.tokenId, l.seller, l.price, l.active);
    }

    // ---- Safety ----
    receive() external payable {
        revert("send CELO via buyTicket()");
    }
    fallback() external payable {
        revert("invalid call");
    }
}
