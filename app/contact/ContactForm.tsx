'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, Loader } from 'lucide-react'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
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
      const { error: err } = await supabase.from('contact_submissions').insert([form])
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
        <h3 className="text-xl font-bold text-[#012641] mb-2">Message Sent!</h3>
        <p className="text-[#475569]">Thanks for reaching out. We&apos;ll get back to you shortly at <strong>{form.email}</strong>.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl border border-[#e2e8f0] p-6 sm:p-8 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-semibold text-[#012641] mb-1.5">Name <span className="text-[#EE005A]">*</span></label>
          <input
            id="contact-name" type="text" required value={form.name} onChange={(e) => set('name', e.target.value)}
            className="w-full px-3.5 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#EE005A]/30 focus:border-[#EE005A]"
            placeholder="John Smith"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-semibold text-[#012641] mb-1.5">Email <span className="text-[#EE005A]">*</span></label>
          <input
            id="contact-email" type="email" required value={form.email} onChange={(e) => set('email', e.target.value)}
            className="w-full px-3.5 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#EE005A]/30 focus:border-[#EE005A]"
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm font-semibold text-[#012641] mb-1.5">Message <span className="text-[#EE005A]">*</span></label>
        <textarea
          id="contact-message" required rows={5} value={form.message} onChange={(e) => set('message', e.target.value)}
          className="w-full px-3.5 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#EE005A]/30 focus:border-[#EE005A] resize-none"
          placeholder="Ask about a vehicle, service, or anything else…"
        />
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
        {loading ? <><Loader size={16} className="animate-spin" aria-hidden="true" /> Sending…</> : 'Send Message'}
      </button>
    </form>
  )
}
