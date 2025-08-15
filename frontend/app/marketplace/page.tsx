"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useWallet } from "@/lib/wallet-context"
import { Search, Filter, TrendingUp, Clock, MapPin, Calendar, Ticket, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Marketplace() {
  const { address, purchaseTicket, isTransacting } = useWallet()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("trending")
  const [activeTab, setActiveTab] = useState("upcoming")
  const [purchasingEventId, setPurchasingEventId] = useState<number | null>(null)

  const upcomingEvents = [
    {
      id: 1,
      eventTitle: "Web3 Music Festival 2024",
      price: "25 CELO",
      date: "Dec 15, 2024",
      location: "Miami Beach, FL",
      image: "/web3-music-festival-lights.png",
      attendees: 5000,
      ticketsLeft: 60,
      status: "upcoming",
      category: "Music",
      trending: true,
      createdAt: "2024-12-01",
    },
    {
      id: 2,
      eventTitle: "Blockchain Developer Meetup",
      price: "12 CELO",
      date: "Dec 20, 2024",
      location: "Austin, TX",
      image: "/blockchain-developer-meetup.png",
      attendees: 300,
      ticketsLeft: 45,
      status: "upcoming",
      category: "Tech",
      trending: false,
      createdAt: "2024-11-28",
    },
    {
      id: 3,
      eventTitle: "Web3 Startup Pitch Night",
      price: "18 CELO",
      date: "Jan 5, 2025",
      location: "San Francisco, CA",
      image: "/web3-startup-pitch-night.png",
      attendees: 800,
      ticketsLeft: 120,
      status: "upcoming",
      category: "Business",
      trending: true,
      createdAt: "2024-12-05",
    },
    {
      id: 4,
      eventTitle: "NFT Creator Workshop",
      price: "30 CELO",
      date: "Jan 8, 2025",
      location: "Los Angeles, CA",
      image: "/nft-art-gallery.png",
      attendees: 200,
      ticketsLeft: 85,
      status: "upcoming",
      category: "Art",
      trending: false,
      createdAt: "2024-11-25",
    },
    {
      id: 5,
      eventTitle: "DeFi Investment Summit",
      price: "45 CELO",
      date: "Jan 12, 2025",
      location: "New York, NY",
      image: "/defi-conference-blockchain-presentation.png",
      attendees: 1500,
      ticketsLeft: 200,
      status: "upcoming",
      category: "Finance",
      trending: true,
      createdAt: "2024-12-03",
    },
    {
      id: 6,
      eventTitle: "Crypto Gaming Championship",
      price: "35 CELO",
      date: "Jan 15, 2025",
      location: "Las Vegas, NV",
      image: "/crypto-gaming-tournament-esports.png",
      attendees: 2000,
      ticketsLeft: 150,
      status: "upcoming",
      category: "Gaming",
      trending: true,
      createdAt: "2024-12-02",
    },
    {
      id: 7,
      eventTitle: "Metaverse Real Estate Expo",
      price: "28 CELO",
      date: "Jan 18, 2025",
      location: "Chicago, IL",
      image: "/metaverse-fashion-show.png",
      attendees: 600,
      ticketsLeft: 75,
      status: "upcoming",
      category: "Real Estate",
      trending: false,
      createdAt: "2024-11-20",
    },
    {
      id: 8,
      eventTitle: "Web3 Security Conference",
      price: "40 CELO",
      date: "Jan 22, 2025",
      location: "Seattle, WA",
      image: "/blockchain-developer-meetup.png",
      attendees: 800,
      ticketsLeft: 0,
      status: "upcoming",
      category: "Security",
      trending: false,
      createdAt: "2024-11-15",
    },
    {
      id: 9,
      eventTitle: "DAO Governance Workshop",
      price: "22 CELO",
      date: "Jan 25, 2025",
      location: "Denver, CO",
      image: "/defi-yield-farming-workshop.png",
      attendees: 400,
      ticketsLeft: 95,
      status: "upcoming",
      category: "Education",
      trending: false,
      createdAt: "2024-12-04",
    },
  ]

  const ongoingEvents = [
    {
      id: 10,
      eventTitle: "DeFi Conference Summit",
      price: "35 CELO",
      date: "Dec 10-12, 2024",
      location: "New York, NY",
      image: "/defi-conference-blockchain-presentation.png",
      attendees: 2500,
      ticketsLeft: 0,
      status: "ongoing",
      category: "Conference",
      trending: true,
      createdAt: "2024-11-30",
    },
    {
      id: 11,
      eventTitle: "Metaverse Fashion Show",
      price: "22 CELO",
      date: "Dec 8-10, 2024",
      location: "Los Angeles, CA",
      image: "/metaverse-fashion-show.png",
      attendees: 1200,
      ticketsLeft: 15,
      status: "ongoing",
      category: "Fashion",
      trending: true,
      createdAt: "2024-11-25",
    },
    {
      id: 12,
      eventTitle: "Crypto Trading Bootcamp",
      price: "50 CELO",
      date: "Dec 9-11, 2024",
      location: "Miami, FL",
      image: "/defi-yield-farming-workshop.png",
      attendees: 300,
      ticketsLeft: 8,
      status: "ongoing",
      category: "Education",
      trending: false,
      createdAt: "2024-11-22",
    },
    {
      id: 13,
      eventTitle: "NFT Marketplace Launch",
      price: "15 CELO",
      date: "Dec 10-12, 2024",
      location: "Austin, TX",
      image: "/nft-art-gallery.png",
      attendees: 500,
      ticketsLeft: 25,
      status: "ongoing",
      category: "Art",
      trending: false,
      createdAt: "2024-11-18",
    },
    {
      id: 14,
      eventTitle: "Web3 Hackathon Finals",
      price: "Free",
      date: "Dec 11-12, 2024",
      location: "San Francisco, CA",
      image: "/web3-startup-pitch-night.png",
      attendees: 1000,
      ticketsLeft: 50,
      status: "ongoing",
      category: "Tech",
      trending: true,
      createdAt: "2024-11-28",
    },
  ]

  const completedEvents = [
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
      case "ongoing":
        events = ongoingEvents
        break
      case "completed":
        events = completedEvents
        break
      default:
        events = upcomingEvents
    }

    if (sortBy === "trending") {
      events = events.filter((event) => event.trending)
    } else if (sortBy === "recent") {
      events = [...events].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    // Apply search filter
    if (searchTerm) {
      events = events.filter(
        (event) =>
          event.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    return events
  }

  const getStatusBadge = (event: any) => {
    if (event.status === "ongoing") {
      return <Badge className="bg-green-500 text-white animate-pulse">🔴 Live Now</Badge>
    }
    if (event.ticketsLeft === 0 && event.status === "upcoming") {
      return <Badge className="bg-red-500 text-white">Sold Out</Badge>
    }
    if (event.status === "completed") {
      return <Badge className="bg-gray-500 text-white">Completed</Badge>
    }
    return <Badge className="bg-purple-500 text-white">{event.ticketsLeft} left</Badge>
  }

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""

  const handlePurchaseTicket = async (event: any) => {
    if (!address) {
      alert("Please connect your wallet first")
      return
    }

    if (event.ticketsLeft === 0) {
      alert("Sorry, this event is sold out!")
      return
    }

    setPurchasingEventId(event.id)

    try {
      const success = await purchaseTicket(event.id, event.price, event.eventTitle)

      if (success) {
        alert(
          `🎉 Ticket purchased successfully!\n\nEvent: ${event.eventTitle}\nPrice: ${event.price}\n\nYour NFT ticket has been added to your wallet. Check "My Tickets" to view it.`,
        )

        // In a real app, you would update the event's ticket count via smart contract events
        // For demo purposes, we'll just show the success message
      } else {
        alert("Purchase cancelled or failed. Please try again.")
      }
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
            <div className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-purple-500/30">
              <span className="text-sm font-medium text-purple-300">{shortAddress}</span>
            </div>
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
                Upcoming Events ({upcomingEvents.length})
              </Button>
              <Button
                variant={activeTab === "ongoing" ? "default" : "ghost"}
                onClick={() => setActiveTab("ongoing")}
                className={activeTab === "ongoing" ? "bg-green-600 text-white" : "text-slate-300 hover:text-white"}
              >
                Live Events ({ongoingEvents.length})
              </Button>
              <Button
                variant={activeTab === "completed" ? "default" : "ghost"}
                onClick={() => setActiveTab("completed")}
                className={activeTab === "completed" ? "bg-gray-600 text-white" : "text-slate-300 hover:text-white"}
              >
                Past Events ({completedEvents.length})
              </Button>
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getEventsByTab().map((event, index) => (
              <Card
                key={event.id}
                className="group cursor-pointer bg-slate-800/50 border-slate-700 hover:border-purple-500/50 backdrop-blur-sm"
              >
                <CardContent className="p-0">
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

                  <div className="p-6">
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

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        {event.price}
                      </span>
                      {event.status === "upcoming" && event.ticketsLeft > 0 && (
                        <Button
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                          onClick={() => handlePurchaseTicket(event)}
                          disabled={isTransacting || purchasingEventId === event.id}
                        >
                          <Ticket className="h-4 w-4 mr-2" />
                          {purchasingEventId === event.id ? "Processing..." : "Buy Now"}
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
                {upcomingEvents.length + ongoingEvents.length}+
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
