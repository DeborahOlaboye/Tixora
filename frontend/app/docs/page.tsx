import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Book, Code } from "lucide-react"
import Link from "next/link"

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 gradient-text">Documentation</h1>
          <p className="text-xl text-muted-foreground">
            Everything you need to integrate with Tixora's NFT ticketing platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="glow-border bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5 text-primary" />
                Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Learn the basics of creating events and managing NFT tickets on Tixora.
              </p>
              <div className="space-y-2">
                <Link href="#" className="block text-primary hover:underline">
                  Quick Start Guide
                </Link>
                <Link href="#" className="block text-primary hover:underline">
                  Platform Overview
                </Link>
                <Link href="#" className="block text-primary hover:underline">
                  Wallet Setup
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="glow-border bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-secondary" />
                API Reference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Complete API documentation for developers building on Tixora.
              </p>
              <div className="space-y-2">
                <Link href="#" className="block text-primary hover:underline">
                  REST API
                </Link>
                <Link href="#" className="block text-primary hover:underline">
                  Smart Contracts
                </Link>
                <Link href="#" className="block text-primary hover:underline">
                  SDK Documentation
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4 gradient-text">Integration Guides</h2>
            <div className="grid gap-4">
              <Card className="bg-card/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-2">Event Creation API</h3>
                      <p className="text-sm text-muted-foreground">
                        Programmatically create events and deploy NFT ticket contracts
                      </p>
                    </div>
                    <Badge variant="secondary">REST</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-2">Ticket Verification</h3>
                      <p className="text-sm text-muted-foreground">
                        Verify ticket authenticity and check-in attendees at events
                      </p>
                    </div>
                    <Badge variant="secondary">WebSocket</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-2">Marketplace Integration</h3>
                      <p className="text-sm text-muted-foreground">
                        Enable ticket resale and transfer functionality in your app
                      </p>
                    </div>
                    <Badge variant="secondary">GraphQL</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
