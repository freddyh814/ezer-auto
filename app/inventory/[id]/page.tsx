import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Vehicle } from '@/types'
import { ArrowLeft, Gauge, Phone, Mail, CheckCircle } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('vehicles').select('*').eq('id', id).single()
  if (!data) return { title: 'Vehicle Not Found' }
  const v = data as Vehicle
  return {
    title: `${v.year} ${v.make} ${v.model} — $${v.price.toLocaleString()}`,
    description: v.description ?? `${v.year} ${v.make} ${v.model} with ${v.mileage.toLocaleString()} miles. Available at Ezer Auto Omaha.`,
  }
}

export default async function VehicleDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('vehicles').select('*').eq('id', id).single()

  if (!data) notFound()
  const vehicle = data as Vehicle

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/inventory" className="inline-flex items-center gap-1.5 text-sm text-[#475569] hover:text-[#012641] mb-6 transition-colors cursor-pointer">
          <ArrowLeft size={16} aria-hidden="true" /> Back to Inventory
        </Link>

        <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
          {/* Image */}
          <div className="bg-[#f1f5f9] h-72 sm:h-96 flex items-center justify-center">
            {vehicle.images && vehicle.images.length > 0 ? (
              <img
                src={vehicle.images[0]}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-[#94a3b8]">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                  <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h12l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
                  <circle cx="7" cy="17" r="2" />
                  <circle cx="17" cy="17" r="2" />
                  <path d="M9 17h6" />
                </svg>
                <span className="text-sm">Photos coming soon</span>
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main info */}
              <div className="lg:col-span-2">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#012641]">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h1>
                    <div className="flex items-center gap-2 mt-2 text-[#475569]">
                      <Gauge size={16} aria-hidden="true" />
                      <span>{vehicle.mileage.toLocaleString()} miles</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-[#EE005A]">${vehicle.price.toLocaleString()}</div>
                    <div className={`mt-1 text-sm font-medium ${vehicle.available ? 'text-green-600' : 'text-[#94a3b8]'}`}>
                      {vehicle.available ? '✓ Available' : 'Sold'}
                    </div>
                  </div>
                </div>

                {vehicle.description && (
                  <div className="mb-6">
                    <h2 className="text-sm font-semibold text-[#475569] uppercase tracking-wide mb-2">Description</h2>
                    <p className="text-[#0f172a] leading-relaxed">{vehicle.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Year', value: vehicle.year },
                    { label: 'Make', value: vehicle.make },
                    { label: 'Model', value: vehicle.model },
                    { label: 'Mileage', value: `${vehicle.mileage.toLocaleString()} mi` },
                    { label: 'Price', value: `$${vehicle.price.toLocaleString()}` },
                    { label: 'Status', value: vehicle.available ? 'Available' : 'Sold' },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-[#f8fafc] rounded-lg p-3 border border-[#e2e8f0]">
                      <div className="text-xs text-[#94a3b8] mb-0.5">{label}</div>
                      <div className="font-semibold text-[#012641] text-sm">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA sidebar */}
              <div className="space-y-4">
                <div className="bg-[#012641] rounded-xl p-5 text-white">
                  <h3 className="font-semibold mb-3">Interested in this vehicle?</h3>
                  <div className="space-y-3">
                    <a
                      href="tel:7202085580"
                      className="flex items-center gap-2 w-full px-4 py-3 bg-[#EE005A] text-white font-semibold rounded-lg hover:bg-[#c4004b] transition-colors duration-200 cursor-pointer justify-center"
                    >
                      <Phone size={16} aria-hidden="true" /> Call Us
                    </a>
                    <a
                      href="mailto:Contact@theezerkenegdo.com"
                      className="flex items-center gap-2 w-full px-4 py-3 bg-white/10 text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-colors duration-200 cursor-pointer justify-center"
                    >
                      <Mail size={16} aria-hidden="true" /> Email Us
                    </a>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 text-sm text-white/60">
                    <p className="mb-1">720-208-5580</p>
                    <p>3224 N 30th St, Omaha NE</p>
                  </div>
                </div>

                <div className="bg-[#f8fafc] rounded-xl p-5 border border-[#e2e8f0]">
                  <h3 className="font-semibold text-[#012641] mb-3 text-sm">Every vehicle includes</h3>
                  <ul className="space-y-2">
                    {['Multi-point inspection', 'Clean title', 'Vehicle history check', 'Test drive available'].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-[#475569]">
                        <CheckCircle size={14} className="text-green-500 shrink-0" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
