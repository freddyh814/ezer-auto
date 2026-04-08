'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Vehicle } from '@/types'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'

interface Props {
  vehicles: Vehicle[]
}

export default function HeroCarousel({ vehicles }: Props) {
  const [current, setCurrent] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % vehicles.length)
  }, [vehicles.length])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + vehicles.length) % vehicles.length)
  }, [vehicles.length])

  useEffect(() => {
    if (isHovered || vehicles.length <= 1) return
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [isHovered, next, vehicles.length])

  if (vehicles.length === 0) return null

  const vehicle = vehicles[current]
  const hasImage = vehicle.images && vehicle.images.length > 0

  return (
    <div
      className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl min-h-[400px] lg:min-h-[480px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      {hasImage ? (
        <Image
          src={vehicle.images[0]}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          fill
          className="object-cover transition-opacity duration-500"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-[#023a61] flex items-center justify-center">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" opacity={0.3} aria-hidden="true">
            <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h12l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
            <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
          </svg>
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Vehicle info */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-[#EE005A] text-xs font-bold uppercase tracking-widest mb-1">Available Now</p>
        <h3 className="text-white font-bold text-xl leading-tight mb-1">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h3>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-white/60 text-xs">{vehicle.mileage.toLocaleString()} mi</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white text-2xl font-bold">${vehicle.price.toLocaleString()}</span>
          <Link
            href={`/inventory/${vehicle.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#EE005A] text-white text-sm font-semibold rounded-lg hover:bg-[#c4004b] transition-colors duration-200 cursor-pointer"
          >
            View <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Prev / Next — only show if multiple vehicles */}
      {vehicles.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer backdrop-blur-sm"
            aria-label="Previous vehicle"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer backdrop-blur-sm"
            aria-label="Next vehicle"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>

          {/* Dots */}
          <div className="absolute top-4 right-4 flex gap-1.5">
            {vehicles.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all duration-200 cursor-pointer ${
                  i === current ? 'bg-[#EE005A] w-5' : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to vehicle ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
