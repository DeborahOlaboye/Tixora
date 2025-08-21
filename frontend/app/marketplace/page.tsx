"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAccount, useWriteContract } from 'wagmi'
import { Search, Filter, TrendingUp, Clock, MapPin, Calendar, Ticket, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import eventsData from "@/data/events.json"
import { WalletConnectButton } from "@/components/wallet-connect-button"

export default function Marketplace() {
  const { address, isConnected } = useAccount()
  const { writeContract, isPending } = useWriteContract()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("trending")
  const [activeTab, setActiveTab] = useState("upcoming")
  const [purchasingEventId, setPurchasingEventId] = useState<number | null>(null)

  // Redirect to landing page if wallet is not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center p-8 bg-slate-800/50 rounded-lg border border-purple-500/30 backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-white mb-4">Wallet Connection Required</h1>
          <p className="text-slate-300 mb-6">Please connect your wallet to access the marketplace.</p>
          <WalletConnectButton className="mx-auto" />
        </div>
      </div>
    )
  }

  // Transform events data for marketplace display
  const upcomingEvents = eventsData.events
    .filter(event => event.status === "Upcoming")
    .map(event => ({
      id: parseInt(event.id),
      eventTitle: event.title,
      price: `${event.price} ${event.currency}`,
      date: new Date(event.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      location: `${event.city}, ${event.country}`,
      image: event.image,
      attendees: event.totalTickets,
      ticketsLeft: event.totalTickets - event.soldTickets,
      status: "upcoming",
      category: event.category,
      trending: event.featured, // Use featured as trending indicator
      createdAt: event.date,
    }))

  const pastEvents = eventsData.events
    .filter(event => event.status === "Passed")
    .map(event => ({
      id: parseInt(event.id),
      eventTitle: event.title,
      price: `${event.price} ${event.currency}`,
      date: new Date(event.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      location: `${event.city}, ${event.country}`,
      image: event.image,
      attendees: event.totalTickets,
      ticketsLeft: 0,
      status: "passed",
      category: event.category,
      trending: false,
      createdAt: event.date,
    }))

  const canceledEvents = eventsData.events
    .filter(event => event.status === "Canceled")
    .map(event => ({
      id: parseInt(event.id),
      eventTitle: event.title,
      price: `${event.price} ${event.currency}`,
      date: new Date(event.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      location: `${event.city}, ${event.country}`,
      image: event.image,
      attendees: event.totalTickets,
      ticketsLeft: event.totalTickets - event.soldTickets,
      status: "canceled",
      category: event.category,
      trending: false,
      createdAt: event.date,
    }))

  const closedEvents = eventsData.events
    .filter(event => event.status === "Closed")
    .map(event => ({
      id: parseInt(event.id),
      eventTitle: event.title,
      price: `${event.price} ${event.currency}`,
      date: new Date(event.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      location: `${event.city}, ${event.country}`,
      image: event.image,
      attendees: event.totalTickets,
      ticketsLeft: 0,
      status: "closed",
      category: event.category,
      trending: false,
      createdAt: event.date,
    }))

  const allEvents = [...upcomingEvents, ...pastEvents, ...canceledEvents, ...closedEvents]

  const legacyCompletedEvents = [
    {
      id: 15,
      eventTitle: "NFT Art Gallery Opening",
      price: "20 CELO",
      date: "Nov 25, 2024",
      location: "New York, NY",
      image: "/nft-art-gallery.png",
      attendees: 800,
      ticketsLeft: 0,
      status: "completed",
      category: "Art",
      trending: false,
      createdAt: "2024-11-10",
    },
    {
      id: 16,
      eventTitle: "DeFi Yield Farming Workshop",
      price: "15 CELO",
      date: "Nov 20, 2024",
      location: "Miami, FL",
      image: "/defi-yield-farming-workshop.png",
      attendees: 500,
      ticketsLeft: 0,
      status: "completed",
      category: "Education",
      trending: false,
      createdAt: "2024-11-05",
    },
    {
      id: 17,
      eventTitle: "Blockchain Innovation Summit",
      price: "60 CELO",
      date: "Nov 15, 2024",
      location: "Silicon Valley, CA",
      image: "/blockchain-developer-meetup.png",
      attendees: 3000,
      ticketsLeft: 0,
      status: "completed",
      category: "Conference",
      trending: false,
      createdAt: "2024-10-30",
    },
    {
      id: 18,
      eventTitle: "Crypto Startup Demo Day",
      price: "25 CELO",
      date: "Nov 10, 2024",
      location: "Boston, MA",
      image: "/web3-startup-pitch-night.png",
      attendees: 600,
      ticketsLeft: 0,
      status: "completed",
      category: "Business",
      trending: false,
      createdAt: "2024-10-25",
    },
    {
      id: 19,
      eventTitle: "Web3 Gaming Tournament",
      price: "30 CELO",
      date: "Nov 5, 2024",
      location: "Los Angeles, CA",
      image: "/crypto-gaming-tournament-esports.png",
      attendees: 1500,
      ticketsLeft: 0,
      status: "completed",
      category: "Gaming",
      trending: false,
      createdAt: "2024-10-20",
    },
    {
      id: 20,
      eventTitle: "Metaverse Architecture Expo",
      price: "35 CELO",
      date: "Oct 28, 2024",
      location: "Chicago, IL",
      image: "/metaverse-fashion-show.png",
      attendees: 400,
      ticketsLeft: 0,
      status: "completed",
      category: "Architecture",
      trending: false,
      createdAt: "2024-10-15",
    },
    {
      id: 21,
      eventTitle: "DeFi Protocol Launch",
      price: "40 CELO",
      date: "Oct 20, 2024",
      location: "New York, NY",
      image: "/defi-conference-blockchain-presentation.png",
      attendees: 1200,
      ticketsLeft: 0,
      status: "completed",
      category: "Finance",
      trending: false,
      createdAt: "2024-10-10",
    },
  ]

  const getEventsByTab = () => {
    let events = []
    switch (activeTab) {
      case "upcoming":
        events = upcomingEvents
        break
      case "passed":
        events = pastEvents
        break
      case "canceled":
        events = canceledEvents
        break
      case "closed":
        events = closedEvents
        break
      default:
        events = upcomingEvents
    }

    // Apply search filter first
    if (searchTerm) {
      events = events.filter(
        (event) =>
          event.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (sortBy === "recent") {
      events = [...events].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    // Note: Removed trending filter to ensure events always show in categories

    return events
  }

  const getStatusBadge = (event: any) => {
    if (event.status === "passed") {
      return <Badge className="bg-gray-500 text-white">Passed</Badge>
    }
    if (event.status === "canceled") {
      return <Badge className="bg-red-500 text-white">Canceled</Badge>
    }
    if (event.status === "closed") {
      return <Badge className="bg-orange-500 text-white">Closed</Badge>
    }
    if (event.ticketsLeft === 0 && event.status === "upcoming") {
      return <Badge className="bg-red-500 text-white">Sold Out</Badge>
    }
    return <Badge className="bg-purple-500 text-white">{event.ticketsLeft} left</Badge>
  }

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""

  const handlePurchaseTicket = async (event: any) => {
    if (!isConnected || !address) {
      alert("Please connect your wallet first")
      return
    }

    if (event.ticketsLeft === 0) {
      alert("Sorry, this event is sold out!")
      return
    }

    setPurchasingEventId(event.id)

    try {
      // Show transaction prompt
      const confirmed = window.confirm(
        `Purchase ticket for "${event.eventTitle}"?\n\nPrice: ${event.price}\nGas fee: ~0.002 CELO\n\nClick OK to approve the transaction in your wallet.`,
      )

      if (!confirmed) {
        setPurchasingEventId(null)
        return
      }

      // For demo purposes, simulate the transaction
      // In a real app, you would call writeContract with your smart contract
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Store purchased ticket in localStorage (in real app, this would be handled by smart contract events)
      const purchasedTickets = JSON.parse(localStorage.getItem("purchasedTickets") || "[]")
      const newTicket = {
        id: Date.now(),
        eventId: event.id,
        eventTitle: event.eventTitle,
        price: event.price,
        purchaseDate: new Date().toISOString(),
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        status: "confirmed",
        qrCode: `ticket-${event.id}-${Date.now()}`,
      }

      purchasedTickets.push(newTicket)
      localStorage.setItem("purchasedTickets", JSON.stringify(purchasedTickets))

      alert(
        `Ticket purchased successfully!\n\nEvent: ${event.eventTitle}\nPrice: ${event.price}\n\nYour NFT ticket has been added to your wallet. Check "My Tickets" to view it.`,
      )
    } catch (error) {
      console.error("Purchase error:", error)
      alert("Transaction failed. Please check your wallet and try again.")
    } finally {
      setPurchasingEventId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-foreground">
      {/* Dashboard Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/tixora-logo.png" alt="Tixora" width={40} height={40} />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Tixora
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-slate-300 hover:text-purple-400 transition-colors font-medium">
              Dashboard
            </Link>
            <Link href="/marketplace" className="text-purple-400 font-medium">
              Marketplace
            </Link>
            <Link href="/tickets" className="text-slate-300 hover:text-blue-400 transition-colors font-medium">
              My Tickets
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

      <div className="pb-16 px-4">
        <div className="container mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold mb-6">
              Event{" "}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Marketplace
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Discover amazing events and secure your NFT tickets on the blockchain. All transactions are verified and
              fraud-proof.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 bg-slate-800/50 border-slate-700 focus:border-purple-500 text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={sortBy === "trending" ? "default" : "outline"}
                onClick={() => setSortBy("trending")}
                className={
                  sortBy === "trending"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "border-slate-600 text-slate-300 hover:border-purple-500"
                }
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Trending
              </Button>
              <Button
                variant={sortBy === "recent" ? "default" : "outline"}
                onClick={() => setSortBy("recent")}
                className={
                  sortBy === "recent"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "border-slate-600 text-slate-300 hover:border-purple-500"
                }
              >
                <Clock className="w-4 h-4 mr-2" />
                Recent
              </Button>
              <Button
                variant={sortBy === "all" ? "default" : "outline"}
                onClick={() => setSortBy("all")}
                className={
                  sortBy === "all"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "border-slate-600 text-slate-300 hover:border-purple-500"
                }
              >
                <Filter className="w-4 h-4 mr-2" />
                All Events
              </Button>
            </div>
          </div>

          {/* Event Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-1 border border-slate-700">
              <Button
                variant={activeTab === "upcoming" ? "default" : "ghost"}
                onClick={() => setActiveTab("upcoming")}
                className={activeTab === "upcoming" ? "bg-purple-600 text-white" : "text-slate-300 hover:text-white"}
              >
                Upcoming Events
              </Button>
              <Button
                variant={activeTab === "passed" ? "default" : "ghost"}
                onClick={() => setActiveTab("passed")}
                className={activeTab === "passed" ? "bg-green-600 text-white" : "text-slate-300 hover:text-white"}
              >
                Passed
              </Button>
              <Button
                variant={activeTab === "canceled" ? "default" : "ghost"}
                onClick={() => setActiveTab("canceled")}
                className={activeTab === "canceled" ? "bg-gray-600 text-white" : "text-slate-300 hover:text-white"}
              >
                Canceled
              </Button>
              <Button
                variant={activeTab === "closed" ? "default" : "ghost"}
                onClick={() => setActiveTab("closed")}
                className={activeTab === "closed" ? "bg-slate-600 text-white" : "text-slate-300 hover:text-white"}
              >
                Closed
              </Button>
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {getEventsByTab().map((event, index) => (
              <Card
                key={event.id}
                className="group cursor-pointer bg-slate-800/50 border-slate-700 hover:border-purple-500/50 backdrop-blur-sm"
              >
                <CardContent className="p-0 h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.eventTitle}
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute top-4 left-4 bg-blue-600">{event.category}</Badge>
                    <div className="absolute top-4 right-4">{getStatusBadge(event)}</div>
                    {event.trending && (
                      <Badge className="absolute bottom-4 left-4 bg-orange-500 text-white">🔥 Trending</Badge>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-semibold mb-2 text-white">{event.eventTitle}</h3>

                    <div className="space-y-2 text-sm text-slate-400 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-400" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-400" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-400" />
                        {event.attendees.toLocaleString()} attendees
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        {event.price}
                      </span>
                      {event.status === "upcoming" && event.ticketsLeft > 0 ? (
                        <Button
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                          onClick={() => handlePurchaseTicket(event)}
                          disabled={isPending || purchasingEventId === event.id}
                        >
                          <Ticket className="h-4 w-4 mr-2" />
                          {purchasingEventId === event.id ? "Processing..." : "Buy Now"}
                        </Button>
                      ) : (
                        <Button
                          className="bg-slate-600 text-slate-300 cursor-not-allowed"
                          disabled
                        >
                          <Ticket className="h-4 w-4 mr-2" />
                          {event.status === "passed" ? "Event Ended" : 
                           event.status === "canceled" ? "Canceled" : 
                           event.status === "closed" ? "Sold Out" : "Unavailable"}
                        </Button>
                      )}
                      {event.status === "ongoing" && (
                        <Button className="bg-green-500 hover:bg-green-600 text-white">Join Live</Button>
                      )}
                      {event.status === "completed" && (
                        <Button
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:border-purple-500 bg-transparent"
                        >
                          View Details
                        </Button>
                      )}
                      {event.status === "upcoming" && event.ticketsLeft === 0 && (
                        <Button disabled className="bg-gray-600 text-gray-400">
                          Sold Out
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="text-center p-6 bg-slate-800/50 border-slate-700">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                {upcomingEvents.length + pastEvents.length + canceledEvents.length + closedEvents.length}+
              </div>
              <div className="text-sm text-slate-400">Active Events</div>
            </Card>
            <Card className="text-center p-6 bg-slate-800/50 border-slate-700">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                50K+
              </div>
              <div className="text-sm text-slate-400">Tickets Sold</div>
            </Card>
            <Card className="text-center p-6 bg-slate-800/50 border-slate-700">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                25K+
              </div>
              <div className="text-sm text-slate-400">Happy Users</div>
            </Card>
            <Card className="text-center p-6 bg-slate-800/50 border-slate-700">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                Zero
              </div>
              <div className="text-sm text-slate-400">Fraud Cases</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
