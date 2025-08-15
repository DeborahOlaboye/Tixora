"use client"

import { useState } from "react"
import { Search, Calendar, MapPin, Users, Zap, Shield, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { WalletConnectButton } from "@/components/wallet-connect-button"

// Mock event data
const mockEvents = [
  {
    id: 1,
    title: "Web3 Music Festival 2024",
    date: "2024-03-15",
    location: "San Francisco, CA",
    price: "0.05 ETH",
    attendees: 2500,
    image: "/web3-music-festival-lights.png",
    category: "Music",
    organizer: "0x1234...5678",
  },
  {
    id: 2,
    title: "DeFi Summit Conference",
    date: "2024-03-22",
    location: "New York, NY",
    price: "0.08 ETH",
    attendees: 1200,
    image: "/defi-conference-blockchain-presentation.png",
    category: "Conference",
    organizer: "0xabcd...efgh",
  },
  {
    id: 3,
    title: "NFT Art Gallery Opening",
    date: "2024-03-28",
    location: "Los Angeles, CA",
    price: "0.03 ETH",
    attendees: 800,
    image: "/nft-art-gallery.png",
    category: "Art",
    organizer: "0x9876...5432",
  },
  {
    id: 4,
    title: "Crypto Gaming Tournament",
    date: "2024-04-05",
    location: "Austin, TX",
    price: "0.02 ETH",
    attendees: 500,
    image: "/crypto-gaming-tournament-esports.png",
    category: "Gaming",
    organizer: "0xfedc...ba98",
  },
]

export function EventDiscovery() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = ["All", "Music", "Conference", "Art", "Gaming", "Sports"]

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50 animate-slide-in-up">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/tixora-logo.png" alt="Tixora" className="h-8 w-auto" />
              <h1 className="text-2xl font-bold text-gray-900">Tixora</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">
                Discover
              </a>
              <a href="/create" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">
                Create Event
              </a>
              <a href="/tickets" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">
                My Tickets
              </a>
              <WalletConnectButton />
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 animate-slide-in-up">
            Decentralized Event
            <span className="text-gradient-brand block animate-glow">Ticketing</span>
          </h2>
          <p
            className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto animate-slide-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Own your tickets as NFTs. Zero platform fees. Instant payouts. Built on Ethereum for the Web3 era.
          </p>

          {/* Key Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            {[
              { icon: Shield, text: "Fraud-Proof NFTs", color: "text-purple-600" },
              { icon: Coins, text: "Zero Platform Fees", color: "text-cyan-500" },
              { icon: Zap, text: "Instant Payouts", color: "text-purple-600" },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-6 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-scale"
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                  <span className="text-gray-900 font-medium">{feature.text}</span>
                </div>
              )
            })}
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto animate-fade-in-scale" style={{ animationDelay: "0.6s" }}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search events, locations, or organizers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 bg-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-4 mb-8 bg-white">
        <div className="container mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category, index) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap transition-all duration-200 animate-fade-in-scale ${
                  selectedCategory === category
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "border-gray-300 text-gray-700 hover:border-purple-500 hover:text-purple-600"
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="px-4 pb-16 bg-white">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              {selectedCategory === "All" ? "All Events" : `${selectedCategory} Events`}
            </h3>
            <p className="text-gray-600">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event, index) => (
              <Card
                key={event.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group animate-fade-in-scale border-gray-200 bg-white"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3 bg-purple-600 text-white hover:bg-purple-700">
                    {event.category}
                  </Badge>
                </div>

                <CardHeader className="pb-3">
                  <h4 className="font-bold text-lg text-gray-900 line-clamp-2">{event.title}</h4>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">{event.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm">{event.attendees.toLocaleString()} attending</span>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="text-sm text-gray-500">Starting at</p>
                      <p className="font-bold text-lg text-purple-600">{event.price}</p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-cyan-500 hover:bg-cyan-600 text-white transition-colors duration-200"
                    >
                      View Event
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-16 animate-fade-in-scale">
              <p className="text-gray-600 text-lg mb-4">No events found matching your criteria.</p>
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("All")
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
