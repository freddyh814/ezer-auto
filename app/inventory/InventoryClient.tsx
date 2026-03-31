'use client'

import { useState, useMemo } from 'react'
import type { Vehicle } from '@/types'
import VehicleCard from '@/components/VehicleCard'
import { Search, SlidersHorizontal, X } from 'lucide-react'

interface Props {
  vehicles: Vehicle[]
  makes: string[]
}

export default function InventoryClient({ vehicles, makes }: Props) {
  const [search, setSearch] = useState('')
  const [make, setMake] = useState('')
  const [minYear, setMinYear] = useState('')
  const [maxYear, setMaxYear] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const years = useMemo(() => {
    const all = [...new Set(vehicles.map((v) => v.year))].sort((a, b) => b - a)
    return all
  }, [vehicles])

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      if (make && v.make !== make) return false
      if (minYear && v.year < parseInt(minYear)) return false
      if (maxYear && v.year > parseInt(maxYear)) return false
      if (maxPrice && v.price > parseInt(maxPrice)) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          v.make.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          String(v.year).includes(q) ||
          (v.description?.toLowerCase().includes(q) ?? false)
        )
      }
      return true
    })
  }, [vehicles, make, minYear, maxYear, maxPrice, search])

  const clearFilters = () => {
    setSearch('')
    setMake('')
    setMinYear('')
    setMaxYear('')
    setMaxPrice('')
  }

  const hasFilters = search || make || minYear || maxYear || maxPrice

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search + filter toggle */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by make, model, year…"
            className="w-full pl-10 pr-4 py-3 bg-white border border-[#e2e8f0] rounded-lg text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#EE005A]/30 focus:border-[#EE005A]"
            aria-label="Search vehicles"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-colors duration-200 cursor-pointer ${
            showFilters || hasFilters
              ? 'bg-[#EE005A] text-white border-[#EE005A]'
              : 'bg-white text-[#475569] border-[#e2e8f0] hover:border-[#EE005A]/50'
          }`}
          aria-expanded={showFilters}
        >
          <SlidersHorizontal size={16} aria-hidden="true" />
          Filters {hasFilters && '•'}
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wide" htmlFor="filter-make">Make</label>
            <select
              id="filter-make"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#EE005A]/30 cursor-pointer"
            >
              <option value="">All Makes</option>
              {makes.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wide" htmlFor="filter-minyear">Min Year</label>
            <select
              id="filter-minyear"
              value={minYear}
              onChange={(e) => setMinYear(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#EE005A]/30 cursor-pointer"
            >
              <option value="">Any</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wide" htmlFor="filter-maxyear">Max Year</label>
            <select
              id="filter-maxyear"
              value={maxYear}
              onChange={(e) => setMaxYear(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#EE005A]/30 cursor-pointer"
            >
              <option value="">Any</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wide" htmlFor="filter-maxprice">Max Price</label>
            <select
              id="filter-maxprice"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#EE005A]/30 cursor-pointer"
            >
              <option value="">Any</option>
              {[10000,15000,20000,25000,30000,40000,50000].map((p) => (
                <option key={p} value={p}>${p.toLocaleString()}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Results header */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-[#475569]">
          <span className="font-semibold text-[#012641]">{filtered.length}</span> vehicle{filtered.length !== 1 ? 's' : ''} found
        </p>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-[#EE005A] hover:text-[#c4004b] transition-colors cursor-pointer"
          >
            <X size={14} aria-hidden="true" /> Clear filters
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-[#e2e8f0]">
          <p className="text-[#475569] font-medium mb-2">No vehicles match your search</p>
          <button onClick={clearFilters} className="text-sm text-[#EE005A] hover:underline cursor-pointer">Clear filters</button>
        </div>
      )}
    </div>
  )
}
