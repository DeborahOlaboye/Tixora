"use client"

import { useAccount } from "wagmi"
import { TicketManagementSystem } from "@/components/ticket-management-system"
import { WalletConnectButton } from "@/components/wallet-connect-button"

export default function TicketsPage() {
  const { isConnected } = useAccount()

  // Redirect to landing page if wallet is not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center p-8 bg-slate-800/50 rounded-lg border border-purple-500/30 backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-white mb-4">Wallet Connection Required</h1>
          <p className="text-slate-300 mb-6">Please connect your wallet to view your tickets.</p>
          <WalletConnectButton className="mx-auto" />
        </div>
      </div>
    )
  }

  return <TicketManagementSystem />
}
