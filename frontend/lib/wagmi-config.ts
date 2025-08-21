import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, optimism, arbitrum, base, sepolia } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'Tixora - Decentralized Event Ticketing',
  projectId: '2f05a7cdc2bb9f5d6f1a1d1a1d1a1d1a', // Demo project ID - replace with your own from https://cloud.walletconnect.com
  chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
})
