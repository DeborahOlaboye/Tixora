"use client"

import { useEffect, useRef } from "react"
import Header from "@/components/Header"
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import HowItWorks from "@/components/HowItWorks"
import Mission from "@/components/Mission"
import CTA from "@/components/CTA"
import Footer from "@/components/Footer"
import BackgroundElements from "@/components/BackgroundElements"

export default function Home() {
  const observerRef = useRef(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in")
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    const elements = document.querySelectorAll(".scroll-animate")
    elements.forEach((el) => observerRef.current?.observe(el))

    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
      <BackgroundElements />
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Mission />
      <CTA />
      <Footer />
    </div>
  )
}
