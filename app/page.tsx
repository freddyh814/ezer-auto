import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Vehicle } from '@/types'
import VehicleCard from '@/components/VehicleCard'
import HeroCarousel from '@/components/HeroCarousel'
import { ArrowRight, MapPin, Phone, Wrench, Shield, Star, ExternalLink, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ezer Auto — Used Cars & Service Center in Omaha, NE',
  description:
    "Omaha's trusted used car dealership at 3224 N 30th Street. Browse quality vehicles, book service appointments, and get trusted auto care.",
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  name: 'Ezer Auto',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '3224 N 30th Street',
    addressLocality: 'Omaha',
    addressRegion: 'NE',
    postalCode: '68111',
    addressCountry: 'US',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 41.2834, longitude: -95.9726 },
  url: 'https://ezerauto.com',
  telephone: '+17202085580',
  email: 'Frederick@theezerkenegdo.com',
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], opens: '08:00', closes: '19:00' },
  ],
}

const services = [
  { icon: Wrench, title: 'Oil Changes', desc: 'Quick, affordable oil changes keeping your engine healthy.' },
  { icon: Shield, title: 'Brake Service', desc: 'Full brake inspections, pad replacement, and rotor service.' },
  { icon: Star, title: 'Tire Service', desc: 'Rotation, balancing, and new tire installation.' },
  { icon: CheckCircle, title: 'Inspections', desc: 'State inspections and full multi-point vehicle checks.' },
]

export default async function HomePage() {
  const supabase = await createClient()
  const { data: featured } = await supabase
    .from('vehicles')
    .select('*')
    .eq('available', true)
    .order('created_at', { ascending: false })
    .limit(3)

  const vehicles = (featured ?? []) as Vehicle[]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      {/* Hero */}
      <section className="relative bg-[#012641] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#EE005A] opacity-10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#EE005A] opacity-10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: text + CTAs */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
                Your Trusted<br />
                <span className="text-[#EE005A]">Auto Dealer</span><br />
                in Omaha
              </h1>
              <p className="text-white/70 text-lg leading-relaxed mb-6 max-w-xl">
                Quality used vehicles and expert service at 3224 N 30th Street. We stand behind every car we sell.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/inventory" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#EE005A] text-white font-semibold rounded-lg hover:bg-[#c4004b] transition-colors duration-200 cursor-pointer">
                  Browse Inventory <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link href="/services" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-colors duration-200 cursor-pointer">
                  Book a Service
                </Link>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-6 text-white/60 text-sm">
                <a href="tel:7202085580" className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                  <Phone size={14} aria-hidden="true" /> 720-208-5580
                </a>
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} aria-hidden="true" /> 3224 N 30th St
                </span>
              </div>
            </div>

            {/* Right: rotating featured inventory */}
            <div className="w-full">
              <HeroCarousel vehicles={vehicles} />
            </div>
          </div>
        </div>
      </section>

      {/* About Snippet */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#012641] mb-4">Omaha&apos;s Trusted Neighborhood Dealership</h2>
              <p className="text-[#475569] leading-relaxed mb-4">
                Ezer Auto was built to give Omaha families access to reliable, affordable vehicles without the pressure. We carefully inspect every car and stand behind every sale.
              </p>
              <p className="text-[#475569] leading-relaxed mb-6">
                As part of the Ezer Kenegdo family, we&apos;re also connected to our Honduras vehicle export pipeline — bringing quality American vehicles to international buyers through EzerCarros.com.
              </p>
              <Link href="/about" className="inline-flex items-center gap-1.5 text-[#EE005A] font-semibold hover:gap-2.5 transition-all duration-200 cursor-pointer">
                Learn our story <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[{ value: '100+', label: 'Vehicles Sold' }, { value: '5★', label: 'Customer Rating' }, { value: '10+', label: 'Years Experience' }, { value: '24hr', label: 'Turnaround Service' }].map(({ value, label }) => (
                <div key={label} className="bg-white rounded-xl p-6 border border-[#e2e8f0] text-center">
                  <div className="text-3xl font-bold text-[#EE005A] mb-1">{value}</div>
                  <div className="text-sm text-[#475569]">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Inventory */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[#012641]">Featured Vehicles</h2>
              <p className="text-[#475569] mt-1">Hand-picked, inspected, and ready to go</p>
            </div>
            <Link href="/inventory" className="hidden sm:inline-flex items-center gap-1.5 text-[#EE005A] font-semibold hover:gap-2.5 transition-all duration-200 cursor-pointer">
              View all <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          {vehicles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
              <p className="text-[#475569]">Connect Supabase to display live inventory.</p>
            </div>
          )}
        </div>
      </section>

      {/* Services Highlights */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#012641]">Service Center</h2>

          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-6 border border-[#e2e8f0] hover:border-[#EE005A]/30 hover:shadow-md transition-all duration-200">
                <div className="w-11 h-11 bg-[#EE005A]/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon size={22} className="text-[#EE005A]" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-[#012641] mb-2">{title}</h3>
                <p className="text-sm text-[#475569] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/services" className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#012641] text-white font-semibold rounded-lg hover:bg-[#023a61] transition-colors duration-200 cursor-pointer">
              Book a Service Appointment <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* EzerCarros Banner */}
      <section className="py-12 bg-[#012641]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-[#EE005A] text-sm font-semibold uppercase tracking-widest mb-2">International Export</p>
              <h2 className="text-2xl font-bold text-white mb-2">Looking to import a vehicle to Honduras?</h2>
              <p className="text-white/70">Visit our sister site — we specialize in exporting quality American vehicles to Central America.</p>
            </div>
            <a
              href="https://ezercarros.com"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 bg-[#EE005A] text-white font-semibold rounded-lg hover:bg-[#c4004b] transition-colors duration-200 cursor-pointer whitespace-nowrap"
            >
              Visit EzerCarros.com <ExternalLink size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
