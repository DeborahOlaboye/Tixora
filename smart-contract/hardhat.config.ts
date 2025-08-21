import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { vars } from "hardhat/config";

const PRIVATE_KEY = vars.get("PRIVATE_KEY");
const API_KEY = vars.get("ETHERSCAN_API_KEY"); // from etherscan

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true, // <--- This enables the Yul Intermediate Representation
    },
  },
  networks: {
    celo: {
      url: "https://forno.celo-sepolia.celo-testnet.org",
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      celo: API_KEY,
    },
    customChains: [
      {
        network: "celo",
        chainId: 11142220,
        urls: {
          apiURL: "https://api-celo-sepolia.celoscan.io/api",
          browserURL: "https://celo-sepolia.blockscout.com/",
        }
      }
    ],
  },
  sourcify: {
    enabled: false,
  },
};

export default config;
