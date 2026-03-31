import type { Metadata } from 'next'
import BookingForm from './BookingForm'
import { Wrench, Shield, Star, CheckCircle, Zap, Settings, Thermometer, Disc } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Service Center — Book an Appointment',
  description: 'Expert auto service in Omaha, NE. Oil changes, brakes, tires, inspections and more. Book your appointment online at Ezer Auto.',
}

const services = [
  { icon: Wrench, title: 'Oil Change', desc: 'Conventional and synthetic oil changes. Filter replacement included. Keep your engine running strong.' },
  { icon: Disc, title: 'Brake Service', desc: 'Pad and shoe replacement, rotor resurfacing or replacement, brake fluid flush.' },
  { icon: Star, title: 'Tire Service', desc: 'Rotation, balancing, flat repair, and new tire installation with a wide selection of brands.' },
  { icon: CheckCircle, title: 'State Inspection', desc: 'Nebraska safety inspection and emissions testing. Fast turnaround.' },
  { icon: Zap, title: 'Battery & Electrical', desc: 'Battery testing and replacement, alternator checks, starter diagnosis.' },
  { icon: Settings, title: 'Engine Diagnostics', desc: 'Check engine light diagnosis, OBD-II scanning, and repair recommendations.' },
  { icon: Thermometer, title: 'A/C & Heat', desc: 'Climate system service, refrigerant recharge, heater core inspection.' },
  { icon: Shield, title: 'Multi-Point Inspection', desc: 'Comprehensive 25-point vehicle inspection — know exactly what your car needs.' },
]

export default function ServicesPage() {
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
        {/* Services grid */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold text-[#012641] mb-6">Services We Offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-5 border border-[#e2e8f0] hover:border-[#EE005A]/30 hover:shadow-md transition-all duration-200">
                <div className="w-10 h-10 bg-[#EE005A]/10 rounded-lg flex items-center justify-center mb-3">
                  <Icon size={20} className="text-[#EE005A]" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-[#012641] mb-1.5">{title}</h3>
                <p className="text-sm text-[#475569] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Booking form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
              <h3 className="font-semibold text-[#012641] mb-3">Drop Us a Call</h3>
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
