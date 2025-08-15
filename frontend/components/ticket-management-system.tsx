"use client"

import { useState, useEffect } from "react"
import { Calendar, QrCode, Send, ExternalLink, Copy, Search, MoreVertical, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { useWallet } from "@/lib/wallet-context"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import Link from "next/link"
import Image from "next/image"

interface NFTTicket {
  id: number
  eventId: number
  eventTitle: string
  price: string
  purchaseDate: string
  txHash: string
  status: string
  qrCode: string
}

type TicketAction = "view" | "transfer" | "qr" | null

export function TicketManagementSystem() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<NFTTicket | null>(null)
  const [currentAction, setCurrentAction] = useState<TicketAction>(null)
  const [transferAddress, setTransferAddress] = useState("")
  const [isTransferring, setIsTransferring] = useState(false)
  const [purchasedTickets, setPurchasedTickets] = useState<NFTTicket[]>([])

  const { isConnected, address } = useWallet()

  // Load purchased tickets from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const tickets = JSON.parse(localStorage.getItem("purchasedTickets") || "[]")
      setPurchasedTickets(tickets)
    }
  }, [])

  const categories = ["all", "upcoming", "past"]

  const filteredTickets = purchasedTickets.filter((ticket) => {
    const matchesSearch = ticket.eventTitle.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "upcoming" && ticket.status === "confirmed") ||
      (selectedCategory === "past" && ticket.status === "used")

    return matchesSearch && matchesCategory
  })

  const handleTicketAction = (ticket: NFTTicket, action: TicketAction) => {
    setSelectedTicket(ticket)
    setCurrentAction(action)
  }

  const handleTransfer = async () => {
    if (!selectedTicket || !transferAddress) return

    setIsTransferring(true)
    // Simulate transfer transaction
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsTransferring(false)
    setCurrentAction(null)
    setTransferAddress("")
    // In real app, update ticket ownership
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500 text-white"
      case "used":
        return "bg-gray-500 text-white"
      default:
        return "bg-purple-500 text-white"
    }
  }

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-foreground">
        {/* Dashboard Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Image src="/tixora-logo.png" alt="Tixora" width={40} height={40} />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Tixora
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/dashboard" className="text-slate-300 hover:text-purple-400 transition-colors font-medium">
                Dashboard
              </Link>
              <Link href="/marketplace" className="text-slate-300 hover:text-blue-400 transition-colors font-medium">
                Marketplace
              </Link>
              <Link href="/tickets" className="text-purple-400 font-medium">
                Tickets
              </Link>
              <Link href="/create-event" className="text-slate-300 hover:text-purple-400 transition-colors font-medium">
                Create Event
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <WalletConnectButton />
            </div>
          </div>
        </header>

        {/* Connect Wallet Prompt */}
        <div className="container mx-auto px-4 py-16 pt-24">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto">
              <QrCode className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
              <p className="text-slate-300">Connect your Web3 wallet to view and manage your NFT tickets.</p>
            </div>
            <WalletConnectButton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-foreground">
      {/* Dashboard Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Image src="/tixora-logo.png" alt="Tixora" width={40} height={40} />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Tixora
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-slate-300 hover:text-purple-400 transition-colors font-medium">
              Dashboard
            </Link>
            <Link href="/marketplace" className="text-slate-300 hover:text-blue-400 transition-colors font-medium">
              Marketplace
            </Link>
            <Link href="/tickets" className="text-purple-400 font-medium">
              Tickets
            </Link>
            <Link href="/create-event" className="text-slate-300 hover:text-purple-400 transition-colors font-medium">
              Create Event
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-purple-500/30">
              <span className="text-sm font-medium text-purple-300">{shortAddress}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Tickets
            </h1>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{purchasedTickets.length}</p>
                    <p className="text-sm text-slate-400">Total Tickets</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {purchasedTickets.filter((t) => t.status === "confirmed").length}
                    </p>
                    <p className="text-sm text-slate-400">Upcoming Events</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <ExternalLink className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{purchasedTickets.length}</p>
                    <p className="text-sm text-slate-400">Transferable</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search tickets by event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700 focus:border-purple-500 text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
                className={
                  selectedCategory === "all"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "border-slate-600 text-slate-300 hover:border-purple-500"
                }
              >
                All
              </Button>
              <Button
                variant={selectedCategory === "upcoming" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("upcoming")}
                className={
                  selectedCategory === "upcoming"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "border-slate-600 text-slate-300 hover:border-purple-500"
                }
              >
                Upcoming
              </Button>
              <Button
                variant={selectedCategory === "past" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("past")}
                className={
                  selectedCategory === "past"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "border-slate-600 text-slate-300 hover:border-purple-500"
                }
              >
                Past
              </Button>
            </div>
          </div>

          {/* Tickets Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTickets.map((ticket) => (
              <Card
                key={ticket.id}
                className="overflow-hidden bg-slate-800/50 border-slate-700 hover:border-purple-500/50"
              >
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-purple-400" />
                  </div>
                  <Badge className={`absolute top-3 right-3 ${getStatusColor(ticket.status)}`}>
                    {ticket.status === "confirmed" ? "Valid" : "Used"}
                  </Badge>
                  <div className="absolute bottom-3 right-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="sm" className="bg-slate-700 hover:bg-slate-600">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                        <DropdownMenuItem onClick={() => handleTicketAction(ticket, "view")}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTicketAction(ticket, "qr")}>
                          <QrCode className="w-4 h-4 mr-2" />
                          Show QR Code
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTicketAction(ticket, "transfer")}>
                          <Send className="w-4 h-4 mr-2" />
                          Transfer Ticket
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => window.open(`https://celoscan.io/tx/${ticket.txHash}`, "_blank")}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View on Celoscan
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-2 text-white">{ticket.eventTitle}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {new Date(ticket.purchaseDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="text-xs text-slate-400">Ticket ID</p>
                      <p className="font-mono text-sm text-purple-300">#{ticket.qrCode}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Paid</p>
                      <p className="font-medium text-purple-400">{ticket.price}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTickets.length === 0 && (
            <div className="text-center py-16">
              <QrCode className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Tickets Found</h3>
              <p className="text-slate-400 mb-4">
                {searchQuery || selectedCategory !== "all"
                  ? "No tickets match your current filters."
                  : "You don't have any tickets yet. Visit the marketplace to purchase some!"}
              </p>
              <Link href="/marketplace">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  {searchQuery || selectedCategory !== "all" ? "Clear Filters" : "Discover Events"}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Details Dialog */}
      <Dialog open={currentAction === "view"} onOpenChange={() => setCurrentAction(null)}>
        <DialogContent className="sm:max-w-2xl bg-slate-800 border-slate-700">
          {selectedTicket && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="text-white">{selectedTicket.eventTitle}</DialogTitle>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="w-full h-48 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-purple-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ticket ID</span>
                      <span className="font-mono text-purple-300">#{selectedTicket.qrCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Purchase Price</span>
                      <span className="font-medium text-purple-400">{selectedTicket.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Purchase Date</span>
                      <span className="text-white">{new Date(selectedTicket.purchaseDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status</span>
                      <Badge className={getStatusColor(selectedTicket.status)}>
                        {selectedTicket.status === "confirmed" ? "Valid" : "Used"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Transaction Details</h4>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-slate-700 p-2 rounded flex-1 truncate text-slate-300">
                        {selectedTicket.txHash}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(selectedTicket.txHash)}
                        className="text-slate-400 hover:text-white"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => window.open(`https://celoscan.io/tx/${selectedTicket.txHash}`, "_blank")}
                  className="border-slate-600 text-slate-300 hover:border-purple-500"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Celoscan
                </Button>
                <Button
                  onClick={() => handleTicketAction(selectedTicket, "qr")}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Show QR Code
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={currentAction === "qr"} onOpenChange={() => setCurrentAction(null)}>
        <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700">
          {selectedTicket && (
            <div className="text-center space-y-6">
              <DialogHeader>
                <DialogTitle className="text-white">Entry QR Code</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center mx-auto">
                  <QrCode className="w-24 h-24 text-slate-800" />
                </div>
                <div>
                  <p className="font-medium text-white">{selectedTicket.eventTitle}</p>
                  <p className="text-sm text-slate-400">Ticket #{selectedTicket.qrCode}</p>
                </div>
                <p className="text-xs text-slate-400">Show this QR code at the event entrance for verification</p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-300 hover:border-purple-500 bg-transparent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={() => setCurrentAction(null)}>
                  Done
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Transfer Dialog */}
      <Dialog open={currentAction === "transfer"} onOpenChange={() => setCurrentAction(null)}>
        <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700">
          {selectedTicket && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="text-white">Transfer Ticket</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="p-4 bg-slate-700 rounded-lg">
                  <p className="font-medium text-white">{selectedTicket.eventTitle}</p>
                  <p className="text-sm text-slate-400">Ticket #{selectedTicket.qrCode}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transferAddress" className="text-slate-300">
                    Recipient Wallet Address
                  </Label>
                  <Input
                    id="transferAddress"
                    placeholder="0x..."
                    value={transferAddress}
                    onChange={(e) => setTransferAddress(e.target.value)}
                    className="bg-slate-700 border-slate-600 focus:border-purple-500 text-white"
                  />
                </div>

                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-sm text-yellow-300">
                    Warning: This action cannot be undone. Make sure the recipient address is correct.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentAction(null)}
                  className="flex-1 border-slate-600 text-slate-300 hover:border-purple-500"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleTransfer}
                  disabled={!transferAddress || isTransferring}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  {isTransferring ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Transferring...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Transfer
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
