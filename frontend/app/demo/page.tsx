'use client'

import { WalletConnectButton } from '@/components/wallet-connect-button'
import { WalletInfo } from '@/components/wallet-info'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white">
      <div className="container mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Rainbow Kit & Wagmi Demo
          </h1>
          <p className="text-slate-300 text-lg">
            Test the wallet connection functionality with Rainbow Kit
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center space-x-4">
          <Link href="/">
            <Button variant="outline">← Back to Home</Button>
          </Link>
          <Link href="/wallet-test">
            <Button variant="outline">Advanced Test Page</Button>
          </Link>
        </div>

        {/* Main Demo Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Wallet Connection */}
          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-xl text-white">Wallet Connection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">
                Click the button below to connect your wallet using Rainbow Kit:
              </p>
              <div className="flex justify-center">
                <WalletConnectButton />
              </div>
            </CardContent>
          </Card>

          {/* Wallet Information */}
          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-xl text-white">Wallet Information</CardTitle>
            </CardHeader>
            <CardContent>
              <WalletInfo />
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <Card className="bg-slate-800/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-xl text-white">Rainbow Kit Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-purple-400">Multiple Wallets</h3>
                <p className="text-sm text-slate-300">
                  Supports MetaMask, WalletConnect, Coinbase Wallet, and more
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-purple-400">Chain Switching</h3>
                <p className="text-sm text-slate-300">
                  Easy network switching between Ethereum, Polygon, and other chains
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-purple-400">Modern UI</h3>
                <p className="text-sm text-slate-300">
                  Beautiful, responsive wallet connection interface
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-slate-800/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-xl text-white">How to Test</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-slate-300">
              <li>Click "Connect Wallet" above</li>
              <li>Choose your preferred wallet (MetaMask recommended for testing)</li>
              <li>Approve the connection in your wallet</li>
              <li>View your wallet information in the right panel</li>
              <li>Try switching networks using the chain selector</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
