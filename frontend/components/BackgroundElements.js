export default function BackgroundElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Purple Glow Top Left */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#A855F7]/20 rounded-full blur-3xl animate-pulse" />
      {/* Blue Glow Bottom Right */}
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#06B6D4]/20 rounded-full blur-3xl animate-pulse delay-1000" />
      {/* Mid Glow - Brand Blend */}
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-[#A855F7]/20 to-[#06B6D4]/20 rounded-full blur-3xl animate-pulse delay-500" />
    </div>
  )
}
