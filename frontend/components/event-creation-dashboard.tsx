"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Coins, Upload, Eye, Zap, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EventFormData {
  // Basic Info
  title: string
  description: string
  category: string
  date: string
  time: string
  location: string
  venue: string

  // Ticket Configuration
  ticketSupply: string
  ticketPrice: string
  currency: string
  transferable: boolean

  // Media & Metadata
  eventImage: string
  ticketImage: string
  unlockableContent: string
}

const initialFormData: EventFormData = {
  title: "",
  description: "",
  category: "",
  date: "",
  time: "",
  location: "",
  venue: "",
  ticketSupply: "",
  ticketPrice: "",
  currency: "ETH",
  transferable: true,
  eventImage: "",
  ticketImage: "",
  unlockableContent: "",
}

const steps = [
  { id: 1, title: "Event Details", description: "Basic event information" },
  { id: 2, title: "Ticket Configuration", description: "Set pricing and supply" },
  { id: 3, title: "Media & Metadata", description: "Images and unlockables" },
  { id: 4, title: "Review & Deploy", description: "Final review and smart contract deployment" },
]

const categories = ["Music", "Conference", "Art", "Gaming", "Sports", "Workshop", "Networking", "Other"]

export function EventCreationDashboard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<EventFormData>(initialFormData)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentComplete, setDeploymentComplete] = useState(false)

  const updateFormData = (field: keyof EventFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleDeploy = async () => {
    setIsDeploying(true)
    // Simulate smart contract deployment
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsDeploying(false)
    setDeploymentComplete(true)
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.title && formData.description && formData.category && formData.date && formData.location
      case 2:
        return formData.ticketSupply && formData.ticketPrice
      case 3:
        return true // Optional step
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Create Event</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        currentStep >= step.id
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-medium">{step.id}</span>
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-sm font-medium text-foreground">{step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.id ? "bg-primary" : "bg-border"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Event Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Event Title *</Label>
                      <Input
                        id="title"
                        placeholder="Enter event title"
                        value={formData.title}
                        onChange={(e) => updateFormData("title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => updateFormData("category", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Event Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your event..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => updateFormData("description", e.target.value)}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="date">Event Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => updateFormData("date", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Event Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => updateFormData("time", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="location">City/Location *</Label>
                      <Input
                        id="location"
                        placeholder="e.g., San Francisco, CA"
                        value={formData.location}
                        onChange={(e) => updateFormData("location", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="venue">Venue</Label>
                      <Input
                        id="venue"
                        placeholder="e.g., Convention Center"
                        value={formData.venue}
                        onChange={(e) => updateFormData("venue", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Ticket Configuration */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="ticketSupply">Total Ticket Supply *</Label>
                      <Input
                        id="ticketSupply"
                        type="number"
                        placeholder="e.g., 1000"
                        value={formData.ticketSupply}
                        onChange={(e) => updateFormData("ticketSupply", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Maximum number of tickets that can be minted</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ticketPrice">Ticket Price *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="ticketPrice"
                          type="number"
                          step="0.001"
                          placeholder="0.05"
                          value={formData.ticketPrice}
                          onChange={(e) => updateFormData("ticketPrice", e.target.value)}
                        />
                        <Select value={formData.currency} onValueChange={(value) => updateFormData("currency", value)}>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ETH">ETH</SelectItem>
                            <SelectItem value="USDC">USDC</SelectItem>
                            <SelectItem value="USDT">USDT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Revenue Calculation</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ticket Price:</span>
                        <span className="text-foreground">
                          {formData.ticketPrice || "0"} {formData.currency}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Supply:</span>
                        <span className="text-foreground">{formData.ticketSupply || "0"} tickets</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium">
                        <span className="text-foreground">Maximum Revenue:</span>
                        <span className="text-primary">
                          {(
                            (Number.parseFloat(formData.ticketPrice) || 0) *
                            (Number.parseInt(formData.ticketSupply) || 0)
                          ).toFixed(3)}{" "}
                          {formData.currency}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        ✨ Zero platform fees - you keep 100% of ticket sales!
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Ticket Settings</h4>
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Allow Ticket Transfers</p>
                        <p className="text-sm text-muted-foreground">
                          Enable attendees to transfer or resell their tickets
                        </p>
                      </div>
                      <Button
                        variant={formData.transferable ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateFormData("transferable", !formData.transferable)}
                      >
                        {formData.transferable ? "Enabled" : "Disabled"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Media & Metadata */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">Event Image</h4>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">Upload event banner image</p>
                        <Button variant="outline" size="sm">
                          Choose File
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">NFT Ticket Design</h4>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">Upload ticket NFT artwork</p>
                        <Button variant="outline" size="sm">
                          Choose File
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unlockableContent">Unlockable Content (Optional)</Label>
                    <Textarea
                      id="unlockableContent"
                      placeholder="Special content, links, or perks for ticket holders..."
                      rows={3}
                      value={formData.unlockableContent}
                      onChange={(e) => updateFormData("unlockableContent", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      This content will only be visible to ticket holders after purchase
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Review & Deploy */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  {!deploymentComplete ? (
                    <>
                      <div className="space-y-4">
                        <h4 className="font-medium text-foreground">Event Summary</h4>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-muted-foreground">Event Title</p>
                              <p className="font-medium text-foreground">{formData.title}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Category</p>
                              <Badge variant="secondary">{formData.category}</Badge>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Date & Time</p>
                              <p className="font-medium text-foreground">
                                {new Date(formData.date).toLocaleDateString()} {formData.time && `at ${formData.time}`}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Location</p>
                              <p className="font-medium text-foreground">
                                {formData.location} {formData.venue && `- ${formData.venue}`}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-muted-foreground">Ticket Supply</p>
                              <p className="font-medium text-foreground">{formData.ticketSupply} tickets</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Ticket Price</p>
                              <p className="font-medium text-primary">
                                {formData.ticketPrice} {formData.currency}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Transferable</p>
                              <p className="font-medium text-foreground">{formData.transferable ? "Yes" : "No"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Max Revenue</p>
                              <p className="font-medium text-primary">
                                {(
                                  (Number.parseFloat(formData.ticketPrice) || 0) *
                                  (Number.parseInt(formData.ticketSupply) || 0)
                                ).toFixed(3)}{" "}
                                {formData.currency}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-medium text-foreground mb-2">Smart Contract Deployment</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          This will deploy a new smart contract for your event on Ethereum. Gas fees will be required
                          for deployment.
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                          <Coins className="w-4 h-4 text-primary" />
                          <span className="text-foreground">Estimated gas fee: ~0.02 ETH</span>
                        </div>
                      </div>

                      <Button onClick={handleDeploy} disabled={isDeploying} className="w-full" size="lg">
                        {isDeploying ? (
                          <>
                            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                            Deploying Smart Contract...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 mr-2" />
                            Deploy Event Contract
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">Event Created Successfully!</h3>
                      <p className="text-muted-foreground mb-6">
                        Your smart contract has been deployed and your event is now live.
                      </p>
                      <div className="space-y-2 mb-6">
                        <p className="text-sm text-muted-foreground">Contract Address:</p>
                        <code className="bg-muted px-3 py-1 rounded text-sm">
                          0x1234567890abcdef1234567890abcdef12345678
                        </code>
                      </div>
                      <div className="flex gap-4 justify-center">
                        <Button variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Event
                        </Button>
                        <Button>Share Event</Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          {!deploymentComplete && (
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button onClick={nextStep} disabled={currentStep === steps.length || !isStepValid(currentStep)}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
