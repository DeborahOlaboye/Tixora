// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ITicketNft {
    function mintForRegistrant(address to, uint256 ticketId) external returns (uint256);
}

contract EventTicketing is Ownable {
    using SafeERC20 for IERC20;

    uint256 public ticketPrice;
    uint256 private _ticketIds; // Replaced Counters with uint256

    struct Ticket {
        uint256 id;
        address creator;
        IERC20 paymentToken;
        uint256 price;
        uint256 eventTimestamp;
        bool closed;
        string metadata;
    }

    mapping(uint256 => Ticket) public tickets;
    mapping(uint256 => address[]) private registrants;
    mapping(uint256 => mapping(address => bool)) public isRegistered;

    ITicketNft public ticketNft;

    event TicketCreated(uint256 indexed ticketId, address indexed creator, uint256 price, uint256 eventTimestamp);
    event Registered(uint256 indexed ticketId, address indexed registrant, uint256 nftTokenId);
    event TicketUpdated(uint256 indexed ticketId, uint256 newPrice, uint256 newTimestamp);
    event TicketClosed(uint256 indexed ticketId, address indexed closedBy);

    constructor(address ticketNftAddress) Ownable(msg.sender) {
        require(ticketNftAddress != address(0), "TicketNft address required");
        ticketNft = ITicketNft(ticketNftAddress);
    }

    function createTicket(
        IERC20 paymentToken,
        uint256 price,
        uint256 eventTimestamp,
        string calldata metadata
    ) external returns (uint256) {
        require(eventTimestamp > block.timestamp, "eventTimestamp must be future");
        require(price > 0, "price must be > 0");

        _ticketIds++; // Increment counter
        uint256 newId = _ticketIds;

        tickets[newId] = Ticket({
            id: newId,
            creator: msg.sender,
            paymentToken: paymentToken,
            price: price,
            eventTimestamp: eventTimestamp,
            closed: false,
            metadata: metadata
        });

        emit TicketCreated(newId, msg.sender, price, eventTimestamp);
        return newId;
    }

    function register(uint256 ticketId) 
        external 
        // nonReentrant 
        returns (uint256) {
            Ticket storage t = tickets[ticketId];
            require(t.id != 0, "ticket not found");
            require(!t.closed, "ticket closed");
            require(block.timestamp < t.eventTimestamp, "event passed");
            require(!isRegistered[ticketId][msg.sender], "already registered");

            t.paymentToken.safeTransferFrom(msg.sender, t.creator, t.price);

            registrants[ticketId].push(msg.sender);
            isRegistered[ticketId][msg.sender] = true;

            uint256 nftTokenId = ticketNft.mintForRegistrant(msg.sender, ticketId);

            emit Registered(ticketId, msg.sender, nftTokenId);
            return nftTokenId;
}

    function updateTicket(uint256 ticketId, uint256 newPrice, uint256 newEventTimestamp) external {
        Ticket storage t = tickets[ticketId];
        require(t.id != 0, "ticket not found");
        require(msg.sender == t.creator, "only creator");
        require(block.timestamp < t.eventTimestamp, "event started");
        require(!t.closed, "ticket closed");
        require(newEventTimestamp > block.timestamp, "must be future");
        require(newPrice > 0, "price must be > 0");

        t.price = newPrice;
        t.eventTimestamp = newEventTimestamp;

        emit TicketUpdated(ticketId, newPrice, newEventTimestamp);
    }

    function closeTicket(uint256 ticketId) external {
        Ticket storage t = tickets[ticketId];
        require(t.id != 0, "ticket not found");
        require(msg.sender == t.creator || msg.sender == owner(), "not authorized");
        require(!t.closed, "already closed");

        t.closed = true;
        emit TicketClosed(ticketId, msg.sender);
    }

    function isAvailable(uint256 ticketId) public view returns (bool) {
        Ticket storage t = tickets[ticketId];
        if (t.id == 0 || t.closed || block.timestamp >= t.eventTimestamp) return false;
        return true;
    }

    function getRegistrants(uint256 ticketId) external view returns (address[] memory) {
        return registrants[ticketId];
    }

    function setTicketNft(address ticketNftAddress) external onlyOwner {
        require(ticketNftAddress != address(0), "zero addr");
        ticketNft = ITicketNft(ticketNftAddress);
    }
}