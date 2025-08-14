"use client"

export default function Mission() {
  return (
    <section id="mission" className="py-20 px-4 bg-black/30 backdrop-blur-sm relative z-10">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center scroll-animate opacity-0 translate-y-6 transition-all duration-1000">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-300 to-fuchsia-600 bg-clip-text text-transparent mb-4">
            Our Mission
          </h2>
          <p className="text-lg text-blue-100 leading-relaxed mb-8">
            Our mission is to democratize event access and create a trustless, transparent ecosystem where event
            experiences are fairly distributed, authentically verified, and permanently preserved through blockchain
            technology.
          </p>
          <p className="text-lg text-blue-100 leading-relaxed">
            We empower event creators to retain full control and maximum revenue from their work while providing
            attendees with true ownership of their digital experiences, building a future where attending events becomes
            a permanent, verifiable part of one's digital identity that fosters community formation around shared
            experiences and transforms how memories are preserved and valued in the digital age.
          </p>
        </div>
      </div>
    </section>
  )
}
