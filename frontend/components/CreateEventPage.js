import React from 'react'
import EventForm from './EventForm'

export default function CreateEventPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-coral-400 via-amber-400 to-lime-400 bg-clip-text text-transparent mb-4">
          Create Your Event
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Launch your event on the blockchain and create secure, transferable NFT tickets
        </p>
      </div>
      <EventForm />
    </main>
  )
}