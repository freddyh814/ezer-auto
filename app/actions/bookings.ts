'use server'

import { createClient } from '@/lib/supabase/server'

interface BookingInput {
  name: string
  phone: string
  vehicle_info: string
  service_type: string
  preferred_date: string
}

interface BookingResult {
  error?: string
  success?: boolean
}

export async function createBooking(input: BookingInput): Promise<BookingResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'You must be logged in to book an appointment.' }

  const { name, phone, vehicle_info, service_type, preferred_date } = input

  if (!name.trim() || !phone.trim() || !vehicle_info.trim() || !service_type || !preferred_date) {
    return { error: 'All fields are required.' }
  }

  const { error: dbError } = await supabase.from('service_bookings').insert({
    user_id: user.id,
    email: user.email,
    name: name.trim(),
    phone: phone.trim(),
    vehicle_info: vehicle_info.trim(),
    service_type,
    preferred_date,
    status: 'pending',
  })

  if (dbError) return { error: 'Failed to submit booking. Please try again.' }

  // TODO: Send email notification to staff (configure Resend or n8n webhook here)

  return { success: true }
}
