import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Debug EventTicketing", function () {
  async function deployFixture() {
    const [owner, creator, user] = await hre.ethers.getSigners();

    const TicketNft = await hre.ethers.getContractFactory("TicketNft");
    const nft = await TicketNft.deploy("TicketNFT", "TNFT", "https://example.com/ticket-image.png");
    await nft.waitForDeployment();

    const EventTicketing = await hre.ethers.getContractFactory("EventTicketing");
    const sale = await EventTicketing.deploy(nft.target, "0x6Cac76f9e8d6F55b3823D8aEADEad970a5441b67", 250);
    await sale.waitForDeployment();

    // allow sale contract to mint
    await nft.connect(owner).setMinter(sale.target);

    return { nft, sale, owner, creator, user };
  }

  it("should create a ticket and return correct ticket ID", async () => {
    const { sale, creator } = await loadFixture(deployFixture);

    const now = (await hre.ethers.provider.getBlock("latest"))!.timestamp;
    const price = hre.ethers.parseEther("0.5");

    console.log("Creating ticket...");
    
    // Call createTicket and get the transaction
    const tx = await sale.connect(creator).createTicket(
      price, 
      "Test Event", 
      "Test Description", 
      now + 3600, 
      20, 
      "metadata", 
      "Test Location"
    );

    console.log("Transaction hash:", tx.hash);
    
    // Wait for transaction receipt
    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt?.blockNumber);

    // Check for TicketCreated event
    const events = receipt?.logs;
    console.log("Number of events:", events?.length);
    
    if (events && events.length > 0) {
      console.log("Events:", events);
    }

    // Get the ticket ID from the event
    const ticketCreatedEvent = receipt?.logs.find(log => {
      try {
        const parsed = sale.interface.parseLog({
          topics: log.topics,
          data: log.data
        } as any);
        return parsed?.name === "TicketCreated";
      } catch {
        return false;
      }
    });

    if (ticketCreatedEvent) {
      const parsed = sale.interface.parseLog({
        topics: ticketCreatedEvent.topics,
        data: ticketCreatedEvent.data
      } as any);
      console.log("TicketCreated event:", parsed?.args);
      const ticketId = parsed?.args[0];
      console.log("Ticket ID from event:", ticketId.toString());

      // Verify the ticket was created
      const ticket = await sale.tickets(ticketId);
      console.log("Ticket data:", ticket);
      
      expect(ticket.id).to.equal(ticketId);
      expect(ticket.creator).to.equal(creator.address);
      expect(ticket.price).to.equal(price);
    } else {
      console.log("TicketCreated event not found");
    }

    // Check total tickets
    const totalTickets = await sale.getTotalTickets();
    console.log("Total tickets:", totalTickets.toString());
    expect(totalTickets).to.equal(1n);
  });

  it("should register for a ticket successfully", async () => {
    const { sale, creator, user } = await loadFixture(deployFixture);

    const now = (await hre.ethers.provider.getBlock("latest"))!.timestamp;
    const price = hre.ethers.parseEther("0.5");

    // Create a ticket first
    const createTx = await sale.connect(creator).createTicket(
      price, 
      "Test Event", 
      "Test Description", 
      now + 3600, 
      20, 
      "metadata", 
      "Test Location"
    );
    await createTx.wait();

    console.log("Ticket created, now registering...");

    // Register for the ticket
    const registerTx = await sale.connect(user).register(1, { value: price });
    const registerReceipt = await registerTx.wait();

    console.log("Registration transaction confirmed");

    // Check for Registered event
    const registeredEvent = registerReceipt?.logs.find(log => {
      try {
        const parsed = sale.interface.parseLog({
          topics: log.topics,
          data: log.data
        } as any);
        return parsed?.name === "Registered";
      } catch {
        return false;
      }
    });

    if (registeredEvent) {
      const parsed = sale.interface.parseLog({
        topics: registeredEvent.topics,
        data: registeredEvent.data
      } as any);
      console.log("Registered event:", parsed?.args);
      
      const ticketId = parsed?.args[0];
      const registrant = parsed?.args[1];
      const nftTokenId = parsed?.args[2];

      expect(ticketId).to.equal(1n);
      expect(registrant).to.equal(user.address);
      console.log("NFT Token ID:", nftTokenId.toString());
    }

    // Check if user is registered
    const isRegistered = await sale.isRegistered(1, user.address);
    console.log("User is registered:", isRegistered);
    expect(isRegistered).to.be.true;

    // Check ticket sold count
    const ticket = await sale.tickets(1);
    console.log("Tickets sold:", ticket.sold.toString());
    expect(ticket.sold).to.equal(1n);
  });

  it("should fail with invalid parameters", async () => {
    const { sale, creator } = await loadFixture(deployFixture);

    const now = (await hre.ethers.provider.getBlock("latest"))!.timestamp;
    const price = hre.ethers.parseEther("0.5");

    // Test past timestamp
    await expect(
      sale.connect(creator).createTicket(
        price, 
        "Test Event", 
        "Test Description", 
        now - 3600, // Past timestamp
        20, 
        "metadata", 
        "Test Location"
      )
    ).to.be.revertedWith("eventTimestamp must be future");

    // Test zero max supply
    await expect(
      sale.connect(creator).createTicket(
        price, 
        "Test Event", 
        "Test Description", 
        now + 3600, 
        0, // Zero max supply
        "metadata", 
        "Test Location"
      )
    ).to.be.revertedWith("maxSupply must be > 0");

    // Test empty event name
    await expect(
      sale.connect(creator).createTicket(
        price, 
        "", // Empty event name
        "Test Description", 
        now + 3600, 
        20, 
        "metadata", 
        "Test Location"
      )
    ).to.be.revertedWith("eventName required");

    // Test empty description
    await expect(
      sale.connect(creator).createTicket(
        price, 
        "Test Event", 
        "", // Empty description
        now + 3600, 
        20, 
        "metadata", 
        "Test Location"
      )
    ).to.be.revertedWith("description required");
  });
});
