"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, MapPin, Users, Ticket, Star, Shield, Zap, Globe, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAccount } from "wagmi"
import { WalletConnectButton } from "./wallet-connect-button"
import Image from "next/image"
import Link from "next/link"
import eventsData from "@/data/events.json"

// Get featured events from the centralized events data
const featuredEvents = eventsData.events
  .filter(event => event.featured && event.status === "Upcoming")
  .map(event => ({
    id: event.id,
    title: event.title,
    date: new Date(event.date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }),
    location: `${event.city}, ${event.country}`,
    price: `${event.price} ${event.currency}`,
    image: event.image,
    attendees: event.totalTickets,
    category: event.category,
    ticketsLeft: event.totalTickets - event.soldTickets,
  }))

export function LandingPage() {
  const { isConnected } = useAccount()
  const router = useRouter()
  const [currentEventIndex, setCurrentEventIndex] = useState(0)

  useEffect(() => {
    if (isConnected) {
      router.push("/dashboard")
    }
  }, [isConnected, router])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEventIndex((prev) => (prev + 1) % featuredEvents.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 animate-bounce-in">
            <Image src="/tixora-logo.png" alt="Tixora" width={40} height={40} className="animate-pulse-glow" />
            <span className="text-2xl font-bold gradient-text">Tixora</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="https://github.com/DIFoundation/Tixora/blob/main/README.md" className="text-muted-foreground hover:text-primary transition-colors">
              Docs
            </Link>
            <Link href="/resources" className="text-muted-foreground hover:text-primary transition-colors">
              Resources
            </Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
              How It Works
            </Link>
          </nav>

          <WalletConnectButton />
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 animate-gradient" />

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full animate-float" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-secondary/20 rounded-full animate-float animate-delay-200" />
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-primary/30 rounded-full animate-float animate-delay-400" />

        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 opacity-0 animate-slide-up">
              The Future of <span className="gradient-text animate-neon-pulse">Event Ticketing</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 opacity-0 animate-slide-up animate-delay-200">
              Secure, transparent, and fraud-proof NFT tickets on the blockchain. Own your tickets, trade freely, and
              never worry about counterfeits again.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 opacity-0 animate-slide-up animate-delay-400">
              <WalletConnectButton className="w-full sm:w-auto min-w-[200px] text-lg px-8 py-4 animate-pulse-glow h-12" />
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto min-w-[200px] text-lg px-8 py-4 glow-border hover:bg-primary/10 bg-transparent h-12"
                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              >
                Learn More <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto opacity-0 animate-slide-up animate-delay-600">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text animate-bounce-in">10K+</div>
                <div className="text-sm text-muted-foreground">Events Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text animate-bounce-in animate-delay-200">500K+</div>
                <div className="text-sm text-muted-foreground">Tickets Sold</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text animate-bounce-in animate-delay-400">Zero</div>
                <div className="text-sm text-muted-foreground">Counterfeits</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Featured Events</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredEvents.slice(0, 4).map((event, index) => (
              <Card
                key={event.id}
                className="group hover:scale-105 transition-all duration-300 cursor-pointer bg-slate-800/90 border-slate-700 hover:border-primary/50 backdrop-blur-sm"
              >
                <CardContent className="p-0">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-primary">{event.category}</Badge>
                    <Badge className="absolute top-4 right-4 bg-secondary text-secondary-foreground">
                      {event.ticketsLeft} left
                    </Badge>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors text-white">
                      {event.title}
                    </h3>

                    <div className="space-y-2 text-sm text-slate-300 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {event.attendees.toLocaleString()} attendees
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <span className="text-2xl font-bold gradient-text">{event.price}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4 bg-card/20">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform animate-pulse-glow shadow-lg shadow-purple-500/25">
                <Ticket className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">1. Buy NFT Tickets</h3>
              <p className="text-muted-foreground">
                Connect your wallet and purchase authentic NFT tickets directly from event organizers. Each ticket is
                unique and stored on the blockchain.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform animate-pulse-glow animate-delay-200 shadow-lg shadow-cyan-500/25">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">2. Store Securely</h3>
              <p className="text-muted-foreground">
                Your tickets are safely stored in your crypto wallet. No more lost tickets or worrying about screenshots
                - your ownership is cryptographically verified.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform animate-pulse-glow animate-delay-400 shadow-lg shadow-purple-500/25">
                <Globe className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Use & Trade</h3>
              <p className="text-muted-foreground">
                Present your QR code at the event for instant verification. Transfer or resell your tickets anytime with
                full transparency and zero fraud risk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Why Choose Tixora?</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 hover:scale-105 transition-transform bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-purple-500/30 glow-border backdrop-blur-sm">
              <Shield className="h-12 w-12 text-purple-400 mx-auto mb-4 animate-pulse-glow" />
              <h3 className="text-lg font-semibold mb-2 text-white">100% Secure</h3>
              <p className="text-sm text-purple-200">
                Blockchain-verified authenticity eliminates all counterfeiting risks
              </p>
            </Card>

            <Card className="text-center p-6 hover:scale-105 transition-transform bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 border-cyan-500/30 glow-border backdrop-blur-sm">
              <Zap className="h-12 w-12 text-cyan-400 mx-auto mb-4 animate-pulse-glow animate-delay-200" />
              <h3 className="text-lg font-semibold mb-2 text-white">Zero Fees</h3>
              <p className="text-sm text-cyan-200">No platform fees - organizers keep 100% of ticket sales revenue</p>
            </Card>

            <Card className="text-center p-6 hover:scale-105 transition-transform bg-gradient-to-br from-purple-900/40 to-cyan-900/20 border-purple-500/30 glow-border backdrop-blur-sm">
              <RefreshCw className="h-12 w-12 text-purple-400 mx-auto mb-4 animate-pulse-glow animate-delay-400" />
              <h3 className="text-lg font-semibold mb-2 text-white">Free Trading</h3>
              <p className="text-sm text-purple-200">Transfer and resell tickets freely with transparent pricing</p>
            </Card>

            <Card className="text-center p-6 hover:scale-105 transition-transform bg-gradient-to-br from-cyan-900/40 to-purple-900/20 border-cyan-500/30 glow-border backdrop-blur-sm">
              <Star className="h-12 w-12 text-cyan-400 mx-auto mb-4 animate-pulse-glow animate-delay-600" />
              <h3 className="text-lg font-semibold mb-2 text-white">Own Forever</h3>
              <p className="text-sm text-cyan-200">Keep your tickets as collectible NFTs with permanent ownership</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border bg-card/20">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Image src="/tixora-logo.png" alt="Tixora" width={32} height={32} />
            <span className="text-xl font-bold gradient-text">Tixora</span>
          </div>
          <p className="text-muted-foreground mb-4">
            The future of event ticketing is here. Secure, transparent, and decentralized.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            <Link href="/docs" className="hover:text-primary transition-colors">
              Documentation
            </Link>
            <Link href="/resources" className="hover:text-primary transition-colors">
              Resources
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Support
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
