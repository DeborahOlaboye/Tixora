// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./library/EventTicketingLib.sol";

interface ITicketNft {
    function mintForRegistrant(address to, uint256 ticketId, string memory eventName, string memory description, uint256 eventTimestamp, string memory location) external returns (uint256);
}

contract EventTicketing is Ownable, ReentrancyGuard {
    using EventTicketingLib for *;

    // ---- Types ----
    enum Status { Upcoming, Passed, Canceled, Closed }


    ITicketNft public ticketNft;

    mapping(uint256 => EventTicketingLib.Ticket) public tickets;
    mapping(uint256 => address[]) private registrants;
    mapping(uint256 => mapping(address => bool)) public isRegistered;
    mapping(uint256 => mapping(address => uint256)) public paidAmount;

    uint256 private _ticketIds;
    uint16 public platformFeeBps;
    address payable public feeRecipient;

    event TicketCreated(uint256 indexed ticketId, address indexed creator, uint256 price, string eventName, string description, uint256 eventTimestamp, uint256 maxSupply);
    event Registered(uint256 indexed ticketId, address indexed registrant, uint256 nftTokenId);
    event TicketUpdated(uint256 indexed ticketId, uint256 newPrice, uint256 newTimestamp, string newLocation);
    event TicketClosed(uint256 indexed ticketId, address indexed closedBy);
    event TicketCanceled(uint256 indexed ticketId, address indexed canceledBy);
    event RefundClaimed(uint256 indexed ticketId, address indexed user, uint256 amount);
    event ProceedsWithdrawn(uint256 indexed ticketId, address indexed creator, uint256 creatorAmount, uint256 feeAmount);
    event MaxSupplyUpdated(uint256 indexed ticketId, uint256 newMaxSupply);
    event ServiceFeeUpdated(uint16 newFeeBps);
    event FeeRecipientUpdated(address indexed newRecipient);

    // ---- Constructor ----
    constructor(address ticketNftAddress, address payable feeRecipient_, uint16 feeBps) Ownable(msg.sender) {
        require(ticketNftAddress != address(0), "TicketNft address required");
        require(feeRecipient_ != address(0), "feeRecipient required");
        require(feeBps <= 10_000, "fee too high");
        ticketNft = ITicketNft(ticketNftAddress);
        feeRecipient = feeRecipient_;
        platformFeeBps = feeBps;
    }

    // ---- Admin ----
    function setTicketNft(address ticketNftAddress) external onlyOwner {
        require(ticketNftAddress != address(0), "zero addr");
        ticketNft = ITicketNft(ticketNftAddress);
    }

    function setServiceFee(uint16 feeBps) external onlyOwner {
        require(feeBps <= 10_000, "fee too high");
        platformFeeBps = feeBps;
        emit ServiceFeeUpdated(feeBps);
    }

    function setFeeRecipient(address payable newRecipient) external onlyOwner {
        require(newRecipient != address(0), "zero addr");
        feeRecipient = newRecipient;
        emit FeeRecipientUpdated(newRecipient);
    }

    // ---- Ticket Lifecycle ----
    function createTicket(
        uint256 price,
        string calldata eventName,
        string calldata description,
        uint256 eventTimestamp,
        uint256 maxSupply,
        string calldata metadata,
        string calldata location
    ) external returns (uint256) {
        require(eventTimestamp > block.timestamp, "eventTimestamp must be future");
        require(maxSupply > 0, "maxSupply must be > 0");
        require(bytes(eventName).length > 0, "eventName required");
        require(bytes(description).length > 0, "description required");

        _ticketIds++;
        uint256 newId = _ticketIds;

        _createTicket(newId, price, eventName, description, eventTimestamp, maxSupply, metadata, location);

        emit TicketCreated(newId, msg.sender, price, eventName, description, eventTimestamp, maxSupply);
        return newId;
    }

    function _createTicket(
        uint256 newId,
        uint256 price,
        string memory eventName,
        string memory description,
        uint256 eventTimestamp,
        uint256 maxSupply,
        string memory metadata,
        string memory location
    ) internal {
        tickets[newId] = EventTicketingLib.Ticket({
            id: newId,
            creator: payable(msg.sender),
            price: price,
            eventName: eventName,
            description: description,
            eventTimestamp: eventTimestamp,
            location: location,
            closed: false,
            canceled: false,
            metadata: metadata,
            maxSupply: maxSupply,
            sold: 0,
            totalCollected: 0,
            totalRefunded: 0,
            proceedsWithdrawn: false
        });
    }

    function register(uint256 ticketId) external payable nonReentrant returns (uint256) {
        EventTicketingLib.Ticket storage t = tickets[ticketId];
        require(t.id != 0, "ticket not found");
        require(!t.closed, "ticket closed");
        require(!t.canceled, "ticket canceled");
        require(block.timestamp < t.eventTimestamp, "event passed");
        require(!isRegistered[ticketId][msg.sender], "already registered");
        require(t.sold < t.maxSupply, "sold out");
        require(msg.value == t.price, "incorrect CELO amount");

        EventTicketingLib.escrowFunds(paidAmount, tickets, ticketId, msg.value);
        EventTicketingLib.recordRegistration(registrants, isRegistered, ticketId, msg.sender);
        uint256 nftTokenId = _mintNFT(msg.sender, ticketId, t.eventName, t.description, t.eventTimestamp, t.location);

        emit Registered(ticketId, msg.sender, nftTokenId);
        return nftTokenId;
    }

    function _mintNFT(address to, uint256 ticketId, string memory eventName, string memory description, uint256 eventTimestamp, string memory location) internal returns (uint256) {
        return ticketNft.mintForRegistrant(to, ticketId, eventName, description, eventTimestamp, location);
    }

    function updateTicket(
        uint256 ticketId,
        uint256 newPrice,
        string calldata newLocation,
        uint256 newEventTimestamp
    ) external {
        EventTicketingLib.Ticket storage t = tickets[ticketId];
        require(t.id != 0, "ticket not found");
        require(msg.sender == t.creator, "only creator");
        require(!t.canceled, "ticket canceled");
        require(!t.closed, "ticket closed");
        require(block.timestamp < t.eventTimestamp, "event started");
        require(newEventTimestamp > block.timestamp, "must be future");
        require(newPrice > 0, "price must be > 0");
        require(bytes(newLocation).length > 0, "description required");

        EventTicketingLib.updateTicketDetails(t, newPrice, newLocation, newEventTimestamp);

        emit TicketUpdated(ticketId, newPrice, newEventTimestamp, newLocation);
    }

    function updateMaxSupply(uint256 ticketId, uint256 newMaxSupply) external {
        EventTicketingLib.Ticket storage t = tickets[ticketId];
        require(t.id != 0, "ticket not found");
        require(msg.sender == t.creator, "only creator");
        require(!t.canceled, "ticket canceled");
        require(!t.closed, "ticket closed");
        require(newMaxSupply >= t.sold, "below sold");
        require(newMaxSupply > 0, "zero max");

        t.maxSupply = newMaxSupply;
        emit MaxSupplyUpdated(ticketId, newMaxSupply);
    }

    function closeTicket(uint256 ticketId) external {
        EventTicketingLib.Ticket storage t = tickets[ticketId];
        require(t.id != 0, "ticket not found");
        require(msg.sender == t.creator || msg.sender == owner(), "not authorized");
        require(!t.closed, "already closed");
        require(!t.canceled, "ticket canceled");
        t.closed = true;
        emit TicketClosed(ticketId, msg.sender);
    }

    function cancelTicket(uint256 ticketId) external nonReentrant {
        EventTicketingLib.Ticket storage t = tickets[ticketId];
        require(t.id != 0, "ticket not found");
        require(msg.sender == t.creator || msg.sender == owner(), "not authorized");
        require(!t.canceled, "already canceled");

        t.canceled = true;
        t.closed = true;
        emit TicketCanceled(ticketId, msg.sender);

        // Automatically refund all registrants
        address[] memory regs = registrants[ticketId];
        for (uint256 i = 0; i < regs.length; i++) {
            address payable refundee = payable(regs[i]);
            uint256 amt = paidAmount[ticketId][refundee];
            if (amt > 0) {
                EventTicketingLib.processRefund(paidAmount, tickets, ticketId, refundee, amt);
                emit RefundClaimed(ticketId, refundee, amt);
            }
        }
    }

    // ---- Settlement ----
    function withdrawProceeds(uint256 ticketId) external nonReentrant {
        EventTicketingLib.Ticket storage t = tickets[ticketId];
        require(t.id != 0, "ticket not found");
        require(msg.sender == t.creator, "only creator");
        require(!t.canceled, "ticket canceled");
        require(block.timestamp >= t.eventTimestamp, "event not passed");
        require(!t.proceedsWithdrawn, "already withdrawn");

        _settleProceeds(ticketId, t);
    }

    /// @notice Anyone can call to settle proceeds once event has passed and not canceled
    function finalizeEvent(uint256 ticketId) external nonReentrant {
        EventTicketingLib.Ticket storage t = tickets[ticketId];
        require(t.id != 0, "ticket not found");
        require(!t.canceled, "ticket canceled");
        require(block.timestamp >= t.eventTimestamp, "event not passed");
        require(!t.proceedsWithdrawn, "already withdrawn");

        _settleProceeds(ticketId, t);
    }

    function _settleProceeds(uint256 ticketId, EventTicketingLib.Ticket storage t) internal {
        uint256 net = EventTicketingLib.calculateNetAmount(t);
        uint256 fee = EventTicketingLib.calculateFee(net, platformFeeBps);
        uint256 toCreator = net - fee;

        t.proceedsWithdrawn = true;

        EventTicketingLib.transferFee(feeRecipient, fee);
        EventTicketingLib.transferToCreator(t.creator, toCreator);

        emit ProceedsWithdrawn(ticketId, t.creator, toCreator, fee);
    }

    function claimRefund(uint256 ticketId) external nonReentrant {
        EventTicketingLib.Ticket storage t = tickets[ticketId];
        require(t.id != 0, "ticket not found");
        require(t.canceled, "not canceled");

        uint256 amt = paidAmount[ticketId][msg.sender];
        require(amt > 0, "nothing to refund");

        EventTicketingLib.processRefund(paidAmount, tickets, ticketId, payable(msg.sender), amt);

        emit RefundClaimed(ticketId, msg.sender, amt);
    }

    // ---- Views ----
    function isAvailable(uint256 ticketId) public view returns (bool) {
        EventTicketingLib.Ticket storage t = tickets[ticketId];
        if (t.id == 0 || t.closed || t.canceled || block.timestamp >= t.eventTimestamp) return false;
        if (t.sold >= t.maxSupply) return false;
        return true;
    }

    function ticketsLeft(uint256 ticketId) external view returns (uint256) {
        EventTicketingLib.Ticket storage t = tickets[ticketId];
        if (t.id == 0) return 0;
        if (t.sold >= t.maxSupply) return 0;
        return t.maxSupply - t.sold;
    }

    function getRegistrants(uint256 ticketId) external view returns (address[] memory) {
        return registrants[ticketId];
    }

    function getStatus(uint256 ticketId) public view returns (Status) {
        EventTicketingLib.Ticket storage t = tickets[ticketId];
        if (t.id == 0) revert("ticket not found");
        if (t.canceled) return Status.Canceled;
        if (t.closed) {
            if (block.timestamp < t.eventTimestamp) return Status.Closed;
        }
        if (block.timestamp >= t.eventTimestamp) return Status.Passed;
        return Status.Upcoming;
    }

    /// @notice Get the most recent tickets (max 100) to prevent gas limit issues
    function getRecentTickets() external view returns (EventTicketingLib.Ticket[] memory) {
        uint256 totalTickets = _ticketIds;
        if (totalTickets == 0) {
            return new EventTicketingLib.Ticket[](0);
        }
        
        // Return last 100 tickets or all tickets if less than 100
        uint256 limit = totalTickets > 100 ? 100 : totalTickets;
        uint256 startIndex = totalTickets > 100 ? totalTickets - 100 + 1 : 1;
        
        EventTicketingLib.Ticket[] memory recentTickets = new EventTicketingLib.Ticket[](limit);
        
        for (uint256 i = 0; i < limit; i++) {
            recentTickets[i] = tickets[startIndex + i];
        }
        
        return recentTickets;
    }

    /// @notice Get total number of tickets created
    function getTotalTickets() external view returns (uint256) {
        return _ticketIds;
    }

    // ---- Safety ----
    receive() external payable {
        revert("send CELO via register()");
    }
    fallback() external payable {
        revert("invalid call");
    }
}