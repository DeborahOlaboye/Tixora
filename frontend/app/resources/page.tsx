import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Download, Video, FileText } from "lucide-react"
import Link from "next/link"

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 gradient-text">Resources</h1>
          <p className="text-xl text-muted-foreground">
            Educational materials, tutorials, and support to help you succeed with Web3 ticketing
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="glow-border bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Video Tutorials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Step-by-step video guides for using Tixora</p>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Watch Now <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="glow-border bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-secondary" />
                Guides & Articles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">In-depth articles about Web3 and NFT ticketing</p>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Read More <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="glow-border bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                Downloads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Brand assets, SDKs, and development tools</p>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Download <Download className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-6 gradient-text">Web3 Wallet Tutorials</h2>
            <div className="grid gap-4">
              <Card className="bg-card/30">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Setting Up MetaMask</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete guide to installing and configuring MetaMask for Ethereum
                  </p>
                  <Link href="#" className="text-primary hover:underline text-sm">
                    View Tutorial →
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-card/30">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Understanding Gas Fees</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Learn about transaction costs and how to optimize gas usage
                  </p>
                  <Link href="#" className="text-primary hover:underline text-sm">
                    View Tutorial →
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-card/30">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">NFT Basics</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Introduction to Non-Fungible Tokens and how they work as tickets
                  </p>
                  <Link href="#" className="text-primary hover:underline text-sm">
                    View Tutorial →
                  </Link>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 gradient-text">Support</h2>
            <Card className="glow-border bg-card/50">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-4">Need Help?</h3>
                <p className="text-muted-foreground mb-6">
                  Our support team is here to help you with any questions about Tixora
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="animate-pulse-glow">Contact Support</Button>
                  <Button variant="outline">Join Discord</Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}
