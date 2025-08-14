"use client"

import { Ticket } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-amber-400/20 py-4 px-4 relative z-10 scroll-animate opacity-0 translate-y-4 transition-all duration-600">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2">
              <a href="/">
                <img src="/logo.png" alt="Tixora Logo" className="h-20 w-auto object-contain"/>
              </a>
            </div>
          <div className="flex space-x-6">
            <a href="#" className="text-blue-300 hover:text-fuchsia-300 transition-colors font-medium">
              Privacy
            </a>
            <a href="#" className="text-blue-300 hover:text-fuchsia-300 transition-colors font-medium">
              Terms
            </a>
            <a href="#" className="text-blue-300 hover:text-fuchsia-300 transition-colors font-medium">
              Support
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-amber-400/20 text-center text-fuchsia-300">
          <p>&copy; 2025 Tixora.</p>
        </div>
      </div>
    </footer>
  )
}
