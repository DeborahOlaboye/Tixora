"use client"

import type React from "react"

import { useState } from "react"
import { useAccount } from 'wagmi'
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"
import { Upload } from "lucide-react"
import { WalletConnectButton } from "@/components/wallet-connect-button"

export default function CreateEvent() {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    price: "",
    totalSupply: "",
    bannerImage: null as File | null,
  })

  // Redirect to landing page if wallet is not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center p-8 bg-slate-800/50 rounded-lg border border-purple-500/30 backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-white mb-4">Wallet Connection Required</h1>
          <p className="text-slate-300 mb-6">Please connect your wallet to create events.</p>
          <WalletConnectButton className="mx-auto" />
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate smart contract deployment
    await new Promise((resolve) => setTimeout(resolve, 3000))

    toast.success("🎉 Event created successfully!")
    router.push("/marketplace")
  }

  const totalRevenue =
    formData.price && formData.totalSupply
      ? (Number.parseFloat(formData.price) * Number.parseInt(formData.totalSupply)).toFixed(2)
      : "0"

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/tixora-logo.png" alt="Tixora" width={40} height={40} />
            <span className="text-2xl font-bold gradient-text">Tixora</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/marketplace" className="text-muted-foreground hover:text-primary transition-colors">
              Marketplace
            </Link>
            <Link href="/tickets" className="text-muted-foreground hover:text-primary transition-colors">
              Tickets
            </Link>
            <Link href="/create-event" className="text-primary">
              Create Event
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <WalletConnectButton />
          </div>
        </div>
      </header>

      <div className="pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text">Create Event</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Event Details */}
              <Card className="bg-gradient-to-br from-slate-900/90 to-purple-900/20 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white gradient-text">Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-purple-200">
                      Event Title
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Amazing Web3 Conference"
                      required
                      className="bg-slate-800/80 border-purple-500/30 text-white focus:border-purple-400 focus:ring-purple-400/20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-purple-200">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe your event..."
                      rows={4}
                      required
                      className="bg-slate-800/80 border-purple-500/30 text-white focus:border-purple-400 focus:ring-purple-400/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date" className="text-purple-200">
                        Date
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                        className="bg-slate-800/80 border-purple-500/30 text-white focus:border-purple-400 focus:ring-purple-400/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="time" className="text-purple-200">
                        Time
                      </Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        required
                        className="bg-slate-800/80 border-purple-500/30 text-white focus:border-purple-400 focus:ring-purple-400/20"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-purple-200">
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Miami Beach, FL"
                      required
                      className="bg-slate-800/80 border-purple-500/30 text-white focus:border-purple-400 focus:ring-purple-400/20"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Ticket Configuration */}
              <Card className="bg-gradient-to-br from-slate-900/90 to-cyan-900/20 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-white gradient-text">Ticket Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="price" className="text-cyan-200">
                      Price per Ticket (CELO)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="25.00"
                      required
                      className="bg-slate-800/80 border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-cyan-400/20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="totalSupply" className="text-cyan-200">
                      Total Tickets to Mint
                    </Label>
                    <Input
                      id="totalSupply"
                      type="number"
                      value={formData.totalSupply}
                      onChange={(e) => setFormData({ ...formData, totalSupply: e.target.value })}
                      placeholder="1000"
                      required
                      className="bg-slate-800/80 border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-cyan-400/20"
                    />
                  </div>

                  <div className="p-4 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 rounded-lg border border-purple-500/20">
                    <h4 className="font-medium text-white mb-2 gradient-text">Revenue Calculation</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between text-purple-200">
                        <span>Price per ticket:</span>
                        <span>{formData.price || "0"} CELO</span>
                      </div>
                      <div className="flex justify-between text-cyan-200">
                        <span>Total tickets:</span>
                        <span>{formData.totalSupply || "0"}</span>
                      </div>
                      <div className="flex justify-between font-medium text-white border-t border-purple-500/30 pt-2">
                        <span>Total Revenue:</span>
                        <span className="gradient-text text-lg">{totalRevenue} CELO</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="banner" className="text-cyan-200">
                      Banner Image
                    </Label>
                    <div className="mt-2 border-2 border-dashed border-cyan-500/50 rounded-lg p-6 text-center bg-gradient-to-br from-cyan-900/10 to-purple-900/10">
                      <Upload className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                      <p className="text-sm text-cyan-200">Click to upload or drag and drop</p>
                      <Input
                        id="banner"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setFormData({ ...formData, bannerImage: e.target.files?.[0] || null })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border-purple-500/30">
              <CardContent className="p-6">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full text-lg py-6 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating Event & Minting NFTs...
                    </>
                  ) : (
                    "Create Event"
                  )}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}
