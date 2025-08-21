import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("EventTicketing (native CELO)", function () {
  async function deployFixture() {
    const [owner, creator, user, user2] = await hre.ethers.getSigners();

    const TicketNft = await hre.ethers.getContractFactory("TicketNft");
    const nft = (await TicketNft.deploy("TicketNFT", "TNFT", "https://example.com/ticket-image.png")) as any;

    const EventTicketing = await hre.ethers.getContractFactory("EventTicketing");
    const sale = (await EventTicketing.deploy(nft.target, owner.address, 250)) as any;

    await nft.connect(owner).setMinter(sale.target);

    return { nft, sale, owner, creator, user, user2 };
  }

  async function createBasicTicket(sale: any, creator: any, overrides?: { price?: bigint; startIn?: number; maxSupply?: number; name?: string; desc?: string; location?: string; metadata?: string; }) {
    const now = (await hre.ethers.provider.getBlock("latest"))!.timestamp;
    const price = overrides?.price ?? hre.ethers.parseEther("1");
    const startIn = overrides?.startIn ?? 3600;
    const maxSupply = overrides?.maxSupply ?? 2;
    const name = overrides?.name ?? "Concert";
    const desc = overrides?.desc ?? "Great music";
    const location = overrides?.location ?? "Abuja";
    const metadata = overrides?.metadata ?? "meta";

    const tx = await sale.connect(creator).createTicket(price, name, desc, now + startIn, maxSupply, metadata, location);
    await tx.wait();
    const id = await sale.getTotalTickets();
    return { id, price, eventTimestamp: BigInt(now + startIn), maxSupply, name, desc, location, metadata };
  }

  it("deploys with correct params and minter", async () => {
    const { sale, nft, owner } = await loadFixture(deployFixture);
    expect(await sale.platformFeeBps()).to.equal(250);
    expect(await sale.feeRecipient()).to.equal(owner.address);
    expect(await sale.ticketNft()).to.equal(nft.target);
    expect(await nft.minter()).to.equal(sale.target);
  });

  it("creates a ticket and persists fields", async () => {
    const { sale, creator } = await loadFixture(deployFixture);
    const { id, price, eventTimestamp, maxSupply, name, desc, location } = await createBasicTicket(sale, creator);

    // Event emitted
    // We can check by querying recent tickets and matching last entry
    const t = await sale.tickets(id);
    expect(t.id).to.equal(id);
    expect(t.creator).to.equal(creator.address);
    expect(t.price).to.equal(price);
    expect(t.eventName).to.equal(name);
    expect(t.description).to.equal(desc);
    expect(t.eventTimestamp).to.equal(eventTimestamp);
    expect(t.location).to.equal(location);
    expect(t.maxSupply).to.equal(BigInt(maxSupply));
    expect(t.sold).to.equal(0n);
    expect(t.totalCollected).to.equal(0n);
  });

  it("registers with exact CELO, mints NFT and records registrant", async () => {
    const { sale, nft, creator, user } = await loadFixture(deployFixture);
    const { id, price, maxSupply } = await createBasicTicket(sale, creator, { maxSupply: 2 });

    await expect(sale.connect(user).register(id, { value: price }))
      .to.emit(sale, "Registered");

    // NFT minted to user with tokenId 1
    expect(await nft.ownerOf(1n)).to.equal(user.address);
    expect(await nft.ticketOfToken(1n)).to.equal(id);

    // State updated
    expect(await sale.isRegistered(id, user.address)).to.equal(true);
    expect(await sale.paidAmount(id, user.address)).to.equal(price);
    const registrants = await sale.getRegistrants(id);
    expect(registrants).to.deep.equal([user.address]);
    expect(await sale.ticketsLeft(id)).to.equal(BigInt(maxSupply - 1));
    expect(await sale.isAvailable(id)).to.equal(true);
  });

  it("register reverts for wrong amount, double register, sold out, and after event", async () => {
    const { sale, creator, user, user2 } = await loadFixture(deployFixture);
    const { id, price } = await createBasicTicket(sale, creator, { maxSupply: 1 });

    await expect(sale.connect(user).register(id, { value: price - 1n }))
      .to.be.revertedWith("incorrect CELO amount");

    await sale.connect(user).register(id, { value: price });
    await expect(sale.connect(user).register(id, { value: price }))
      .to.be.revertedWith("already registered");

    await expect(sale.connect(user2).register(id, { value: price }))
      .to.be.revertedWith("sold out");

    // New ticket and move time past event
    const { id: id2, price: price2, eventTimestamp } = await createBasicTicket(sale, creator, { startIn: 10 });
    await time.increaseTo(eventTimestamp + 1n);
    await expect(sale.connect(user2).register(id2, { value: price2 }))
      .to.be.revertedWith("event passed");
  });

  it("closeTicket prevents registration and sets status Closed before start", async () => {
    const { sale, creator, user } = await loadFixture(deployFixture);
    const { id, price, eventTimestamp } = await createBasicTicket(sale, creator, { startIn: 3600 });

    await sale.connect(creator).closeTicket(id);
    expect(await sale.getStatus(id)).to.equal(3n); // Closed
    await expect(sale.connect(user).register(id, { value: price }))
      .to.be.revertedWith("ticket closed");

    // After event time, status becomes Passed
    await time.increaseTo(eventTimestamp + 1n);
    expect(await sale.getStatus(id)).to.equal(1n); // Passed
  });

  it("cancelTicket auto-refunds registrants and blocks withdrawProceeds", async () => {
    const { sale, creator, user } = await loadFixture(deployFixture);
    const { id, price } = await createBasicTicket(sale, creator, { maxSupply: 2 });

    await sale.connect(user).register(id, { value: price });
    const before = await hre.ethers.provider.getBalance(user.address);
    await sale.connect(creator).cancelTicket(id);
    const after = await hre.ethers.provider.getBalance(user.address);

    expect(await sale.getStatus(id)).to.equal(2n); // Canceled
    expect(after - before).to.equal(price);

    await expect(sale.connect(creator).withdrawProceeds(id))
      .to.be.revertedWith("ticket canceled");

    // Refund already processed
    await expect(sale.connect(user).claimRefund(id))
      .to.be.revertedWith("nothing to refund");
  });

  it("withdrawProceeds transfers creator and fee shares and cannot be called twice", async () => {
    const { sale, owner: feeRecipient, creator, user, user2 } = await loadFixture(deployFixture);
    const { id, price, eventTimestamp } = await createBasicTicket(sale, creator, { maxSupply: 2, startIn: 10 });

    await sale.connect(user).register(id, { value: price });
    await sale.connect(user2).register(id, { value: price });

    await time.increaseTo(eventTimestamp + 1n);

    const beforeCreator = await hre.ethers.provider.getBalance(creator.address);
    const beforeFee = await hre.ethers.provider.getBalance(feeRecipient.address);

    const tx = await sale.connect(creator).withdrawProceeds(id);
    const receipt = await tx.wait();
    const gas = (receipt!.gasUsed as bigint) * (receipt!.effectiveGasPrice as bigint);

    const net = price * 2n;
    const fee = (net * 250n) / 10000n; // 2.5%
    const toCreator = net - fee;

    const afterCreator = await hre.ethers.provider.getBalance(creator.address);
    const afterFee = await hre.ethers.provider.getBalance(feeRecipient.address);

    expect(afterCreator + gas - beforeCreator).to.equal(toCreator);
    expect(afterFee - beforeFee).to.equal(fee);

    await expect(sale.connect(creator).withdrawProceeds(id))
      .to.be.revertedWith("already withdrawn");
  });

  it("finalizeEvent can be called by anyone after event to settle proceeds", async () => {
    const { sale, owner: feeRecipient, creator, user, user2 } = await loadFixture(deployFixture);
    const { id, price, eventTimestamp } = await createBasicTicket(sale, creator, { maxSupply: 2, startIn: 10 });

    await sale.connect(user).register(id, { value: price });
    await sale.connect(user2).register(id, { value: price });

    await time.increaseTo(eventTimestamp + 1n);

    const beforeCreator = await hre.ethers.provider.getBalance(creator.address);
    const beforeFee = await hre.ethers.provider.getBalance(feeRecipient.address);

    // Called by non-creator
    await sale.connect(user).finalizeEvent(id);

    const net = price * 2n;
    const fee = (net * 250n) / 10000n;
    const toCreator = net - fee;

    const afterCreator = await hre.ethers.provider.getBalance(creator.address);
    const afterFee = await hre.ethers.provider.getBalance(feeRecipient.address);

    expect(afterCreator - beforeCreator).to.equal(toCreator);
    expect(afterFee - beforeFee).to.equal(fee);

    await expect(sale.connect(user2).finalizeEvent(id)).to.be.revertedWith("already withdrawn");
  });

  it("updateTicket enforces rules and updates fields", async () => {
    const { sale, creator } = await loadFixture(deployFixture);
    const { id } = await createBasicTicket(sale, creator, { startIn: 7200, location: "Abuja" });

    const now = (await hre.ethers.provider.getBlock("latest"))!.timestamp;
    const newTs = now + 10_000;
    const newPrice = hre.ethers.parseEther("0.25");
    await expect(sale.updateTicket(id, newPrice, "Lagos", BigInt(newTs))).to.be.revertedWith("only creator");

    await sale.connect(creator).updateTicket(id, newPrice, "Lagos", BigInt(newTs));
    const t = await sale.tickets(id);
    expect(t.price).to.equal(newPrice);
    expect(t.location).to.equal("Lagos");
    expect(t.eventTimestamp).to.equal(BigInt(newTs));
  });

  it("updateMaxSupply enforces rules and updates", async () => {
    const { sale, creator, user, user2 } = await loadFixture(deployFixture);
    const { id, price } = await createBasicTicket(sale, creator, { maxSupply: 2 });

    await sale.connect(user).register(id, { value: price });
    await expect(sale.updateMaxSupply(id, 1)).to.be.revertedWith("only creator");
    await expect(sale.connect(creator).updateMaxSupply(id, 0)).to.be.revertedWith("zero max");

    // sell out to 2, then try to reduce below sold (to 1)
    await sale.connect(user2).register(id, { value: price });
    await expect(sale.connect(creator).updateMaxSupply(id, 1)).to.be.revertedWith("below sold");

    // increasing to 3 (>= sold)
    await sale.connect(creator).updateMaxSupply(id, 3);
    const t = await sale.tickets(id);
    expect(t.maxSupply).to.equal(3n);
  });

  it("views and safety functions behave as expected", async () => {
    const { sale, creator, user } = await loadFixture(deployFixture);
    const { id, price } = await createBasicTicket(sale, creator, { maxSupply: 1, startIn: 3600 });

    // isAvailable true initially
    expect(await sale.isAvailable(id)).to.equal(true);

    // direct CELO send reverts
    await expect((await hre.ethers.getSigners())[0].sendTransaction({ to: sale.target, value: hre.ethers.parseEther("0.1") }))
      .to.be.revertedWith("send CELO via register()");

    // fallback reverts
    await expect((await hre.ethers.getSigners())[0].sendTransaction({ to: sale.target, data: "0x12345678" }))
      .to.be.revertedWith("invalid call");

    // registrants view
    await sale.connect(user).register(id, { value: price });
    const regs = await sale.getRegistrants(id);
    expect(regs.length).to.equal(1);
    expect(regs[0]).to.equal(user.address);

    const recents = await sale.getRecentTickets();
    expect(recents.length).to.be.greaterThan(0);
  });
});
