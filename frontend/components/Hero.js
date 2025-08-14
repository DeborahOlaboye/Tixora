"use client"

import { Badge } from "@/components/ui/badge"
import CreateEvent from "./CreateEvent"
import BrowseEvents from "./BrowseEvents"

export default function Hero() {
  return (
    <section className="py-20 px-4 relative z-10 scroll-animate opacity-0 translate-y-8 transition-all duration-1000 delay-200">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Revolutionary Decentralized
          <br />
          <span className="text-neon-purple">Event Ticketing</span>
        </h1>
        <p className="text-xl text-white mb-8 max-w-3xl mx-auto leading-relaxed">
          Transform how events are created and tickets are purchased through blockchain technology. Zero platform fees,
          verifiable NFT tickets, and complete organizer autonomy.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <CreateEvent />
          <BrowseEvents />
        </div>
      </div>
    </section>
  )
}
