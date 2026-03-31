'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader } from 'lucide-react'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl border border-[#e2e8f0] p-7 space-y-5">
      <div>
        <label htmlFor="login-email" className="block text-sm font-semibold text-[#012641] mb-1.5">Email</label>
        <input
          id="login-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3.5 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EE005A]/30 focus:border-[#EE005A]"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="login-password" className="block text-sm font-semibold text-[#012641] mb-1.5">Password</label>
        <input
          id="login-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3.5 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EE005A]/30 focus:border-[#EE005A]"
          placeholder="••••••••"
        />
      </div>
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600" role="alert">{error}</div>
      )}
      <button
        type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#EE005A] text-white font-semibold rounded-lg hover:bg-[#c4004b] transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? <><Loader size={16} className="animate-spin" aria-hidden="true" /> Signing in…</> : 'Sign In'}
      </button>
    </form>
  )
}
