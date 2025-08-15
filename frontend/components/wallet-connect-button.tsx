"use client"

import { useState, useEffect } from "react"
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useWallet, getWalletAvailability } from "@/lib/wallet-context"

const walletOptions = [
  {
    id: "metamask" as const,
    name: "MetaMask",
    description: "Connect using browser extension",
    color: "bg-orange-500",
    installUrl: "https://metamask.io/download/",
  },
  {
    id: "walletconnect" as const,
    name: "WalletConnect",
    description: "Connect using mobile wallet",
    color: "bg-blue-500",
    installUrl: "https://walletconnect.com/",
  },
  {
    id: "coinbase" as const,
    name: "Coinbase Wallet",
    description: "Connect using Coinbase Wallet",
    color: "bg-purple-500",
    installUrl: "https://www.coinbase.com/wallet",
  },
]

export function WalletConnectButton() {
  const { isConnected, address, balance, chainId, isConnecting, connectWallet, disconnectWallet } = useWallet()
  const [showWalletDialog, setShowWalletDialog] = useState(false)
  const [connectError, setConnectError] = useState<string | null>(null)
  const [walletAvailability, setWalletAvailability] = useState({
    metamask: false,
    walletconnect: true,
    coinbase: true,
  })

  useEffect(() => {
    if (showWalletDialog) {
      setWalletAvailability(getWalletAvailability())
    }
  }, [showWalletDialog])

  const handleConnect = async (walletType: "metamask" | "walletconnect" | "coinbase") => {
    try {
      setConnectError(null)
      await connectWallet(walletType)
      setShowWalletDialog(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to connect wallet"
      setConnectError(errorMessage)
    }
  }

  const handleInstallWallet = (installUrl: string) => {
    window.open(installUrl, "_blank")
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 1:
        return "Ethereum"
      case 5:
        return "Goerli"
      case 11155111:
        return "Sepolia"
      default:
        return "Unknown"
    }
  }

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 bg-transparent">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="font-mono">{formatAddress(address)}</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <div className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Connected Account</span>
              <Badge variant="secondary" className="text-xs">
                {chainId && getNetworkName(chainId)}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono">{formatAddress(address)}</code>
              <Button variant="ghost" size="sm" onClick={copyAddress}>
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            {balance && (
              <div className="text-sm">
                <span className="text-muted-foreground">Balance: </span>
                <span className="font-medium">{balance} ETH</span>
              </div>
            )}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => window.open(`https://etherscan.io/address/${address}`, "_blank")}>
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Etherscan
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={disconnectWallet} className="text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <>
      <Button variant="outline" onClick={() => setShowWalletDialog(true)} disabled={isConnecting}>
        {isConnecting ? (
          <>
            <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin mr-2" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </>
        )}
      </Button>

      <Dialog open={showWalletDialog} onOpenChange={setShowWalletDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Your Wallet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">Connect your Web3 wallet to purchase tickets as NFTs.</p>

            {connectError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{connectError}</p>
                {connectError.includes("MetaMask not detected") && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 bg-transparent"
                    onClick={() => handleInstallWallet("https://metamask.io/download/")}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Install MetaMask
                  </Button>
                )}
              </div>
            )}

            <div className="space-y-2">
              {walletOptions.map((wallet) => {
                const isAvailable = walletAvailability[wallet.id]

                return (
                  <div key={wallet.id} className="relative">
                    <Button
                      onClick={() => (isAvailable ? handleConnect(wallet.id) : handleInstallWallet(wallet.installUrl))}
                      disabled={isConnecting}
                      className="w-full justify-start bg-transparent"
                      variant="outline"
                    >
                      <div className={`w-6 h-6 ${wallet.color} rounded mr-3`}></div>
                      <div className="text-left flex-1">
                        <div className="font-medium flex items-center gap-2">
                          {wallet.name}
                          {!isAvailable && wallet.id === "metamask" && (
                            <Badge variant="secondary" className="text-xs">
                              Install Required
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {isAvailable ? wallet.description : "Click to install"}
                        </div>
                      </div>
                      {!isAvailable && wallet.id === "metamask" && (
                        <Download className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                )
              })}
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Your wallet will be used to sign transactions</p>
              <p>• We never store your private keys</p>
              <p>• You can disconnect at any time</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
