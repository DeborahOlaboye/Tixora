import { run } from "hardhat";

interface ContractInfo {
  name: string;
  address: string;
  constructorArgs: any[];
  contractPath?: string;
}

// Retry function with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 10000
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      console.log(`Attempt ${i + 1} failed:`, error.message);
      
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        console.log(`Waiting ${delay / 1000} seconds before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

// Verify a single contract with retry logic
async function verifyContract(contractInfo: ContractInfo): Promise<boolean> {
  const { name, address, constructorArgs, contractPath } = contractInfo;
  
  console.log(`\n=== Verifying ${name} ===`);
  console.log(`Address: ${address}`);
  console.log(`Constructor args:`, constructorArgs);
  
  try {
    await retryWithBackoff(async () => {
      const verifyArgs: any = {
        address: address,
        constructorArguments: constructorArgs,
      };
      
      if (contractPath) {
        verifyArgs.contract = contractPath;
      }
      
      await run("verify:verify", verifyArgs);
    }, 5, 15000); // 5 retries with 15 second base delay
    
    console.log(`✅ ${name} verified successfully!`);
    return true;
  } catch (error: any) {
    console.log(`❌ ${name} verification failed:`, error.message);
    
    if (error.message.includes("Already Verified")) {
      console.log(`✅ ${name} was already verified`);
      return true;
    }
    
    if (error.message.includes("missing trie node")) {
      console.log(`⚠️  ${name} verification failed due to indexing issues. The contract may not be fully indexed yet.`);
      console.log(`   Try again in a few minutes or verify manually at: https://sepolia.celoscan.io/address/${address}#code`);
    }
    
    return false;
  }
}

async function main() {
  // Contract addresses from deployment
  const ticketNftAddress = "0xeA0e5aEADBd3Dde06cF50a377dc5e203c9D557Ca";
  const eventTicketingAddress = "0xEcF8970cF0420853d74ef27C56b20378A71CB938";
  const ticketResaleMarketAddress = "0x4fccaCF397Db73568b890971fC5f78BD431Fe28C";

  // Constructor arguments
  const NFTName = "Tixora NFT";
  const NFTSymbol = "TIX";
  const imageUri = "ipfs://bafybeidjmguiviozpgptmvbkq4mzivq5vp3uktw3fuouzk2i25binmfyxy";
  const deployerAddress = "0x6Cac76f9e8d6F55b3823D8aEADEad970a5441b67";
  const feePercentage = 250;

  console.log("🚀 Starting enhanced verification process...");
  console.log("⏳ This process includes retry logic for indexing delays...");

  // Define contracts to verify
  const contractsToVerify: ContractInfo[] = [
    {
      name: "TicketNft",
      address: ticketNftAddress,
      constructorArgs: [NFTName, NFTSymbol, imageUri],
      contractPath: "contracts/TicketNft.sol:TicketNft"
    },
    {
      name: "EventTicketing", 
      address: eventTicketingAddress,
      constructorArgs: [ticketNftAddress, deployerAddress, feePercentage],
      contractPath: "contracts/EventTicketing.sol:EventTicketing"
    },
    {
      name: "TicketResaleMarket",
      address: ticketResaleMarketAddress,
      constructorArgs: [eventTicketingAddress, ticketNftAddress, deployerAddress, feePercentage],
      contractPath: "contracts/TicketResaleMarket.sol:TicketResaleMarket"
    }
  ];

  // Verify each contract
  let successCount = 0;
  for (const contract of contractsToVerify) {
    const success = await verifyContract(contract);
    if (success) successCount++;
  }

  console.log(`\n📊 Verification Summary: ${successCount}/${contractsToVerify.length} contracts verified successfully`);
  
  if (successCount < contractsToVerify.length) {
    console.log("\n🔗 Manual Verification Links:");
    for (const contract of contractsToVerify) {
      console.log(`${contract.name}: https://sepolia.celoscan.io/address/${contract.address}#code`);
    }
    console.log("\n💡 Tip: If verification fails due to 'missing trie node' errors, wait 5-10 minutes and try again.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
