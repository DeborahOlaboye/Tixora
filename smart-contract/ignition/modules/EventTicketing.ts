// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const NFTName = "Tixora NFT";
const NFTSymbol = "TIX";
const imageUri = "ipfs://bafybeidjmguiviozpgptmvbkq4mzivq5vp3uktw3fuouzk2i25binmfyxy";
const deployerAddress = "0x6Cac76f9e8d6F55b3823D8aEADEad970a5441b67";

const EventTicketingModule = buildModule("EventTicketing", (m) => {
  const ticketNFT = m.contract("TicketNft", [NFTName, NFTSymbol, imageUri]);

  const eventContract = m.contract("EventTicketing", [ticketNFT, deployerAddress, 250]);

  const ticketResale = m.contract("TicketResaleMarket", [eventContract, ticketNFT, deployerAddress, 250]);

  return { ticketNFT, eventContract, ticketResale };
});

export default EventTicketingModule;
