"use client"

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 relative z-10">
      <div className="container mx-auto">
        <div className="text-center mb-16 scroll-animate opacity-0 translate-y-6 transition-all duration-800">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-300 to-fuchsia-600 bg-clip-text text-transparent mb-4">
            How Tixora Works
          </h2>
          <p className="text-cyan-300 text-lg max-w-2xl mx-auto">Simple steps to revolutionize your event experience</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center hover:scale-105 transition-all duration-300 cursor-pointer group scroll-animate opacity-0 translate-y-8 delay-100">
            <div className="w-16 h-16 bg-gradient-to-r from-fuchsia-500 to-violet-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-2xl group-hover:shadow-coral-500/40 shadow-lg shadow-coral-500/20">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-xl font-semibold text-fuchsia-700 mb-4 group-hover:text-cyan-500 transition-colors">
              Create Your Event
            </h3>
            <p className="text-blue-200 group-hover:text-white transition-colors">
              Event organizers deploy smart contracts on Ethereum to create their events with complete control over
              pricing and distribution
            </p>
          </div>

          <div className="text-center hover:scale-105 transition-all duration-300 cursor-pointer group scroll-animate opacity-0 translate-y-8 delay-200">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-2xl group-hover:shadow-cyan-500/40 shadow-lg shadow-cyan-500/20">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-semibold text-cyan-500 mb-4 group-hover:text-fuchsia-700 transition-colors">
              Purchase NFT Tickets
            </h3>
            <p className="text-white group-hover:text-blue-200 transition-colors">
              Attendees buy tickets directly through smart contracts, receiving unique NFTs that serve as verifiable
              proof of purchase
            </p>
          </div>

          <div className="text-center hover:scale-105 transition-all duration-300 cursor-pointer group scroll-animate opacity-0 translate-y-8 delay-300">
            <div className="w-16 h-16 bg-gradient-to-r from-fuchsia-500 to-violet-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-2xl group-hover:shadow-coral-500/40 shadow-lg shadow-coral-500/20">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-semibold text-fuchsia-700 mb-4 group-hover:text-cyan-500 transition-colors">
              Verify & Attend
            </h3>
            <p className="text-blue-200 group-hover:text-white transition-colors">
              Present your NFT ticket for instant verification and enjoy your event, knowing your attendance is
              permanently recorded
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
