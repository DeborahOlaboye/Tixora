import { ethers, run } from "hardhat";

async function main() {
  console.log("Starting deployment...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Contract parameters
  const NFTName = "Tixora NFT";
  const NFTSymbol = "TIX";
  const imageUri = "ipfs://bafybeidjmguiviozpgptmvbkq4mzivq5vp3uktw3fuouzk2i25binmfyxy";
  const deployerAddress = "0x6Cac76f9e8d6F55b3823D8aEADEad970a5441b67";
  const feePercentage = 250; // 2.5%

  console.log("\n=== Deployment Parameters ===");
  console.log("NFT Name:", NFTName);
  console.log("NFT Symbol:", NFTSymbol);
  console.log("Image URI:", imageUri);
  console.log("Deployer Address:", deployerAddress);
  console.log("Fee Percentage:", feePercentage);

  try {
    // Deploy TicketNft contract
    console.log("\n=== Deploying TicketNft ===");
    const TicketNft = await ethers.getContractFactory("TicketNft");
    const ticketNft = await TicketNft.deploy(NFTName, NFTSymbol, imageUri);
    await ticketNft.waitForDeployment();
    const ticketNftAddress = await ticketNft.getAddress();
    console.log("TicketNft deployed to:", ticketNftAddress);

    // Deploy EventTicketing contract
    console.log("\n=== Deploying EventTicketing ===");
    const EventTicketing = await ethers.getContractFactory("EventTicketing");
    const eventTicketing = await EventTicketing.deploy(ticketNftAddress, deployerAddress, feePercentage);
    await eventTicketing.waitForDeployment();
    const eventTicketingAddress = await eventTicketing.getAddress();
    console.log("EventTicketing deployed to:", eventTicketingAddress);

    // Deploy TicketResaleMarket contract
    console.log("\n=== Deploying TicketResaleMarket ===");
    const TicketResaleMarket = await ethers.getContractFactory("TicketResaleMarket");
    const ticketResaleMarket = await TicketResaleMarket.deploy(eventTicketingAddress, ticketNftAddress, deployerAddress, feePercentage);
    await ticketResaleMarket.waitForDeployment();
    const ticketResaleMarketAddress = await ticketResaleMarket.getAddress();
    console.log("TicketResaleMarket deployed to:", ticketResaleMarketAddress);

    // Set minter role for EventTicketing contract in TicketNft
    console.log("\n=== Setting up permissions ===");
    console.log("Setting EventTicketing as minter for TicketNft...");
    const setMinterTx = await ticketNft.setMinter(eventTicketingAddress);
    await setMinterTx.wait();
    console.log("Minter role set successfully");

    // Wait a bit before verification to ensure the contracts are indexed
    console.log("\n=== Waiting before verification ===");
    console.log("Waiting 30 seconds for contract indexing...");
    await new Promise(resolve => setTimeout(resolve, 30000));

    // Verify contracts
    console.log("\n=== Verifying Contracts ===");
    
    try {
      console.log("Verifying TicketNft...");
      await run("verify:verify", {
        address: ticketNftAddress,
        constructorArguments: [NFTName, NFTSymbol, imageUri],
      });
      console.log("TicketNft verified successfully");
    } catch (error: any) {
      console.log("TicketNft verification failed:", error.message);
      if (error.message.includes("Already Verified")) {
        console.log("TicketNft was already verified");
      }
    }

    try {
      console.log("Verifying EventTicketing...");
      await run("verify:verify", {
        address: eventTicketingAddress,
        constructorArguments: [ticketNftAddress, deployerAddress, feePercentage],
      });
      console.log("EventTicketing verified successfully");
    } catch (error: any) {
      console.log("EventTicketing verification failed:", error.message);
      if (error.message.includes("Already Verified")) {
        console.log("EventTicketing was already verified");
      }
    }

    try {
      console.log("Verifying TicketResaleMarket...");
      await run("verify:verify", {
        address: ticketResaleMarketAddress,
        constructorArguments: [eventTicketingAddress, ticketNftAddress, deployerAddress, feePercentage],
      });
      console.log("TicketResaleMarket verified successfully");
    } catch (error: any) {
      console.log("TicketResaleMarket verification failed:", error.message);
      if (error.message.includes("Already Verified")) {
        console.log("TicketResaleMarket was already verified");
      }
    }

    console.log("\n=== Deployment Summary ===");
    console.log("TicketNft:", ticketNftAddress);
    console.log("EventTicketing:", eventTicketingAddress);
    console.log("TicketResaleMarket:", ticketResaleMarketAddress);
    console.log("\n=== Deployment and Verification completed! ===");

    // Save deployment addresses to a file
    const deploymentInfo = {
      network: "celo_sepolia",
      chainId: 11142220,
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      contracts: {
        TicketNft: ticketNftAddress,
        EventTicketing: eventTicketingAddress,
        TicketResaleMarket: ticketResaleMarketAddress
      },
      parameters: {
        NFTName,
        NFTSymbol,
        imageUri,
        deployerAddress,
        feePercentage
      }
    };

    const fs = require('fs');
    const path = require('path');
    const deploymentsDir = path.join(__dirname, '..', 'deployments');
    
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const deploymentFile = path.join(deploymentsDir, `celo_sepolia_${Date.now()}.json`);
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
    console.log("Deployment info saved to:", deploymentFile);

  } catch (error) {
    console.error("Deployment failed:", error);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
