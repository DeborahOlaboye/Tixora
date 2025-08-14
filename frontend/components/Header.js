"use client"
import { Button } from "@/components/ui/button"
import { Ticket, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      <header className="border-b border-white/10 backdrop-blur-sm relative z-50 scroll-animate opacity-0 translate-y-4 transition-all duration-700">
        <div className="container mx-auto px-4 flex items-center justify-between">
          
            <div className="flex items-center space-x-2">
              <a href="/">
                <img src="/logo.png" alt="Tixora Logo" className="h-20 w-auto object-contain"/>
              </a>
            </div>
          
          
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-white/80 hover:text-[#A855F7] transition-colors font-medium">
              Features
            </a>
            <a href="#how-it-works" className="text-white/80 hover:text-[#A855F7] transition-colors font-medium">
              How It Works
            </a>
            <a href="#mission" className="text-white/80 hover:text-[#A855F7] transition-colors font-medium">
              Mission
            </a>
            <Button
            variant="outline"
            className="border-[#A855F7] text-[#A855F7] hover:bg-[#A855F7] hover:text-white bg-transparent font-semibold transition-all duration-300"
          >
            Connect Wallet
          </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="block md:hidden p-2 text-white/80 hover:text-[#A78BFA] transition-colors z-50 relative"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] block md:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-black/95 backdrop-blur-xl border-l border-white/10 z-[100] transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      } block md:hidden`}>
        <div className="p-6">
          {/* Close button */}
          <div className="flex justify-end mb-8">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-white/80 hover:text-[#A78BFA] transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Logo in sidebar */}
          <div className="flex items-center space-x-2 mb-8 px-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] rounded-lg flex items-center justify-center shadow-lg shadow-[#8B5CF6]/30">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#A78BFA] to-[#22D3EE] bg-clip-text text-transparent">
              Tixora
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-6">
            <a 
              href="#features" 
              className="text-white/80 hover:text-[#A78BFA] transition-colors font-medium text-lg py-3 px-2 rounded-lg hover:bg-[#8B5CF6]/10 border-b border-white/10"
              onClick={toggleMobileMenu}
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="text-white/80 hover:text-[#A78BFA] transition-colors font-medium text-lg py-3 px-2 rounded-lg hover:bg-[#8B5CF6]/10 border-b border-white/10"
              onClick={toggleMobileMenu}
            >
              How It Works
            </a>
            <a 
              href="#mission" 
              className="text-white/80 hover:text-[#A78BFA] transition-colors font-medium text-lg py-3 px-2 rounded-lg hover:bg-[#8B5CF6]/10 border-b border-white/10"
              onClick={toggleMobileMenu}
            >
              Mission
            </a>
            
            {/* Connect Wallet Button */}
            <div className="pt-6">
              <Button
                variant="outline"
                className="w-full border-[#8B5CF6] text-[#A78BFA] hover:bg-[#8B5CF6] hover:text-white bg-transparent font-semibold transition-all duration-300 py-3 text-lg"
                onClick={toggleMobileMenu}
              >
                Connect Wallet
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}