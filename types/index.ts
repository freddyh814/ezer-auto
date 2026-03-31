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
