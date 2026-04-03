'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface Props {
  images: string[]
  alt: string
}

export default function ImageGallery({ images, alt }: Props) {
  const [selected, setSelected] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  if (images.length === 0) {
    return (
      <div className="bg-[#f1f5f9] h-72 sm:h-96 flex flex-col items-center justify-center gap-3 text-[#94a3b8]">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
          <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h12l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
          <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
          <path d="M9 17h6" />
        </svg>
        <span className="text-sm">Photos coming soon</span>
      </div>
    )
  }

  const prev = () => setSelected((s) => (s - 1 + images.length) % images.length)
  const next = () => setSelected((s) => (s + 1) % images.length)

  return (
    <>
      {/* Main image */}
      <div
        className="relative bg-[#f1f5f9] h-72 sm:h-[420px] cursor-zoom-in overflow-hidden"
        onClick={() => setLightbox(true)}
      >
        <Image
          src={images[selected]}
          alt={`${alt} — photo ${selected + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 1024px) 100vw, 800px"
          priority
        />
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer backdrop-blur-sm"
              aria-label="Previous photo"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer backdrop-blur-sm"
              aria-label="Next photo"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
            <div className="absolute bottom-3 right-4 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
              {selected + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 p-3 overflow-x-auto bg-[#f8fafc] border-b border-[#e2e8f0]">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                i === selected ? 'border-[#EE005A]' : 'border-transparent hover:border-[#EE005A]/40'
              }`}
              aria-label={`Photo ${i + 1}`}
            >
              <Image src={src} alt={`${alt} thumbnail ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
            onClick={() => setLightbox(false)}
            aria-label="Close lightbox"
          >
            <X size={20} aria-hidden="true" />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
            onClick={(e) => { e.stopPropagation(); prev() }}
            aria-label="Previous photo"
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
          <div
            className="relative w-full max-w-4xl h-[70vh] mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selected]}
              alt={`${alt} — photo ${selected + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
            onClick={(e) => { e.stopPropagation(); next() }}
            aria-label="Next photo"
          >
            <ChevronRight size={22} aria-hidden="true" />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {selected + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}
