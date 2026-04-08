'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { SavedVehicle, ServiceBooking } from '@/types'
import { Car, Calendar, Heart, LogOut, ArrowRight, Gauge, Trash2, User, CreditCard, Loader, CheckCircle } from 'lucide-react'

interface Props {
  user: { email: string; name: string; phone: string }
  savedVehicles: (SavedVehicle & { vehicle: { id: string; make: string; model: string; year: number; mileage: number; price: number } | null })[]
  bookings: ServiceBooking[]
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-500',
}

const tabs = [
  { id: 'saved', label: 'Saved Vehicles', icon: Heart },
  { id: 'bookings', label: 'Appointments', icon: Calendar },
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'payments', label: 'Payments', icon: CreditCard },
] as const

type Tab = (typeof tabs)[number]['id']

export default function DashboardClient({ user, savedVehicles: initial, bookings }: Props) {
  const [tab, setTab] = useState<Tab>('saved')
  const [saved, setSaved] = useState(initial)
  const [profile, setProfile] = useState({ name: user.name, phone: user.phone })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [profileError, setProfileError] = useState('')
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const removeSaved = async (id: string) => {
    const supabase = createClient()
    await supabase.from('saved_vehicles').delete().eq('id', id)
    setSaved((s) => s.filter((sv) => sv.id !== id))
  }

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileError('')
    setProfileSuccess(false)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({
      data: { name: profile.name.trim(), phone: profile.phone.trim() },
    })
    setProfileLoading(false)
    if (error) {
      setProfileError('Failed to save. Please try again.')
    } else {
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-[#012641] py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <p className="text-[#EE005A] text-sm font-medium mb-1">Welcome back</p>
            <h1 className="text-2xl font-bold text-white">{user.name || user.email}</h1>
            {user.name && <p className="text-white/50 text-sm mt-0.5">{user.email}</p>}
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-lg border border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <LogOut size={15} aria-hidden="true" /> Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-[#e2e8f0]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#EE005A]/10 rounded-lg flex items-center justify-center">
                <Heart size={18} className="text-[#EE005A]" aria-hidden="true" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#012641]">{saved.length}</div>
                <div className="text-sm text-[#475569]">Saved Vehicles</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-[#e2e8f0]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#012641]/10 rounded-lg flex items-center justify-center">
                <Calendar size={18} className="text-[#012641]" aria-hidden="true" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#012641]">{bookings.length}</div>
                <div className="text-sm text-[#475569]">Appointments</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl border border-[#e2e8f0] p-1 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                tab === id ? 'bg-[#012641] text-white' : 'text-[#475569] hover:text-[#012641]'
              }`}
            >
              <Icon size={14} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>

        {/* Saved Vehicles */}
        {tab === 'saved' && (
          <div>
            {saved.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#e2e8f0] p-12 text-center">
                <Car size={40} className="text-[#e2e8f0] mx-auto mb-3" aria-hidden="true" />
                <p className="text-[#475569] font-medium mb-4">No saved vehicles yet</p>
                <Link href="/inventory" className="inline-flex items-center gap-1.5 text-[#EE005A] font-semibold text-sm cursor-pointer">
                  Browse inventory <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {saved.map((sv) => sv.vehicle && (
                  <div key={sv.id} className="bg-white rounded-xl border border-[#e2e8f0] p-5 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-[#012641]">
                        {sv.vehicle.year} {sv.vehicle.make} {sv.vehicle.model}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-[#475569]">
                        <span className="flex items-center gap-1"><Gauge size={13} aria-hidden="true" />{sv.vehicle.mileage.toLocaleString()} mi</span>
                        <span className="font-semibold text-[#EE005A]">${sv.vehicle.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/inventory/${sv.vehicle.id}`}
                        className="px-4 py-2 bg-[#012641] text-white text-sm font-semibold rounded-lg hover:bg-[#023a61] transition-colors cursor-pointer"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => removeSaved(sv.id)}
                        className="p-2 text-[#94a3b8] hover:text-red-500 transition-colors cursor-pointer rounded-lg hover:bg-red-50"
                        aria-label="Remove from saved"
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Appointments */}
        {tab === 'bookings' && (
          <div>
            {bookings.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#e2e8f0] p-12 text-center">
                <Calendar size={40} className="text-[#e2e8f0] mx-auto mb-3" aria-hidden="true" />
                <p className="text-[#475569] font-medium mb-4">No appointments yet</p>
                <Link href="/services" className="inline-flex items-center gap-1.5 text-[#EE005A] font-semibold text-sm cursor-pointer">
                  Book a service <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b.id} className="bg-white rounded-xl border border-[#e2e8f0] p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-[#012641]">{b.service_type}</h3>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColors[b.status] ?? 'bg-gray-100 text-gray-500'}`}>
                            {b.status}
                          </span>
                        </div>
                        <p className="text-sm text-[#475569]">{b.vehicle_info}</p>
                        <p className="text-sm text-[#475569] mt-0.5">
                          Preferred date: <span className="font-medium text-[#012641]">{new Date(b.preferred_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Profile */}
        {tab === 'profile' && (
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 sm:p-8 max-w-lg">
            <h2 className="text-lg font-bold text-[#012641] mb-6">My Profile</h2>
            <form onSubmit={saveProfile} className="space-y-5">
              <div>
                <label htmlFor="profile-name" className="block text-sm font-semibold text-[#012641] mb-1.5">Full Name</label>
                <input
                  id="profile-name"
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-3.5 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#EE005A]/30 focus:border-[#EE005A]"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="profile-email" className="block text-sm font-semibold text-[#012641] mb-1.5">Email</label>
                <input
                  id="profile-email"
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-3.5 py-3 bg-[#f1f5f9] border border-[#e2e8f0] rounded-lg text-sm text-[#94a3b8] cursor-not-allowed"
                />
                <p className="text-xs text-[#94a3b8] mt-1">Email cannot be changed here.</p>
              </div>
              <div>
                <label htmlFor="profile-phone" className="block text-sm font-semibold text-[#012641] mb-1.5">Phone</label>
                <input
                  id="profile-phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full px-3.5 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#EE005A]/30 focus:border-[#EE005A]"
                  placeholder="(402) 555-0100"
                />
              </div>
              {profileError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600" role="alert">{profileError}</div>
              )}
              {profileSuccess && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600" role="status">
                  <CheckCircle size={15} aria-hidden="true" /> Profile saved successfully.
                </div>
              )}
              <button
                type="submit"
                disabled={profileLoading}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#012641] text-white text-sm font-semibold rounded-lg hover:bg-[#023a61] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {profileLoading ? <><Loader size={15} className="animate-spin" aria-hidden="true" /> Saving…</> : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* Payments */}
        {tab === 'payments' && (
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-12 text-center">
            <div className="w-16 h-16 bg-[#f1f5f9] rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard size={28} className="text-[#94a3b8]" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-[#012641] mb-2">Payment History</h3>
            <p className="text-[#475569] text-sm max-w-xs mx-auto">Payment history coming soon. You&apos;ll be able to view invoices and receipts here.</p>
          </div>
        )}
      </div>
    </div>
  )
}
