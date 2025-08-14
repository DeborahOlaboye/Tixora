import React from 'react'
import SearchFilters from './SearchFilters'
import EventsGrid from './EventsGrid'

export default function MainContent({
  filteredEvents,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
}) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-coral-400 via-amber-400 to-lime-400 bg-clip-text text-transparent mb-4">
          Discover Events
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Find amazing events and secure your NFT tickets on the blockchain
        </p>
      </div>
      <SearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        filteredEvents={filteredEvents}
      />
      <EventsGrid filteredEvents={filteredEvents} />
    </main>
  )
}