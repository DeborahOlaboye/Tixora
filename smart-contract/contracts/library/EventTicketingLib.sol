// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library EventTicketingLib {
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
        uint256 sold;
        uint256 totalCollected;
        uint256 totalRefunded;
        bool proceedsWithdrawn;
    }

    function escrowFunds(
        mapping(uint256 => mapping(address => uint256)) storage paidAmount,
        mapping(uint256 => Ticket) storage tickets,
        uint256 ticketId,
        uint256 amount
    ) internal {
        paidAmount[ticketId][msg.sender] = amount;
        tickets[ticketId].totalCollected += amount;
        tickets[ticketId].sold += 1;
    }

    function recordRegistration(
        mapping(uint256 => address[]) storage registrants,
        mapping(uint256 => mapping(address => bool)) storage isRegistered,
        uint256 ticketId,
        address registrant
    ) internal {
        registrants[ticketId].push(registrant);
        isRegistered[ticketId][registrant] = true;
    }

    function updateTicketDetails(
        Ticket storage t,
        uint256 newPrice,
        string memory newLocation,
        uint256 newEventTimestamp
    ) internal {
        t.price = newPrice;
        t.location = newLocation;
        t.eventTimestamp = newEventTimestamp;
    }

    function calculateNetAmount(Ticket storage t) internal view returns (uint256) {
        return t.totalCollected - t.totalRefunded;
    }

    function calculateFee(uint256 net, uint16 platformFeeBps) internal pure returns (uint256) {
        return (net * platformFeeBps) / 10_000;
    }

    function transferFee(address payable feeRecipient, uint256 fee) internal {
        if (fee > 0) {
            (bool feeOk, ) = feeRecipient.call{value: fee}("");
            require(feeOk, "fee transfer failed");
        }
    }

    function transferToCreator(address payable creator, uint256 amount) internal {
        if (amount > 0) {
            (bool ok, ) = creator.call{value: amount}("");
            require(ok, "creator transfer failed");
        }
    }

    function processRefund(
        mapping(uint256 => mapping(address => uint256)) storage paidAmount,
        mapping(uint256 => Ticket) storage tickets,
        uint256 ticketId,
        address payable refundee,
        uint256 amount
    ) internal {
        paidAmount[ticketId][refundee] = 0;
        tickets[ticketId].totalRefunded += amount;

        (bool ok, ) = refundee.call{value: amount}("");
        require(ok, "refund transfer failed");
    }
}