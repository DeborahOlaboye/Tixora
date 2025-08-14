import type React from "react"
import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

export const metadata: Metadata = {
  title: "Tixora",
  icons: "favicon.ico",
  description:
    "Transform how events are created and tickets are purchased through blockchain technology. Zero platform fees, verifiable NFT tickets, and complete organizer autonomy.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
      <body className="font-sans bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  )
}

