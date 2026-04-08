import type { Metadata } from 'next'
import Link from 'next/link'
import BookingForm from './BookingForm'
import { Wrench } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Service Center — Book an Appointment',
  description: 'Expert auto service in Omaha, NE. Oil changes, brakes, tires, inspections and more. Book your appointment online at Ezer Auto.',
}

const services = [
  {
    title: 'Oil Change',
    price: '$39',
    image: 'https://images.unsplash.com/photo-1635769400073-08b97f2e2f0f?w=600&q=80',
    desc: 'Conventional and synthetic oil changes. Filter replacement included. Keep your engine running strong.',
  },
  {
    title: 'Brake Service',
    price: '$89',
    image: 'https://images.unsplash.com/photo-1617531653332-bd46c16f6a0b?w=600&q=80',
    desc: 'Pad and shoe replacement, rotor resurfacing or replacement, brake fluid flush.',
  },
  {
    title: 'Tire Service',
    price: '$59',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    desc: 'Rotation, balancing, flat repair, and new tire installation with a wide selection of brands.',
  },
  {
    title: 'State Inspection',
    price: '$49',
    image: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=600&q=80',
    desc: 'Nebraska safety inspection and emissions testing. Fast turnaround.',
  },
  {
    title: 'Battery & Electrical',
    price: '$79',
    image: 'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=600&q=80',
    desc: 'Battery testing and replacement, alternator checks, starter diagnosis.',
  },
  {
    title: 'Engine Diagnostics',
    price: '$99',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80',
    desc: 'Check engine light diagnosis, OBD-II scanning, and repair recommendations.',
  },
  {
    title: 'A/C & Heat',
    price: '$129',
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&q=80',
    desc: 'Climate system service, refrigerant recharge, heater core inspection.',
  },
  {
    title: 'Multi-Point Inspection',
    price: '$49',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    desc: 'Comprehensive 25-point vehicle inspection — know exactly what your car needs.',
  },
]

export default async function ServicesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/services')
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-[#012641] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Service Center</h1>
          <p className="text-white/70">Expert care for your vehicle — drop in or book online</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Services flip cards */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold text-[#012641] mb-6">Services We Offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map(({ title, price, image, desc }) => (
              <div key={title} className="group h-72 [perspective:1000px] cursor-pointer">
                <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  {/* Front */}
                  <div className="absolute inset-0 [backface-visibility:hidden] rounded-xl overflow-hidden shadow-sm border border-[#e2e8f0]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-[60%] object-cover"
                    />
                    <div className="p-4 bg-white h-[40%] flex flex-col justify-center">
                      <h3 className="font-semibold text-[#012641] mb-1">{title}</h3>
                      <p className="text-[#EE005A] font-bold text-xl">Starting at {price}</p>
                    </div>
                  </div>
                  {/* Back */}
                  <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl bg-[#012641] p-6 flex flex-col justify-between border border-[#EE005A]/20">
                    <div>
                      <p className="text-[#EE005A] text-xs font-bold uppercase tracking-widest mb-2">{price}</p>
                      <h3 className="font-semibold text-white text-lg mb-3">{title}</h3>
                      <p className="text-white/70 text-sm leading-relaxed">{desc}</p>
                    </div>
                    <Link
                      href="#booking"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#EE005A] text-white text-sm font-semibold rounded-lg hover:bg-[#c4004b] transition-colors duration-200 cursor-pointer"
                    >
                      Book This Service
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking form */}
        <div id="booking" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-[#012641] mb-2">Book an Appointment</h2>
            <p className="text-[#475569] mb-6">Fill out the form and we&apos;ll confirm your appointment within 24 hours.</p>
            <BookingForm />
          </div>
          <div className="space-y-5">
            <div className="bg-[#012641] rounded-xl p-6 text-white">
              <h3 className="font-semibold mb-4">Service Hours</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex justify-between"><span>Mon – Fri</span><span className="font-medium text-white">9am – 6pm</span></li>
                <li className="flex justify-between"><span>Saturday</span><span className="font-medium text-white">10am – 4pm</span></li>
                <li className="flex justify-between"><span>Sunday</span><span className="text-white/40">Closed</span></li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 border border-[#e2e8f0]">
              <h3 className="font-semibold text-[#012641] mb-3">Give Us a Call</h3>
              <p className="text-sm text-[#475569] mb-3">Prefer to book by phone? Give us a call.</p>
              <a href="tel:7202085580" className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#EE005A] text-white font-semibold text-sm rounded-lg hover:bg-[#c4004b] transition-colors cursor-pointer">
                <Wrench size={15} aria-hidden="true" /> 720-208-5580
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
