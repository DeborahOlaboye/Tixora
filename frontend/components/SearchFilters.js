import React from 'react'
import { Search } from 'lucide-react'

export default function SearchFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  filteredEvents,
}) {
  return (
    <div className="bg-gradient-to-br from-coral-500/10 to-amber-500/10 backdrop-blur-sm border border-coral-500/20 rounded-2xl p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-black/30 border border-coral-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral-400 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 bg-black/30 border border-coral-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-coral-400 focus:border-transparent"
        >
          <option value="all">All Categories</option>
          <option value="music">Music</option>
          <option value="sports">Sports</option>
          <option value="technology">Technology</option>
          <option value="business">Business</option>
          <option value="art">Art & Culture</option>
          <option value="food">Food & Drink</option>
        </select>

        {/* Price Filter */}
        <select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="px-4 py-3 bg-black/30 border border-coral-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-coral-400 focus:border-transparent"
        >
          <option value="all">All Prices</option>
          <option value="free">Free</option>
          <option value="low">0 - 0.05 ETH</option>
          <option value="medium">0.05 - 0.2 ETH</option>
          <option value="high">0.2+ ETH</option>
        </select>

        {/* Results Count */}
        <div className="flex items-center justify-center md:justify-start">
          <span className="text-gray-300">
            {(filteredEvents || []).length} event{(filteredEvents || []).length !== 1 ? "s" : ""} found
          </span>
        </div>
      </div>
    </div>
  )
}