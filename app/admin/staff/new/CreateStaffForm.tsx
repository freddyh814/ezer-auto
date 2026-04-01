'use client'

import { useState } from 'react'
import { createStaffAccount } from '@/app/actions/staff'
import type { StaffRole } from '@/types'

export default function CreateStaffForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<StaffRole>('sales')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    const result = await createStaffAccount({ name, email, password, role })

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    setSuccess(true)
    setName('')
    setEmail('')
    setPassword('')
    setRole('sales')
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
          Staff account created successfully.
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[#012641] mb-1">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#012641]/20 focus:border-[#012641]"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#012641] mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#012641]/20 focus:border-[#012641]"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[#012641] mb-1">
          Temporary Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#012641]/20 focus:border-[#012641]"
        />
        <p className="text-xs text-[#94a3b8] mt-1">Minimum 8 characters</p>
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-[#012641] mb-1">
          Role
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as StaffRole)}
          className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#012641]/20 focus:border-[#012641]"
        >
          <option value="sales">Sales</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-[#012641] text-white text-sm font-semibold rounded-lg hover:bg-[#023a61] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? 'Creating…' : 'Create Account'}
      </button>
    </form>
  )
}
