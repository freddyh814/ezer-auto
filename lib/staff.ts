import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { StaffUser } from '@/types'

export async function getStaffUser(): Promise<StaffUser | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('staff_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!profile || !profile.is_active) return null

  if (!user.email) return null

  return {
    user: { id: user.id, email: user.email },
    profile,
  }
}

export async function requireStaff(): Promise<StaffUser> {
  const staff = await getStaffUser()
  if (!staff) redirect('/admin/login')
  return staff
}

export async function requireAdmin(): Promise<StaffUser> {
  const staff = await requireStaff()
  if (staff.profile.role !== 'admin') redirect('/admin/dashboard')
  return staff
}
