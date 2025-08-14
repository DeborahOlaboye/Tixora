"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function BrowseEvents() {
  return (
    <Link href="/browse-events">
      <Button
        size="lg"
        variant="outline"
        className="border-blue-200 text-blue-400 hover:bg-blue-400 hover:border-blue-200 px-8 py-3 bg-transparent font-semibold"
      >
        Browse Events
      </Button>
    </Link>
  )
}
