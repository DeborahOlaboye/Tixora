"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Shield,
  Zap,
  Minus,
  Plus,
  Wallet,
  CheckCircle,
  ExternalLink,
  Copy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useWallet } from "@/lib/wallet-context"
import { WalletConnectButton } from "@/components/wallet-connect-button"

interface EventData {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  venue: string
  price: string
  currency: string
  totalSupply: number
  soldTickets: number
  category: string
  organizer: string
  image: string
  transferable: boolean
  unlockableContent: string
}

// Mock event data
const mockEvent: EventData = {
  id: "1",
  title: "Web3 Music Festival 2024",
  description:
    "Join us for the biggest Web3 music festival of the year! Experience cutting-edge performances from top artists while being part of the decentralized future of entertainment. This exclusive event features multiple stages, interactive NFT experiences, and networking opportunities with Web3 pioneers.",
  date: "2024-03-15",
  time: "18:00",
  location: "San Francisco, CA",
  venue: "Golden Gate Park",
  price: "0.05",
  currency: "ETH",
  totalSupply: 2500,
  soldTickets: 1847,
  category: "Music",
  organizer: "0x1234...5678",
  image: "/web3-music-festival-lights.png",
  transferable: true,
  unlockableContent: "Exclusive backstage access, limited edition merchandise, and VIP after-party invitation.",
}

type PurchaseStep = "details" | "purchase" | "wallet" | "confirm" | "success"

export function TicketPurchaseFlow({ eventId }: { eventId: string }) {
  const [currentStep, setCurrentStep] = useState<PurchaseStep>("details")
  const [quantity, setQuantity] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionHash, setTransactionHash] = useState("")
  const [ticketTokenIds, setTicketTokenIds] = useState<string[]>([])

  const { isConnected, address, connectWallet } = useWallet()

  const event = mockEvent // In real app, fetch by eventId

  const totalPrice = (Number.parseFloat(event.price) * quantity).toFixed(4)
  const availableTickets = event.totalSupply - event.soldTickets

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(quantity + delta, Math.min(10, availableTickets)))
    setQuantity(newQuantity)
  }

  const handlePurchase = () => {
    if (!isConnected) {
      setCurrentStep("wallet")
    } else {
      setCurrentStep("confirm")
    }
  }

  const handleWalletConnect = async (walletType: "metamask" | "walletconnect" | "coinbase") => {
    try {
      await connectWallet(walletType)
      setCurrentStep("confirm")
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleConfirmPurchase = async () => {
    // Placeholder for purchase logic
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setTransactionHash("0xabcdef1234567890")
      setTicketTokenIds(["1", "2", "3"])
      setCurrentStep("success")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary-foreground" />
                </div>
                <h1 className="text-2xl md:text-4xl font-bold text-foreground">Tixora</h1>
              </div>
            </div>
            <WalletConnectButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {currentStep === "details" && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Event Details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="relative">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-64 md:h-80 object-cover rounded-lg"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">{event.category}</Badge>
                </div>

                <div className="space-y-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">{event.title}</h1>

                  <div className="flex flex-wrap gap-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        {event.time && ` at ${event.time}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {event.location} - {event.venue}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{event.soldTickets.toLocaleString()} attending</span>
                    </div>
                  </div>

                  <p className="text-foreground leading-relaxed">{event.description}</p>

                  {event.unlockableContent && (
                    <Card className="border-primary/20 bg-primary/5">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Shield className="w-5 h-5 text-primary" />
                          Exclusive Perks for Ticket Holders
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground">{event.unlockableContent}</p>
                      </CardContent>
                    </Card>
                  )}

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-foreground">Event Organizer</h3>
                    <div className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-medium">
                          {event.organizer.slice(2, 4).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Verified Organizer</p>
                        <p className="text-sm text-muted-foreground font-mono">{event.organizer}</p>
                      </div>
                      <Badge variant="secondary" className="ml-auto">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchase Card */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Purchase Tickets</span>
                      <Badge variant="outline">{availableTickets} left</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary">
                        {event.price} {event.currency}
                      </p>
                      <p className="text-sm text-muted-foreground">per ticket</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">Quantity</span>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(1)}
                            disabled={quantity >= Math.min(10, availableTickets)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="font-medium">
                            {totalPrice} {event.currency}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Platform Fee</span>
                          <span className="font-medium text-primary">FREE</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gas Fee (est.)</span>
                          <span className="font-medium">~0.003 ETH</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                          <span className="text-foreground">Total</span>
                          <span className="text-primary">
                            {totalPrice} {event.currency}
                          </span>
                        </div>
                      </div>

                      <Button onClick={handlePurchase} className="w-full" size="lg">
                        <Wallet className="w-4 h-4 mr-2" />
                        Purchase Tickets
                      </Button>

                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Shield className="w-3 h-3" />
                          <span>Secured by blockchain technology</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="w-3 h-3" />
                          <span>Instant NFT delivery to your wallet</span>
                        </div>
                        {event.transferable && (
                          <div className="flex items-center gap-2">
                            <ExternalLink className="w-3 h-3" />
                            <span>Transferable and resellable</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Purchase Flow Dialogs */}
          <Dialog open={currentStep === "wallet"} onOpenChange={() => setCurrentStep("details")}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Connect Your Wallet</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-muted-foreground">Connect your Web3 wallet to purchase tickets as NFTs.</p>
                <div className="space-y-2">
                  <Button
                    onClick={() => handleWalletConnect("metamask")}
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <div className="w-6 h-6 bg-orange-500 rounded mr-3"></div>
                    MetaMask
                  </Button>
                  <Button
                    onClick={() => handleWalletConnect("walletconnect")}
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <div className="w-6 h-6 bg-blue-500 rounded mr-3"></div>
                    WalletConnect
                  </Button>
                  <Button
                    onClick={() => handleWalletConnect("coinbase")}
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <div className="w-6 h-6 bg-purple-500 rounded mr-3"></div>
                    Coinbase Wallet
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={currentStep === "confirm"} onOpenChange={() => setCurrentStep("details")}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Confirm Purchase</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {address && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Purchasing with wallet:</p>
                    <code className="text-sm font-mono">
                      {address.slice(0, 6)}...{address.slice(-4)}
                    </code>
                  </div>
                )}

                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Event</span>
                    <span className="font-medium">{event.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity</span>
                    <span className="font-medium">
                      {quantity} ticket{quantity > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-medium text-primary">
                      {totalPrice} {event.currency}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  This will mint {quantity} NFT ticket{quantity > 1 ? "s" : ""} to your wallet. The transaction cannot
                  be reversed.
                </p>
                <Button onClick={handleConfirmPurchase} disabled={isProcessing} className="w-full" size="lg">
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      Processing Transaction...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Confirm & Pay
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={currentStep === "success"} onOpenChange={() => setCurrentStep("details")}>
            <DialogContent className="sm:max-w-lg">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Purchase Successful!</h3>
                  <p className="text-muted-foreground">
                    Your NFT ticket{quantity > 1 ? "s have" : " has"} been minted and sent to your wallet.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transaction Hash</span>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(transactionHash)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <code className="text-xs break-all bg-background p-2 rounded block">{transactionHash}</code>
                  </div>

                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <p className="font-medium text-foreground">Your NFT Tickets</p>
                    <div className="flex flex-wrap gap-2">
                      {ticketTokenIds.map((tokenId) => (
                        <Badge key={tokenId} variant="secondary">
                          Token {tokenId}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Etherscan
                  </Button>
                  <Button className="flex-1" onClick={() => setCurrentStep("details")}>
                    View My Tickets
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
