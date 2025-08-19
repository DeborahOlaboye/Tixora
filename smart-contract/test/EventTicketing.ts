import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { formatUnits } from "ethers";
import hre from "hardhat";

describe("EventTicketing (native CELO)", function () {
  async function deployFixture() {
    const [owner, creator, user] = await hre.ethers.getSigners();

    const TicketNft = await hre.ethers.getContractFactory("TicketNft");
    const nft = await TicketNft.deploy("TicketNFT", "TNFT");

    const EventTicketing = await hre.ethers.getContractFactory("EventTicketing");
    const sale = await EventTicketing.deploy(nft.target, "0x6Cac76f9e8d6F55b3823D8aEADEad970a5441b67", 250);

    // allow sale contract to mint
    await nft.connect(owner).setMinter(sale.target);

    return { nft, sale, owner, creator, user };
  }

  it("creates a ticket and registers with exact CELO", async () => {
    const { sale, nft, creator, user } = await loadFixture(deployFixture);

    const now = (await hre.ethers.provider.getBlock("latest"))!.timestamp;
    const price = hre.ethers.parseEther("0.5");
    const add = hre.ethers.parseEther("0.5");

    const ticketId = await sale.connect(creator).createTicket(price, "eventName", "eventDescription", now + 3600, 20, "meta", "Abuja");

    expect(ticketId).to.be.a.string; // check if ticketId is a string
  });

  it ("registers with exact CELO", async () => {
    const { sale, nft, creator, user } = await loadFixture(deployFixture);

    const now = (await hre.ethers.provider.getBlock("latest"))!.timestamp;
    const price = hre.ethers.parseEther("0.5");
    const add = hre.ethers.parseEther("0.5");

    const ticketId = await sale.connect(creator).createTicket(price, "eventName", "eventDescription", now + 3600, 20, "meta", "Abuja");
    const getTicket =await sale.connect(user).register("1", { value: price });
    
    expect(getTicket).to.emit(sale, "Registered").withArgs(ticketId, user.address, 1n);
  })
    // creator creates ticket
    // await expect(
    //   sale.connect(creator).createTicket(price, "eventName", "eventDescription", now + 3600, 20, "meta", "Abuja")
    // ).to.emit(sale, "TicketCreated").withArgs(formatUnits("0.5"), "eventName", "eventDescription", now + 3600, 20, "meta", "Abuja");

  //   // user registers by sending exact CELO
  //   await expect(
  //     sale.connect(user).register(1, { value: price })
  //   ).to.emit(sale, "Registered").withArgs(1, user.address, 1n);

  //   // wrong amount should revert
  //   await expect(
  //     sale.connect(user).register(1, { value: price - 1n })
  //   ).to.be.revertedWith("incorrect CELO amount");

  //   // double-register should revert
  //   await expect(
  //     sale.connect(user).register(1, { value: price })
  //   ).to.be.revertedWith("already registered");

});
