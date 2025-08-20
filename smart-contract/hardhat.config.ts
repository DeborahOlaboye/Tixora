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
    celo_sepolia: {
      url: "https://forno.celo-sepolia.celo-testnet.org",
      accounts: {
        mnemonic: PRIVATE_KEY,
        path: "m/44'/52752'/0'/0",
      },
      chainId: 11142220,
    },
  },
  etherscan: {
    apiKey: {
      celo_sepolia: API_KEY,
    },
    customChains: [
      {
        network: "celo_sepolia",
        chainId: 11142220,
        urls: {
          apiURL: "https://api-sepolia.celoscan.io/api", // info from celodocs.io
          browserURL: "https://sepolia.celoscan.io",
        },
      },
    ],
  },
  sourcify: {
    enabled: false,
  },
};

export default config;
