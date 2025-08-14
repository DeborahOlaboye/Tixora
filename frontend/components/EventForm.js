"use client"

import React, { useState } from 'react'
import { Calendar, Clock, MapPin, Users, DollarSign, ImageIcon, Tag } from 'lucide-react'

export default function EventForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: '',
    price: '',
    category: '',
    image: null,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({
      ...prev,
      image: file,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Event created:', formData)
    // Here you would typically send the data to your backend
  }

  return (
    <div className="bg-gradient-to-br from-coral-500/10 to-amber-500/10 backdrop-blur-sm border border-coral-500/20 rounded-2xl p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Event Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Event Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-black/30 border border-coral-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral-400 focus:border-transparent"
            placeholder="Enter your event title"
            required
          />
        </div>

        {/* Event Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 bg-black/30 border border-coral-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral-400 focus:border-transparent"
            placeholder="Describe your event..."
            required
          />
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Calendar className="inline w-4 h-4 mr-2" />
              Event Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-black/30 border border-coral-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-coral-400 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Clock className="inline w-4 h-4 mr-2" />
              Event Time *
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-black/30 border border-coral-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-coral-400 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <MapPin className="inline w-4 h-4 mr-2" />
            Location *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-black/30 border border-coral-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral-400 focus:border-transparent"
            placeholder="Event venue or online link"
            required
          />
        </div>

        {/* Capacity and Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Users className="inline w-4 h-4 mr-2" />
              Capacity *
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-black/30 border border-coral-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral-400 focus:border-transparent"
              placeholder="Maximum attendees"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <DollarSign className="inline w-4 h-4 mr-2" />
              Ticket Price (ETH) *
            </label>
            <input
              type="number"
              step="0.001"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-black/30 border border-coral-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral-400 focus:border-transparent"
              placeholder="0.05"
              required
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Tag className="inline w-4 h-4 mr-2" />
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-black/30 border border-coral-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-coral-400 focus:border-transparent"
            required
          >
            <option value="">Select a category</option>
            <option value="music">Music</option>
            <option value="sports">Sports</option>
            <option value="technology">Technology</option>
            <option value="business">Business</option>
            <option value="art">Art & Culture</option>
            <option value="food">Food & Drink</option>
            <option value="education">Education</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Event Image */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <ImageIcon className="inline w-4 h-4 mr-2" />
            Event Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-3 bg-black/30 border border-coral-500/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-coral-500 file:text-white hover:file:bg-coral-600"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            className="px-8 py-4 bg-gradient-to-r from-coral-500 to-amber-500 text-white font-semibold rounded-lg hover:from-coral-600 hover:to-amber-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-coral-500/25"
          >
            Create Event & Mint NFT Tickets
          </button>
        </div>
      </form>
    </div>
  )
}