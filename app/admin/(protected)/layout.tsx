import { redirect } from 'next/navigation'
import { requireStaff } from '@/lib/staff'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { ReactNode } from 'react'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { user, profile } = await requireStaff()

  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="bg-[#012641] py-4 px-6 flex items-center justify-between">
        <nav className="flex items-center gap-6">
          <span className="text-white font-bold text-lg">Ezer Auto</span>
          <span className="text-white/30">|</span>
          <Link href="/admin/dashboard" className="text-white/70 hover:text-white text-sm transition-colors">Dashboard</Link>
          <Link href="/admin/bookings" className="text-white/70 hover:text-white text-sm transition-colors">Bookings</Link>
          <Link href="/admin/inventory" className="text-white/70 hover:text-white text-sm transition-colors">Inventory</Link>
          {profile.role === 'admin' && (
            <Link href="/admin/staff/new" className="text-white/70 hover:text-white text-sm transition-colors">Staff</Link>
          )}
        </nav>
        <div className="flex items-center gap-4">
          <span className="text-white/70 text-sm">
            {profile.name} &middot; <span className="capitalize text-white">{profile.role}</span>
          </span>
          <form action={signOut}>
            <button type="submit" className="text-sm px-3 py-1.5 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors cursor-pointer">
              Sign Out
            </button>
          </form>
        </div>
      </header>
      {children}
    </div>
  )
}
