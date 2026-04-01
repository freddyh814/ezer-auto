// app/actions/staff.ts
'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { getStaffUser } from '@/lib/staff'
import type { StaffRole } from '@/types'

interface CreateStaffInput {
  name: string
  email: string
  password: string
  role: StaffRole
}

interface CreateStaffResult {
  error?: string
  success?: boolean
}

export async function createStaffAccount(
  input: CreateStaffInput
): Promise<CreateStaffResult> {
  // Verify the caller is an active admin
  const caller = await getStaffUser()
  if (!caller || caller.profile.role !== 'admin') {
    return { error: 'Unauthorized.' }
  }

  const { name: rawName, email: rawEmail, password, role } = input
  const name = rawName.trim()
  const email = rawEmail.trim()

  // Basic validation
  if (!name || !email || !password || !role) {
    return { error: 'All fields are required.' }
  }
  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' }
  }
  if (!['admin', 'manager', 'sales'].includes(role)) {
    return { error: 'Invalid role.' }
  }

  const admin = createAdminClient()

  // Create the Supabase auth user (no email confirmation required)
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // skip confirmation email
  })

  if (authError) {
    if (authError.message.includes('already registered')) {
      return { error: 'An account with this email already exists.' }
    }
    return { error: 'Failed to create account. Please try again.' }
  }

  // Create the staff profile
  const { error: profileError } = await admin
    .from('staff_profiles')
    .insert({
      user_id: authData.user.id,
      name,
      role,
      is_active: true,
    })

  if (profileError) {
    // Roll back the auth user if profile creation fails
    const { error: deleteError } = await admin.auth.admin.deleteUser(authData.user.id)
    if (deleteError) {
      return { error: 'Profile creation failed and auth user could not be rolled back. Contact support.' }
    }
    return { error: 'Failed to create staff profile. Please try again.' }
  }

  return { success: true }
}
