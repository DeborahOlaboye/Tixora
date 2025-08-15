import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { WalletProvider } from "@/lib/wallet-context"

export const metadata: Metadata = {
  title: "Tixora - Decentralized Event Ticketing",
  description: "NFT-based event ticketing platform built on Ethereum",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  )
}
