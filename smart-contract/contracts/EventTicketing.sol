// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface ITicketNft {
    function mintForRegistrant(address to, uint256 ticketId, string memory eventName, string memory description) external returns (uint256);
}

contract EventTicketing is Ownable, ReentrancyGuard {
    // ---- Types ----
    enum Status { Upcoming, Passed, Canceled, Closed }

    struct Ticket {
        uint256 id;
        address payable creator;
        uint256 price;
        string eventName; 
        string description;
        uint256 eventTimestamp;
        string location;
        bool closed; 
        bool canceled;
        string metadata;
        uint256 maxSupply;
        uint256 sold;               // number sold
        uint256 totalCollected;     // sum of all payments in
        uint256 totalRefunded;      // sum of all refunds out
        bool proceedsWithdrawn;     // creator has withdrawn net proceeds
    }

    ITicketNft public ticketNft;

    mapping(uint256 => Ticket) public tickets;
    mapping(uint256 => address[]) private registrants;
    mapping(uint256 => mapping(address => bool)) public isRegistered;
    mapping(uint256 => mapping(address => uint256)) public paidAmount;

    uint256 private _ticketIds;
    uint16 public platformFeeBps;               // 0..10000
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

    /// @notice Create a ticket payable with native CELO.
    function createTicket(
        uint256 price,                 // in wei
        string calldata eventName,     // event name
        string calldata description,   // event description
        uint256 eventTimestamp,        // unix seconds
        uint256 maxSupply,             // supply cap
        string calldata metadata,
        string calldata location
    ) external returns (uint256) {
        require(eventTimestamp > block.timestamp, "eventTimestamp must be future");
        require(maxSupply > 0, "maxSupply must be > 0");
        require(bytes(eventName).length > 0, "eventName required");
        require(bytes(description).length > 0, "description required");

        _ticketIds++;
        uint256 newId = _ticketIds;

        tickets[newId] = Ticket({
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

        emit TicketCreated(newId, msg.sender, price, eventName, description, eventTimestamp, maxSupply);
        return newId;
    }

    /// @notice Buy/register a ticket by sending exact CELO (escrowed until settlement).
    function register(uint256 ticketId) external payable nonReentrant returns (uint256) {
        Ticket storage t = tickets[ticketId];
        require(t.id != 0, "ticket not found");
        require(!t.closed, "ticket closed");
        require(!t.canceled, "ticket canceled");
        require(block.timestamp < t.eventTimestamp, "event passed");
        require(!isRegistered[ticketId][msg.sender], "already registered");
        require(t.sold < t.maxSupply, "sold out");
        require(msg.value == t.price, "incorrect CELO amount");

        // Escrow funds in this contract
        paidAmount[ticketId][msg.sender] = msg.value;
        t.totalCollected += msg.value;
        t.sold += 1;

        // Record registration
        registrants[ticketId].push(msg.sender);
        isRegistered[ticketId][msg.sender] = true;

        // Mint NFT to registrant with event name and description
        uint256 nftTokenId = ticketNft.mintForRegistrant(msg.sender, ticketId, t.eventName, t.description);

        emit Registered(ticketId, msg.sender, nftTokenId);
        return nftTokenId;
    }

    /// @notice Update price, timestamp, name, and description (only creator; before event starts; not canceled/closed).
    function updateTicket(
        uint256 ticketId,
        uint256 newPrice,
        string calldata newLocation,
        uint256 newEventTimestamp
    ) external {
        Ticket storage t = tickets[ticketId];
        require(t.id != 0, "ticket not found");
        require(msg.sender == t.creator, "only creator");
        require(!t.canceled, "ticket canceled");
        require(!t.closed, "ticket closed");
        require(block.timestamp < t.eventTimestamp, "event started");
        require(newEventTimestamp > block.timestamp, "must be future");
        require(newPrice > 0, "price must be > 0");
        require(bytes(newLocation).length > 0, "description required");

        t.price = newPrice;
        t.location = newLocation;
        t.eventTimestamp = newEventTimestamp;

        emit TicketUpdated(ticketId, newPrice, newEventTimestamp, newLocation);
    }

    /// @notice Update supply cap (cannot go below already sold).
    function updateMaxSupply(uint256 ticketId, uint256 newMaxSupply) external {
        Ticket storage t = tickets[ticketId];
        require(t.id != 0, "ticket not found");
        require(msg.sender == t.creator, "only creator");
        require(!t.canceled, "ticket canceled");
        require(!t.closed, "ticket closed");
        require(newMaxSupply >= t.sold, "below sold");
        require(newMaxSupply > 0, "zero max");

        t.maxSupply = newMaxSupply;
        emit MaxSupplyUpdated(ticketId, newMaxSupply);
    }

    /// @notice Close ticket sales (not canceled). Still allows settlement later.
    function closeTicket(uint256 ticketId) external {
        Ticket storage t = tickets[ticketId];
        require(t.id != 0, "ticket not found");
        require(msg.sender == t.creator || msg.sender == owner(), "not authorized");
        require(!t.closed, "already closed");
        require(!t.canceled, "ticket canceled");
        t.closed = true;
        emit TicketClosed(ticketId, msg.sender);
    }

    /// @notice Cancel ticket (enables refunds). Sales are implicitly closed.
    function cancelTicket(uint256 ticketId) external {
        Ticket storage t = tickets[ticketId];
        require(t.id != 0, "ticket not found");
        require(msg.sender == t.creator || msg.sender == owner(), "not authorized");
        require(!t.canceled, "already canceled");

        t.canceled = true;
        t.closed = true;
        emit TicketCanceled(ticketId, msg.sender);
    }

    // ---- Settlement ----

    /// @notice Creator withdraws net proceeds after event passes and if not canceled.
    function withdrawProceeds(uint256 ticketId) external nonReentrant {
        Ticket storage t = tickets[ticketId];
        require(t.id != 0, "ticket not found");
        require(msg.sender == t.creator, "only creator");
        require(!t.canceled, "ticket canceled");
        require(block.timestamp >= t.eventTimestamp, "event not passed");
        require(!t.proceedsWithdrawn, "already withdrawn");

        uint256 net = t.totalCollected - t.totalRefunded; // what remains in escrow for this ticket
        uint256 fee = (net * platformFeeBps) / 10_000;
        uint256 toCreator = net - fee;

        t.proceedsWithdrawn = true;

        if (fee > 0) {
            (bool feeOk, ) = feeRecipient.call{value: fee}("");
            require(feeOk, "fee transfer failed");
        }
        if (toCreator > 0) {
            (bool ok, ) = t.creator.call{value: toCreator}("");
            require(ok, "creator transfer failed");
        }

        emit ProceedsWithdrawn(ticketId, t.creator, toCreator, fee);
    }

    /// @notice Registrant claims refund after cancellation.
    function claimRefund(uint256 ticketId) external nonReentrant {
        Ticket storage t = tickets[ticketId];
        require(t.id != 0, "ticket not found");
        require(t.canceled, "not canceled");

        uint256 amt = paidAmount[ticketId][msg.sender];
        require(amt > 0, "nothing to refund");

        // effects
        paidAmount[ticketId][msg.sender] = 0;
        t.totalRefunded += amt;

        // interaction
        (bool ok, ) = payable(msg.sender).call{value: amt}("");
        require(ok, "refund transfer failed");

        emit RefundClaimed(ticketId, msg.sender, amt);
    }

    // ---- Views ----

    function isAvailable(uint256 ticketId) public view returns (bool) {
        Ticket storage t = tickets[ticketId];
        if (t.id == 0 || t.closed || t.canceled || block.timestamp >= t.eventTimestamp) return false;
        if (t.sold >= t.maxSupply) return false;
        return true;
    }

    function ticketsLeft(uint256 ticketId) external view returns (uint256) {
        Ticket storage t = tickets[ticketId];
        if (t.id == 0) return 0;
        if (t.sold >= t.maxSupply) return 0;
        return t.maxSupply - t.sold;
    }

    function getRegistrants(uint256 ticketId) external view returns (address[] memory) {
        return registrants[ticketId];
    }

    function getStatus(uint256 ticketId) public view returns (Status) {
        Ticket storage t = tickets[ticketId];
        if (t.id == 0) revert("ticket not found");
        if (t.canceled) return Status.Canceled;
        if (t.closed) {
            // closed before event time
            if (block.timestamp < t.eventTimestamp) return Status.Closed;
        }
        if (block.timestamp >= t.eventTimestamp) return Status.Passed;
        return Status.Upcoming;
    }

    function getAllTickets() external view returns (Ticket[] memory) {
        Ticket[] memory allTickets = new Ticket[](_ticketIds);
        for (uint256 i = 1; i <= _ticketIds; i++) {
            allTickets[i - 1] = tickets[i];
        }
        return allTickets;
    }

    // function updateTicketNftImageUri(string memory newImageUri) external onlyOwner {
    //     require(bytes(newImageUri).length > 0, "imageUri required");
    //     ticketNft.setImageUri(newImageUri); // Requires adding setImageUri to TicketNft
    // }

    // ---- Safety ----
    receive() external payable {
        revert("send CELO via register()");
    }
    fallback() external payable {
        revert("invalid call");
    }
}