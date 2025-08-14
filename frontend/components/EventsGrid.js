"use client"

import React from 'react'
import { Calendar, Clock, MapPin, Users, DollarSign } from 'lucide-react'

export default function EventsGrid({ filteredEvents }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":")
    const date = new Date()
    date.setHours(Number.parseInt(hours), Number.parseInt(minutes))
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(filteredEvents || []).map((event) => (
          <div
            key={event.id}
            className="bg-gradient-to-br from-coral-500/10 to-amber-500/10 backdrop-blur-sm border border-coral-500/20 rounded-2xl overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-coral-500/20 transition-all duration-300"
          >
            <div className="relative">
              <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-48 object-cover" />
              <div className="absolute top-4 right-4 bg-gradient-to-r from-coral-500 to-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {event.ticketsLeft} left
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">{event.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-300 text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-coral-400" />
                  {formatDate(event.date)}
                </div>
                <div className="flex items-center text-gray-300 text-sm">
                  <Clock className="w-4 h-4 mr-2 text-coral-400" />
                  {formatTime(event.time)}
                </div>
                <div className="flex items-center text-gray-300 text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-coral-400" />
                  {event.location}
                </div>
                <div className="flex items-center text-gray-300 text-sm">
                  <Users className="w-4 h-4 mr-2 text-coral-400" />
                  {event.capacity} capacity
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-coral-400 mr-1" />
                  <span className="text-2xl font-bold text-white">{event.price}</span>
                  <span className="text-gray-300 ml-1">ETH</span>
                </div>
                <button className="px-6 py-2 bg-gradient-to-r from-coral-500 to-amber-500 text-white font-semibold rounded-lg hover:from-coral-600 hover:to-amber-600 transform hover:scale-105 transition-all duration-300">
                  Buy NFT Ticket
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(filteredEvents || []).length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎫</div>
          <h3 className="text-2xl font-bold text-white mb-2">No events found</h3>
          <p className="text-gray-300">Try adjusting your search criteria or filters</p>
        </div>
      )}
    </>
  )
}