'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

interface LoginResult {
  error?: string
}

export async function staffLogin(email: string, password: string): Promise<LoginResult> {
  const supabase = await createClient()

  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  })

  if (signInError || !data.user) {
    return { error: 'Invalid email or password.' }
  }

  const { data: profile } = await supabase
    .from('staff_profiles')
    .select('id, is_active')
    .eq('user_id', data.user.id)
    .single()

  if (!profile) {
    await supabase.auth.signOut()
    return { error: 'No staff account found for this email.' }
  }

  if (!profile.is_active) {
    await supabase.auth.signOut()
    return { error: 'Your account has been deactivated. Contact your administrator.' }
  }

  redirect('/admin/dashboard')
}
