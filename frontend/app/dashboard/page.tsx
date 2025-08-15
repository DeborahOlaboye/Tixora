"use client"

import { useWallet } from "@/lib/wallet-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, ShoppingBag, TicketIcon, Activity } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Dashboard() {
  const { isConnected, address } = useWallet()
  const router = useRouter()

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""

  const quickActions = [
    {
      title: "Marketplace",
      description: "Browse and purchase event tickets",
      icon: ShoppingBag,
      href: "/marketplace",
      gradient: "from-purple-500 to-blue-500",
    },
    {
      title: "My Tickets",
      description: "View and manage your NFT tickets",
      icon: TicketIcon,
      href: "/tickets",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Create Event",
      description: "Launch your own ticketed event",
      icon: Plus,
      href: "/create-event",
      gradient: "from-purple-600 to-pink-500",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      action: "Purchased ticket for Web3 Music Festival",
      time: "2 hours ago",
      amount: "25 CELO",
      type: "purchase",
    },
    {
      id: 2,
      action: "Created DeFi Conference Summit",
      time: "1 day ago",
      amount: "Revenue: 375 CELO",
      type: "create",
    },
    {
      id: 3,
      action: "Transferred ticket to 0x1234...5678",
      time: "3 days ago",
      amount: "20 CELO",
      type: "transfer",
    },
    {
      id: 4,
      action: "Claimed POAP for NFT Art Gallery",
      time: "5 days ago",
      amount: "Free",
      type: "claim",
    },
    {
      id: 5,
      action: "Purchased VIP ticket for Crypto Gaming Tournament",
      time: "1 week ago",
      amount: "50 CELO",
      type: "purchase",
    },
  ]

  const stats = [
    { label: "Total Events Attended", value: "12", change: "+3 this month" },
    { label: "Total Spent", value: "245 CELO", change: "+25 CELO this month" },
    { label: "Events Created", value: "3", change: "+1 this month" },
    { label: "Revenue Earned", value: "890 CELO", change: "+125 CELO this month" },
  ]

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
            <Link href="/dashboard" className="text-purple-400 font-medium">
              Dashboard
            </Link>
            <Link href="/marketplace" className="text-slate-300 hover:text-purple-400 transition-colors font-medium">
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
        <div className="container mx-auto max-w-7xl">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-6xl font-bold mb-4">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                {shortAddress}
              </span>
            </h1>
            <p className="text-slate-300 text-xl">Manage your events and tickets on the decentralized web</p>
          </div>

          {/* Stats Overview */}
          <div className="mb-12">
            <h2 className="text-3xl font-semibold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Your Stats
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-gradient-to-br from-slate-800/80 to-purple-900/30 border-purple-500/30">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                        {stat.value}
                      </p>
                      <p className="text-slate-300 font-medium mb-1">{stat.label}</p>
                      <p className="text-green-400 text-sm font-medium">{stat.change}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="mb-12">
            <h2 className="text-3xl font-semibold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Quick Actions
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Link key={index} href={action.href}>
                    <Card className="group cursor-pointer bg-gradient-to-br from-slate-800/80 to-purple-900/30 border-purple-500/30 overflow-hidden relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-5`} />
                      <CardContent className="p-8 text-center relative z-10">
                        <div
                          className={`w-20 h-20 rounded-full bg-gradient-to-br ${action.gradient} flex items-center justify-center mx-auto mb-6`}
                        >
                          <Icon className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-white">{action.title}</h3>
                        <p className="text-slate-300 text-base">{action.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Recent Activity Section */}
          <div>
            <Card className="bg-gradient-to-br from-slate-800/80 to-purple-900/30 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white text-2xl">
                  <Activity className="h-6 w-6 text-purple-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-6 bg-slate-700/30 rounded-xl border border-slate-600/30"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            activity.type === "purchase"
                              ? "bg-green-400"
                              : activity.type === "create"
                                ? "bg-blue-400"
                                : activity.type === "transfer"
                                  ? "bg-yellow-400"
                                  : "bg-purple-400"
                          }`}
                        />
                        <div>
                          <p className="text-white font-medium text-lg">{activity.action}</p>
                          <p className="text-slate-400">{activity.time}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-purple-500/50 text-purple-300 bg-purple-500/10 px-4 py-2"
                      >
                        {activity.amount}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
