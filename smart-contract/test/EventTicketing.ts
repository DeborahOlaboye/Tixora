import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("NFT Contract", function () {
  async function deployMyContract() {
    // Contracts are deployed using the first signer/account by default
    const [user1, user2, user3] = await hre.ethers.getSigners();

    const NFTTesting = await hre.ethers.getContractFactory("TicketNft"); // contract name
    const testing = await NFTTesting.deploy("Ticket NFT", "TKT");

    return { testing, user1, user2, user3 };
  }

  describe("Deployment", function () {
    it("Should set a mint", async function () {
      const { testing, user1, user2, user3 } = await loadFixture(deployMyContract);

      const result = await testing.setMinter(user3.address);
      expect(result).to.equal(user2.address);
    });

  
  });
});
