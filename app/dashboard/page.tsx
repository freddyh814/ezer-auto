import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'

export const metadata: Metadata = {
  title: 'My Dashboard',
  description: 'Manage your saved vehicles and service appointments.',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [{ data: savedRaw }, { data: bookingsRaw }] = await Promise.all([
    supabase
      .from('saved_vehicles')
      .select('*, vehicle:vehicles(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('service_bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  return (
    <DashboardClient
      user={{ email: user.email ?? '' }}
      savedVehicles={savedRaw ?? []}
      bookings={bookingsRaw ?? []}
    />
  )
}
