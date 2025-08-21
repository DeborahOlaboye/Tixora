import { WalletConnectButton } from '@/components/wallet-connect-button'
import { WalletInfo } from '@/components/wallet-info'

export default function WalletTestPage() {
  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Rainbow Kit & Wagmi Test</h1>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Wallet Connection</h2>
        <WalletConnectButton />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Wallet Information</h2>
        <div className="p-4 border rounded-lg">
          <WalletInfo />
        </div>
      </div>

      <div className="text-sm text-muted-foreground space-y-2">
        <p>• This page demonstrates Rainbow Kit wallet connection</p>
        <p>• Connect your wallet to see account information</p>
        <p>• Supports MetaMask, WalletConnect, Coinbase Wallet, and more</p>
      </div>
    </div>
  )
}
