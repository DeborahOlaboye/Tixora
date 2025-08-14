"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Shield, Zap, Users, Ticket, Globe } from "lucide-react"

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 bg-black/30 backdrop-blur-sm relative z-10">
      <div className="container mx-auto">
        <div className="text-center mb-16 scroll-animate opacity-0 translate-y-6 transition-all duration-800">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-300 to-fuchsia-600 bg-clip-text text-transparent mb-4">
            Why Choose Tixora?
          </h2>
          <p className="text-cyan-300 text-lg max-w-2xl mx-auto">
            Experience the future of event ticketing with blockchain-powered transparency and security
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-fuchsia-700/30 border-b-blue-400 backdrop-blur-sm hover:bg-coral-500/10 hover:scale-105 hover:border-coral-400/60 hover:shadow-xl hover:shadow-coral-500/20 transition-all duration-300 cursor-pointer scroll-animate opacity-0 translate-y-8 delay-100">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-300 to-fuchsia-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-coral-500/30">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-blue-500">Zero Platform Fees</CardTitle>
              <CardDescription className="text-blue-400">
                Event organizers keep 100% of their revenue with no hidden costs or platform commissions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-fuchsia-700/30 border-b-blue-400 backdrop-blur-sm hover:bg-coral-500/10 hover:scale-105 hover:border-coral-400/60 hover:shadow-xl hover:shadow-coral-500/20 transition-all duration-300 cursor-pointer scroll-animate opacity-0 translate-y-8 delay-100">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-300 to-fuchsia-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/30">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-blue-500">NFT Ticket Technology</CardTitle>
              <CardDescription className="text-blue-200">
                Verifiable, transferable, and collectible tickets that cannot be counterfeited or lost
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-fuchsia-700/30 border-b-blue-400 backdrop-blur-sm hover:bg-coral-500/10 hover:scale-105 hover:border-coral-400/60 hover:shadow-xl hover:shadow-coral-500/20 transition-all duration-300 cursor-pointer scroll-animate opacity-0 translate-y-8 delay-100">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-300 to-fuchsia-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/30">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-blue-500">Smart Contract Automation</CardTitle>
              <CardDescription className="text-blue-200">
                Trustless transactions and automated processes eliminate traditional intermediaries
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-fuchsia-700/30 border-b-blue-400 backdrop-blur-sm hover:bg-coral-500/10 hover:scale-105 hover:border-coral-400/60 hover:shadow-xl hover:shadow-coral-500/20 transition-all duration-300 cursor-pointer scroll-animate opacity-0 translate-y-8 delay-100">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-300 to-fuchsia-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/30">
                <Users className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-blue-500">Complete Organizer Control</CardTitle>
              <CardDescription className="text-blue-200">
                Full autonomy over event creation, pricing, and distribution without platform restrictions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-fuchsia-700/30 border-b-blue-400 backdrop-blur-sm hover:bg-coral-500/10 hover:scale-105 hover:border-coral-400/60 hover:shadow-xl hover:shadow-coral-500/20 transition-all duration-300 cursor-pointer scroll-animate opacity-0 translate-y-8 delay-100">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-300 to-fuchsia-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/30">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-blue-500">Digital Identity & Proof</CardTitle>
              <CardDescription className="text-blue-200">
                Permanent proof of attendance that becomes part of your verifiable digital identity
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-fuchsia-700/30 border-b-blue-400 backdrop-blur-sm hover:bg-coral-500/10 hover:scale-105 hover:border-coral-400/60 hover:shadow-xl hover:shadow-coral-500/20 transition-all duration-300 cursor-pointer scroll-animate opacity-0 translate-y-8 delay-100">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-300 to-fuchsia-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/30">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-blue-500">Future Utility & Value</CardTitle>
              <CardDescription className="text-blue-200">
                Ticket NFTs unlock future benefits and create lasting value within the ecosystem
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  )
}
