'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, Loader } from 'lucide-react'

export default function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    })
    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-10 text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-500" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-bold text-[#012641] mb-2">Check your email</h3>
        <p className="text-[#475569]">We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl border border-[#e2e8f0] p-7 space-y-5">
      <div>
        <label htmlFor="reg-email" className="block text-sm font-semibold text-[#012641] mb-1.5">Email</label>
        <input
          id="reg-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3.5 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EE005A]/30 focus:border-[#EE005A]"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="reg-password" className="block text-sm font-semibold text-[#012641] mb-1.5">Password</label>
        <input
          id="reg-password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3.5 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EE005A]/30 focus:border-[#EE005A]"
          placeholder="Min. 6 characters"
        />
      </div>
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600" role="alert">{error}</div>
      )}
      <button
        type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#EE005A] text-white font-semibold rounded-lg hover:bg-[#c4004b] transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? <><Loader size={16} className="animate-spin" aria-hidden="true" /> Creating account…</> : 'Create Account'}
      </button>
    </form>
  )
}
