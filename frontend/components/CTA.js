"use client"

import { Button } from "@/components/ui/button"

export default function CTA() {
  return (
    <section className="py-20 px-4 relative z-10">
      <div className="container mx-auto text-center scroll-animate opacity-0 translate-y-6 transition-all duration-800">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-300 to-fuchsia-600 bg-clip-text text-transparent mb-4">
          Ready to Transform Your Events?
        </h2>
        <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
          Join the revolution and experience the future of event ticketing today
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-fuchsia-700 to-sky-300 hover:from-cyan-400 hover:to-fuchsia-700 text-white px-8 py-3 font-semibold"
          >
            Get Started Now
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-blue-200 text-blue-400 hover:bg-blue-400 hover:border-blue-200 px-8 py-3 bg-transparent font-semibold"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  )
}
