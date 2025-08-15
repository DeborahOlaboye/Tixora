"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface WalletState {
  isConnected: boolean
  address: string | null
  balance: string | null
  chainId: number | null
  isConnecting: boolean
  isTransacting: boolean
}

interface WalletContextType extends WalletState {
  connectWallet: (walletType: WalletType) => Promise<void>
  disconnectWallet: () => void
  switchNetwork: (chainId: number) => Promise<void>
  sendTransaction: (to: string, value: string, data?: string) => Promise<string>
  purchaseTicket: (eventId: number, price: string, eventTitle: string) => Promise<boolean>
}

type WalletType = "metamask" | "walletconnect" | "coinbase"

const WalletContext = createContext<WalletContextType | undefined>(undefined)

const initialState: WalletState = {
  isConnected: false,
  address: null,
  balance: null,
  chainId: null,
  isConnecting: false,
  isTransacting: false,
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletState, setWalletState] = useState<WalletState>(initialState)
  const router = useRouter()

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkConnection()
  }, [])

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else {
          setWalletState((prev) => ({ ...prev, address: accounts[0] }))
          updateBalance(accounts[0])
        }
      }

      const handleChainChanged = (chainId: string) => {
        setWalletState((prev) => ({ ...prev, chainId: Number.parseInt(chainId, 16) }))
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [])

  const checkConnection = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          const chainId = await window.ethereum.request({ method: "eth_chainId" })
          setWalletState({
            isConnected: true,
            address: accounts[0],
            balance: null,
            chainId: Number.parseInt(chainId, 16),
            isConnecting: false,
            isTransacting: false,
          })
          updateBalance(accounts[0])
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error)
      }
    }
  }

  const updateBalance = async (address: string) => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [address, "latest"],
        })
        const balanceInEth = (Number.parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4)
        setWalletState((prev) => ({ ...prev, balance: balanceInEth }))
      } catch (error) {
        console.error("Error fetching balance:", error)
      }
    }
  }

  const connectWallet = async (walletType: WalletType) => {
    if (walletState.isConnecting || walletState.isConnected) {
      return
    }

    setWalletState((prev) => ({ ...prev, isConnecting: true }))

    try {
      if (walletType === "metamask") {
        if (typeof window === "undefined") {
          throw new Error("Please use a Web3-enabled browser")
        }

        if (!window.ethereum) {
          throw new Error("MetaMask not detected. Please install MetaMask extension.")
        }

        // Check if MetaMask is the active provider
        if (!window.ethereum.isMetaMask) {
          throw new Error("MetaMask not found. Please make sure MetaMask is your active wallet.")
        }

        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        const chainId = await window.ethereum.request({ method: "eth_chainId" })

        setWalletState({
          isConnected: true,
          address: accounts[0],
          balance: null,
          chainId: Number.parseInt(chainId, 16),
          isConnecting: false,
          isTransacting: false,
        })

        updateBalance(accounts[0])

        router.push("/dashboard")
      } else {
        // For demo purposes, simulate other wallet connections
        await new Promise((resolve) => setTimeout(resolve, 1500))
        const mockAddress = "0x" + Math.random().toString(16).substr(2, 40)
        setWalletState({
          isConnected: true,
          address: mockAddress,
          balance: "1.2345",
          chainId: 1,
          isConnecting: false,
          isTransacting: false,
        })

        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      setWalletState((prev) => ({ ...prev, isConnecting: false }))
      throw error
    }
  }

  const disconnectWallet = () => {
    setWalletState(initialState)
    router.push("/")
  }

  const switchNetwork = async (chainId: number) => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        })
      } catch (error) {
        console.error("Error switching network:", error)
        throw error
      }
    }
  }

  const sendTransaction = async (to: string, value: string, data?: string): Promise<string> => {
    if (!walletState.isConnected || !walletState.address) {
      throw new Error("Wallet not connected")
    }

    setWalletState((prev) => ({ ...prev, isTransacting: true }))

    try {
      if (typeof window !== "undefined" && window.ethereum && window.ethereum.isMetaMask) {
        // Real MetaMask transaction
        const transactionParameters = {
          to,
          from: walletState.address,
          value: `0x${(Number.parseFloat(value) * Math.pow(10, 18)).toString(16)}`,
          data: data || "0x",
        }

        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        })

        // Simulate transaction confirmation delay
        await new Promise((resolve) => setTimeout(resolve, 2000))

        return txHash
      } else {
        // Simulate transaction for demo/preview environment
        console.log("[v0] Simulating transaction:", { to, value, data })

        // Simulate transaction processing delay
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Generate mock transaction hash
        const mockTxHash = "0x" + Math.random().toString(16).substr(2, 64)
        console.log("[v0] Mock transaction hash:", mockTxHash)

        return mockTxHash
      }
    } catch (error) {
      console.error("Transaction failed:", error)
      throw error
    } finally {
      setWalletState((prev) => ({ ...prev, isTransacting: false }))
    }
  }

  const purchaseTicket = async (eventId: number, price: string, eventTitle: string): Promise<boolean> => {
    try {
      // Show transaction prompt
      const confirmed = window.confirm(
        `Purchase ticket for "${eventTitle}"?\n\nPrice: ${price}\nGas fee: ~0.002 CELO\n\nClick OK to approve the transaction in your wallet.`,
      )

      if (!confirmed) {
        return false
      }

      // Simulate sending transaction to smart contract
      const contractAddress = "0x1234567890123456789012345678901234567890" // Mock contract address
      const priceInWei = (Number.parseFloat(price.replace(" CELO", "")) * Math.pow(10, 18)).toString()

      const txHash = await sendTransaction(contractAddress, price.replace(" CELO", ""))

      // Store purchased ticket in localStorage (in real app, this would be handled by smart contract events)
      const purchasedTickets = JSON.parse(localStorage.getItem("purchasedTickets") || "[]")
      const newTicket = {
        id: Date.now(),
        eventId,
        eventTitle,
        price,
        purchaseDate: new Date().toISOString(),
        txHash,
        status: "confirmed",
        qrCode: `ticket-${eventId}-${Date.now()}`,
      }

      purchasedTickets.push(newTicket)
      localStorage.setItem("purchasedTickets", JSON.stringify(purchasedTickets))

      return true
    } catch (error) {
      console.error("Purchase failed:", error)
      return false
    }
  }

  return (
    <WalletContext.Provider
      value={{
        ...walletState,
        connectWallet,
        disconnectWallet,
        switchNetwork,
        sendTransaction,
        purchaseTicket,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any
  }
}

export function getWalletAvailability() {
  if (typeof window === "undefined") {
    return {
      metamask: false,
      walletconnect: true, // Always available as it's a protocol
      coinbase: true, // Assume available for demo
    }
  }

  return {
    metamask: !!(window.ethereum && window.ethereum.isMetaMask),
    walletconnect: true,
    coinbase: true,
  }
}
