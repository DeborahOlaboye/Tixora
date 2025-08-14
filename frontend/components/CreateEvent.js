"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CreateEvent() {
  return (
    <Link href="/create-event">
      <Button
        size="lg"
        className="bg-gradient-to-r from-fuchsia-700 to-sky-300 hover:from-cyan-400 hover:to-fuchsia-700 text-white px-8 py-3 font-semibold"
      >
        Create Event
      </Button>
    </Link>
  )
}
