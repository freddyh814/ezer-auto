'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, Loader } from 'lucide-react'

const serviceTypes = [
  'Oil Change',
  'Brake Service',
  'Tire Service / Rotation',
  'State Inspection',
  'Battery / Electrical',
  'Engine Diagnostics',
  'A/C & Heating',
  'Multi-Point Inspection',
  'Other',
]

export default function BookingForm() {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', vehicle_info: '', service_type: '', preferred_date: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { error: err } = await supabase.from('service_bookings').insert([{
        ...form,
        status: 'pending',
      }])
      if (err) throw err
      setSuccess(true)
    } catch {
      setError('Something went wrong. Please call us at 720-208-5580.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-10 text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-500" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-bold text-[#012641] mb-2">Appointment Requested!</h3>
        <p className="text-[#475569]">
          We&apos;ll confirm your appointment within 24 hours. We&apos;ll reach out to <strong>{form.email}</strong> or call <strong>{form.phone}</strong>.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl border border-[#e2e8f0] p-6 sm:p-8 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-[#012641] mb-1.5">Full Name <span className="text-[#EE005A]">*</span></label>
          <input
            id="name" type="text" required value={form.name} onChange={(e) => set('name', e.target.value)}
            className="w-full px-3.5 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#EE005A]/30 focus:border-[#EE005A]"
            placeholder="John Smith"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-[#012641] mb-1.5">Phone <span className="text-[#EE005A]">*</span></label>
          <input
            id="phone" type="tel" required value={form.phone} onChange={(e) => set('phone', e.target.value)}
            className="w-full px-3.5 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#EE005A]/30 focus:border-[#EE005A]"
            placeholder="(402) 555-0100"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-[#012641] mb-1.5">Email <span className="text-[#EE005A]">*</span></label>
        <input
          id="email" type="email" required value={form.email} onChange={(e) => set('email', e.target.value)}
          className="w-full px-3.5 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#EE005A]/30 focus:border-[#EE005A]"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="vehicle_info" className="block text-sm font-semibold text-[#012641] mb-1.5">Vehicle <span className="text-[#EE005A]">*</span></label>
        <input
          id="vehicle_info" type="text" required value={form.vehicle_info} onChange={(e) => set('vehicle_info', e.target.value)}
          className="w-full px-3.5 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#EE005A]/30 focus:border-[#EE005A]"
          placeholder="2019 Toyota Camry — or VIN"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="service_type" className="block text-sm font-semibold text-[#012641] mb-1.5">Service Type <span className="text-[#EE005A]">*</span></label>
          <select
            id="service_type" required value={form.service_type} onChange={(e) => set('service_type', e.target.value)}
            className="w-full px-3.5 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#EE005A]/30 focus:border-[#EE005A] cursor-pointer"
          >
            <option value="">Select a service</option>
            {serviceTypes.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="preferred_date" className="block text-sm font-semibold text-[#012641] mb-1.5">Preferred Date <span className="text-[#EE005A]">*</span></label>
          <input
            id="preferred_date" type="date" required value={form.preferred_date} onChange={(e) => set('preferred_date', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3.5 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#EE005A]/30 focus:border-[#EE005A] cursor-pointer"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600" role="alert">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#EE005A] text-white font-semibold rounded-lg hover:bg-[#c4004b] transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? <><Loader size={16} className="animate-spin" aria-hidden="true" /> Submitting…</> : 'Request Appointment'}
      </button>
    </form>
  )
}
