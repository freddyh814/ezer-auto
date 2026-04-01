export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  mileage: number
  price: number
  description: string
  images: string[]
  available: boolean
  status: 'for_sale' | 'parts_only' | 'title_pending' | 'project'
  created_at: string
}

export interface ServiceBooking {
  id: string
  user_id: string | null
  name: string
  phone: string
  email: string
  vehicle_info: string
  service_type: string
  preferred_date: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  created_at: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  message: string
  created_at: string
}

export interface SavedVehicle {
  id: string
  user_id: string
  vehicle_id: string
  created_at: string
  vehicle?: Vehicle
}

export type StaffRole = 'admin' | 'manager' | 'sales'

export interface StaffProfile {
  id: string
  user_id: string
  name: string
  role: StaffRole
  is_active: boolean
  created_at: string
}

export interface StaffUser {
  user: { id: string; email: string }
  profile: StaffProfile
}
