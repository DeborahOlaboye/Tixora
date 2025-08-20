# CRITICAL SECURITY FIXES REQUIRED

## 1. Fix TicketNft Access Control

```solidity
// In TicketNft.sol, add onlyMinter modifier:
function mintForRegistrant(
    address to,
    uint256 ticketId,
    string memory eventName,
    string memory description,
    uint256 eventTimestamp,
    string memory location
) external onlyMinter returns (uint256) { // ✅ ADD onlyMinter
    require(to != address(0), "zero address");
    _tokenIds++;
    uint256 newTokenId = _tokenIds;
    _safeMint(to, newTokenId);
    ticketOfToken[newTokenId] = ticketId;
    eventNameOfToken[newTokenId] = eventName;
    descriptionOfToken[newTokenId] = description;
    eventTimestampOfToken[newTokenId] = eventTimestamp;
    locationOfToken[newTokenId] = location;
    emit TicketMinted(to, newTokenId, ticketId);
    return newTokenId;
}
```

## 2. Fix TicketResaleMarket Access Control

```solidity
// Add owner state variable and modifier
address public owner;

modifier onlyOwner() {
    require(msg.sender == owner, "not owner");
    _;
}

constructor(
    address eventTicketingAddress,
    address ticketNftAddress,
    address payable feeRecipient_,
    uint16 royaltyBps_
) ReentrancyGuard() {
    owner = msg.sender; // ✅ ADD THIS
    require(eventTicketingAddress != address(0), "EventTicketing address required");
    require(ticketNftAddress != address(0), "TicketNft address required");
    require(feeRecipient_ != address(0), "feeRecipient required");
    require(royaltyBps_ <= 10_000, "royalty too high");

    eventTicketing = IEventTicketing(eventTicketingAddress);
    ticketNft = IERC721(ticketNftAddress);
    feeRecipient = feeRecipient_;
    royaltyBps = royaltyBps_;
}

// ✅ ADD onlyOwner to admin functions
function setRoyalty(uint16 newRoyaltyBps) external onlyOwner {
    require(newRoyaltyBps <= 10_000, "royalty too high");
    royaltyBps = newRoyaltyBps;
    emit RoyaltyUpdated(newRoyaltyBps);
}

function setFeeRecipient(address payable newRecipient) external onlyOwner {
    require(newRecipient != address(0), "zero addr");
    feeRecipient = newRecipient;
    emit FeeRecipientUpdated(newRecipient);
}
```

## 3. Enable Price Validation

```solidity
// In TicketResaleMarket.sol listTicket function:
function listTicket(uint256 tokenId, uint256 price) external {
    require(price > 0, "price must be > 0"); // ✅ UNCOMMENT THIS
    require(ticketNft.ownerOf(tokenId) == msg.sender, "not owner");
    // ... rest of function
}
```

## 4. Fix Test Deployment

```typescript
// In test/EventTicketing.ts:
const TicketNft = await hre.ethers.getContractFactory("TicketNft");
const nft = await TicketNft.deploy(
  "TicketNFT", 
  "TNFT",
  "https://example.com/ticket-image.png" // ✅ ADD imageUri
);
```

## 5. Additional Security Recommendations

### Add Owner Transfer Functions to TicketResaleMarket:
```solidity
function transferOwnership(address newOwner) external onlyOwner {
    require(newOwner != address(0), "zero address");
    owner = newOwner;
}
```

### Consider Adding Price Limits:
```solidity
uint256 public maxPrice = 1000 ether; // Prevent ridiculous prices

function listTicket(uint256 tokenId, uint256 price) external {
    require(price > 0 && price <= maxPrice, "invalid price");
    // ... rest of function
}
```

### Gas Optimization for getAllTickets:
```solidity
// Add pagination to prevent gas limit issues
function getTickets(uint256 start, uint256 limit) external view returns (EventTicketingLib.Ticket[] memory) {
    uint256 end = start + limit;
    if (end > _ticketIds) end = _ticketIds;
    
    EventTicketingLib.Ticket[] memory result = new EventTicketingLib.Ticket[](end - start);
    for (uint256 i = start; i < end; i++) {
        result[i - start] = tickets[i + 1];
    }
    return result;
}
```

## DEPLOYMENT CHECKLIST:

- [x] Apply all security fixes above ✅ COMPLETED
- [x] Fix test constructor parameters ✅ COMPLETED
- [x] Fix TicketNft access control ✅ COMPLETED
- [x] Fix TicketResaleMarket access control ✅ COMPLETED
- [x] Enable price validation ✅ COMPLETED
- [x] Add gas optimization (getRecentTickets) ✅ COMPLETED
- [x] Add price limits ✅ COMPLETED
- [x] Compile successfully ✅ COMPLETED
- [ ] Run comprehensive tests including resale market
- [ ] Test with realistic gas limits
- [ ] Test edge cases (0 prices, max supply, etc.)
- [ ] Audit fee calculations
- [ ] Verify NFT metadata generation
- [ ] Test reentrancy scenarios
- [ ] Validate event emission

## ✅ FIXES APPLIED:

1. **TicketNft.sol**: Added `onlyMinter` modifier to `mintForRegistrant` function
2. **TicketResaleMarket.sol**: Added owner state, onlyOwner modifier, and protected admin functions
3. **TicketResaleMarket.sol**: Enabled price validation (price > 0 && price <= maxPrice)
4. **test/EventTicketing.ts**: Added missing imageUri parameter to constructor
5. **EventTicketing.sol**: Replaced getAllTickets with getRecentTickets (last 100 tickets)
6. **TicketResaleMarket.sol**: Added maxPrice limit (1000 CELO) and setMaxPrice admin function
7. **TicketResaleMarket.sol**: Added transferOwnership function
