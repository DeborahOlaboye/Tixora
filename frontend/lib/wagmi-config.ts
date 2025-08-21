import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, optimism, arbitrum, base, sepolia, celo, celoAlfajores } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'Tixora - Decentralized Event Ticketing',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id', // Use environment variable or fallback
  chains: [celo, celoAlfajores, mainnet, polygon, optimism, arbitrum, base, sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
})
