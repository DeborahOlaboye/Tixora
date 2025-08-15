"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Award,
  Calendar,
  MapPin,
  Users,
  Zap,
  CheckCircle,
  Clock,
  Star,
  Trophy,
  Medal,
  Search,
  ExternalLink,
  Share2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWallet } from "@/lib/wallet-context"
import { WalletConnectButton } from "@/components/wallet-connect-button"

interface POAPBadge {
  id: string
  eventId: string
  eventTitle: string
  eventDate: string
  location: string
  category: string
  image: string
  badgeImage: string
  description: string
  attendees: number
  claimed: boolean
  claimDate?: string
  rarity: "common" | "rare" | "legendary"
  organizer: string
  transactionHash?: string
}

interface ClaimablePOAP {
  id: string
  eventId: string
  eventTitle: string
  eventDate: string
  location: string
  category: string
  image: string
  badgeImage: string
  description: string
  attendees: number
  claimDeadline: string
  organizer: string
}

// Mock POAP data
const mockPOAPs: POAPBadge[] = [
  {
    id: "1",
    eventId: "3",
    eventTitle: "NFT Art Gallery Opening",
    eventDate: "2024-01-15",
    location: "Los Angeles, CA",
    category: "Art",
    image: "/nft-art-gallery.png",
    badgeImage: "/nft-art-gallery.png",
    description:
      "Attended the exclusive NFT Art Gallery Opening featuring digital masterpieces from renowned Web3 artists.",
    attendees: 800,
    claimed: true,
    claimDate: "2024-01-16",
    rarity: "rare",
    organizer: "0x9876...5432",
    transactionHash: "0xpoap1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
  },
  {
    id: "2",
    eventId: "4",
    eventTitle: "Crypto Gaming Tournament",
    eventDate: "2024-02-10",
    location: "Austin, TX",
    category: "Gaming",
    image: "/crypto-gaming-tournament-esports.png",
    badgeImage: "/crypto-gaming-tournament-esports.png",
    description: "Participated in the ultimate crypto gaming tournament with top players from around the world.",
    attendees: 500,
    claimed: true,
    claimDate: "2024-02-11",
    rarity: "legendary",
    organizer: "0xfedc...ba98",
    transactionHash: "0xpoap9876543210fedcba9876543210fedcba9876543210fedcba9876543210",
  },
]

const mockClaimablePOAPs: ClaimablePOAP[] = [
  {
    id: "3",
    eventId: "1",
    eventTitle: "Web3 Music Festival 2024",
    eventDate: "2024-03-15",
    location: "San Francisco, CA",
    category: "Music",
    image: "/web3-music-festival-lights.png",
    badgeImage: "/web3-music-festival-lights.png",
    description: "Experienced the biggest Web3 music festival with cutting-edge performances and NFT experiences.",
    attendees: 2500,
    claimDeadline: "2024-04-15",
    organizer: "0x1234...5678",
  },
]

export function ProofOfAttendanceSystem() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPOAP, setSelectedPOAP] = useState<POAPBadge | null>(null)
  const [selectedClaimable, setSelectedClaimable] = useState<ClaimablePOAP | null>(null)
  const [isClaiming, setIsClaiming] = useState(false)
  const [showClaimDialog, setShowClaimDialog] = useState(false)
  const [showPOAPDialog, setShowPOAPDialog] = useState(false)

  const { isConnected } = useWallet()

  const categories = ["all", "music", "conference", "art", "gaming", "sports"]

  const filteredPOAPs = mockPOAPs.filter((poap) => {
    const matchesSearch =
      poap.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poap.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || poap.category.toLowerCase() === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleClaimPOAP = async (claimable: ClaimablePOAP) => {
    setSelectedClaimable(claimable)
    setShowClaimDialog(true)
  }

  const confirmClaim = async () => {
    if (!selectedClaimable) return

    setIsClaiming(true)
    // Simulate POAP claiming transaction
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // Add to claimed POAPs (in real app, this would update the backend)
    const newPOAP: POAPBadge = {
      id: Date.now().toString(),
      eventId: selectedClaimable.eventId,
      eventTitle: selectedClaimable.eventTitle,
      eventDate: selectedClaimable.eventDate,
      location: selectedClaimable.location,
      category: selectedClaimable.category,
      image: selectedClaimable.image,
      badgeImage: selectedClaimable.badgeImage,
      description: selectedClaimable.description,
      attendees: selectedClaimable.attendees,
      claimed: true,
      claimDate: new Date().toISOString().split("T")[0],
      rarity: "common",
      organizer: selectedClaimable.organizer,
      transactionHash: "0xnewpoap" + Math.random().toString(16).substr(2, 40),
    }

    mockPOAPs.push(newPOAP)
    setIsClaiming(false)
    setShowClaimDialog(false)
    setSelectedClaimable(null)
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-500/10 text-gray-700 border-gray-500/20"
      case "rare":
        return "bg-blue-500/10 text-blue-700 border-blue-500/20"
      case "legendary":
        return "bg-purple-500/10 text-purple-700 border-purple-500/20"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-500/20"
    }
  }

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "common":
        return <Medal className="w-4 h-4" />
      case "rare":
        return <Star className="w-4 h-4" />
      case "legendary":
        return <Trophy className="w-4 h-4" />
      default:
        return <Award className="w-4 h-4" />
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground">Proof of Attendance</h1>
                </div>
              </div>
              <WalletConnectButton />
            </div>
          </div>
        </header>

        {/* Connect Wallet Prompt */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Award className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Connect Your Wallet</h2>
              <p className="text-muted-foreground">
                Connect your Web3 wallet to view and claim your Proof of Attendance badges.
              </p>
            </div>
            <WalletConnectButton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Proof of Attendance</h1>
              </div>
            </div>
            <WalletConnectButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Your Event Journey</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Collect permanent on-chain badges that prove your attendance at exclusive Web3 events.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{mockPOAPs.length}</p>
                    <p className="text-sm text-muted-foreground">Badges Earned</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {mockPOAPs.filter((p) => p.rarity === "rare").length}
                    </p>
                    <p className="text-sm text-muted-foreground">Rare Badges</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {mockPOAPs.filter((p) => p.rarity === "legendary").length}
                    </p>
                    <p className="text-sm text-muted-foreground">Legendary</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{mockClaimablePOAPs.length}</p>
                    <p className="text-sm text-muted-foreground">Available to Claim</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="collection" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="collection">My Collection</TabsTrigger>
              <TabsTrigger value="claimable">
                Available to Claim {mockClaimablePOAPs.length > 0 && `(${mockClaimablePOAPs.length})`}
              </TabsTrigger>
            </TabsList>

            {/* My Collection Tab */}
            <TabsContent value="collection" className="space-y-6">
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search your badges..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("all")}
                  >
                    All
                  </Button>
                  {categories.slice(1).map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="capitalize"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* POAP Collection Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPOAPs.map((poap) => (
                  <Card
                    key={poap.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => {
                      setSelectedPOAP(poap)
                      setShowPOAPDialog(true)
                    }}
                  >
                    <div className="relative">
                      <img
                        src={poap.badgeImage || "/placeholder.svg"}
                        alt={poap.eventTitle}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                        {poap.category}
                      </Badge>
                      <Badge className={`absolute top-3 right-3 ${getRarityColor(poap.rarity)}`}>
                        {getRarityIcon(poap.rarity)}
                        <span className="ml-1 capitalize">{poap.rarity}</span>
                      </Badge>
                    </div>

                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg line-clamp-2">{poap.eventTitle}</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {new Date(poap.eventDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{poap.location}</span>
                      </div>

                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{poap.attendees.toLocaleString()} attendees</span>
                      </div>

                      {poap.claimDate && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Claimed {new Date(poap.claimDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredPOAPs.length === 0 && (
                <div className="text-center py-16">
                  <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">No Badges Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || selectedCategory !== "all"
                      ? "No badges match your current filters."
                      : "You haven't earned any badges yet. Attend events to start collecting!"}
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("all")
                    }}
                  >
                    {searchQuery || selectedCategory !== "all" ? "Clear Filters" : "Discover Events"}
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Claimable Tab */}
            <TabsContent value="claimable" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockClaimablePOAPs.map((claimable) => (
                  <Card key={claimable.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={claimable.badgeImage || "/placeholder.svg"}
                        alt={claimable.eventTitle}
                        className="w-full h-48 object-cover"
                      />
                      <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                        {claimable.category}
                      </Badge>
                      <Badge className="absolute top-3 right-3 bg-green-500 text-white">Available</Badge>
                    </div>

                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg line-clamp-2">{claimable.eventTitle}</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            {new Date(claimable.eventDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{claimable.location}</span>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">
                            Claim by {new Date(claimable.claimDeadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <Button onClick={() => handleClaimPOAP(claimable)} className="w-full">
                        <Award className="w-4 h-4 mr-2" />
                        Claim Badge
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {mockClaimablePOAPs.length === 0 && (
                <div className="text-center py-16">
                  <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">No Badges to Claim</h3>
                  <p className="text-muted-foreground mb-4">
                    You're all caught up! Check back after attending more events.
                  </p>
                  <Button>Discover Events</Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* POAP Details Dialog */}
      <Dialog open={showPOAPDialog} onOpenChange={setShowPOAPDialog}>
        <DialogContent className="sm:max-w-2xl">
          {selectedPOAP && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getRarityIcon(selectedPOAP.rarity)}
                  {selectedPOAP.eventTitle}
                </DialogTitle>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <img
                    src={selectedPOAP.badgeImage || "/placeholder.svg"}
                    alt={selectedPOAP.eventTitle}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="flex gap-2">
                    <Badge className={getRarityColor(selectedPOAP.rarity)}>
                      {getRarityIcon(selectedPOAP.rarity)}
                      <span className="ml-1 capitalize">{selectedPOAP.rarity}</span>
                    </Badge>
                    <Badge variant="secondary">{selectedPOAP.category}</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{selectedPOAP.description}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Event Details</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(selectedPOAP.eventDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedPOAP.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{selectedPOAP.attendees.toLocaleString()} total attendees</span>
                      </div>
                      {selectedPOAP.claimDate && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Claimed on {new Date(selectedPOAP.claimDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedPOAP.transactionHash && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Transaction</h4>
                      <code className="text-xs bg-muted p-2 rounded block break-all">
                        {selectedPOAP.transactionHash}
                      </code>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Badge
                </Button>
                {selectedPOAP.transactionHash && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(`https://etherscan.io/tx/${selectedPOAP.transactionHash}`, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Etherscan
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Claim POAP Dialog */}
      <Dialog open={showClaimDialog} onOpenChange={setShowClaimDialog}>
        <DialogContent className="sm:max-w-md">
          {selectedClaimable && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle>Claim Your Badge</DialogTitle>
              </DialogHeader>

              <div className="text-center space-y-4">
                <img
                  src={selectedClaimable.badgeImage || "/placeholder.svg"}
                  alt={selectedClaimable.eventTitle}
                  className="w-32 h-32 object-cover rounded-lg mx-auto"
                />
                <div>
                  <h3 className="font-bold text-lg">{selectedClaimable.eventTitle}</h3>
                  <p className="text-sm text-muted-foreground">{selectedClaimable.description}</p>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Event Date</span>
                  <span>{new Date(selectedClaimable.eventDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Location</span>
                  <span>{selectedClaimable.location}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Claim Deadline</span>
                  <span>{new Date(selectedClaimable.claimDeadline).toLocaleDateString()}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                This will mint a permanent Proof of Attendance badge to your wallet.
              </p>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowClaimDialog(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={confirmClaim} disabled={isClaiming} className="flex-1">
                  {isClaiming ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      Claiming...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Claim Badge
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
