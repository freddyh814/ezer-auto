'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function StaffLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError || !data.user) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    const { data: profile, error: profileError } = await supabase
      .from('staff_profiles')
      .select('id, role, is_active')
      .eq('user_id', data.user.id)
      .single()

    if (profileError || !profile) {
      await supabase.auth.signOut()
      setError('No staff account found for this email.')
      setLoading(false)
      return
    }

    if (!profile.is_active) {
      await supabase.auth.signOut()
      setError('Your account has been deactivated. Contact your administrator.')
      setLoading(false)
      return
    }

    router.push('/admin/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#012641] mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#012641]/20 focus:border-[#012641]"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[#012641] mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#012641]/20 focus:border-[#012641]"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-[#012641] text-white text-sm font-semibold rounded-lg hover:bg-[#023a61] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  )
}
