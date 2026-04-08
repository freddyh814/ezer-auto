import Link from 'next/link'
import Image from 'next/image'
import type { Vehicle } from '@/types'
import { Gauge, ArrowRight } from 'lucide-react'
import { getFirstImage } from '@/lib/parseImages'

interface Props {
  vehicle: Vehicle
  showSaveButton?: boolean
  onSave?: (id: string) => void
  isSaved?: boolean
}

export default function VehicleCard({ vehicle, showSaveButton, onSave, isSaved }: Props) {
  const imageUrl = getFirstImage(vehicle.images)
  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden hover:shadow-lg hover:border-[#EE005A]/20 transition-all duration-200 flex flex-col">
      {/* Image */}
      <div className="relative bg-[#f8fafc] h-48 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-[#94a3b8]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h12l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
              <circle cx="7" cy="17" r="2" />
              <circle cx="17" cy="17" r="2" />
              <path d="M9 17h6" />
            </svg>
            <span className="text-xs">No photo</span>
          </div>
        )}
        {!vehicle.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-[#012641] text-sm font-bold px-3 py-1 rounded-full">SOLD</span>
          </div>
        )}
        {vehicle.status === 'parts_only' && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">PARTS ONLY</div>
        )}
        {vehicle.status === 'title_pending' && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">TITLE PENDING</div>
        )}
        {vehicle.status === 'project' && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">PROJECT CAR</div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-[#012641] text-lg leading-tight mb-1">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h3>
        <div className="flex items-center gap-1.5 text-sm text-[#475569] mb-3">
          <Gauge size={14} aria-hidden="true" />
          <span>{vehicle.mileage.toLocaleString()} miles</span>
        </div>
        {vehicle.description && (
          <p className="text-sm text-[#475569] leading-relaxed mb-4 line-clamp-2">{vehicle.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-2xl font-bold text-[#EE005A]">
            ${vehicle.price.toLocaleString()}
          </span>
          <div className="flex items-center gap-2">
            {showSaveButton && onSave && (
              <button
                onClick={() => onSave(vehicle.id)}
                className={`p-2 rounded-lg border transition-colors duration-200 cursor-pointer ${
                  isSaved
                    ? 'bg-[#EE005A]/10 border-[#EE005A]/30 text-[#EE005A]'
                    : 'border-[#e2e8f0] text-[#94a3b8] hover:border-[#EE005A]/30 hover:text-[#EE005A]'
                }`}
                aria-label={isSaved ? 'Remove from saved' : 'Save vehicle'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            )}
            <Link
              href={`/inventory/${vehicle.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#012641] text-white text-sm font-semibold rounded-lg hover:bg-[#023a61] transition-colors duration-200 cursor-pointer"
            >
              View Details <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
