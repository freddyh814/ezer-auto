'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  vehicleId: string
  initialSaved: boolean
  savedId: string | null
  isLoggedIn: boolean
}

export default function SaveButton({ vehicleId, initialSaved, savedId: initialSavedId, isLoggedIn }: Props) {
  const [saved, setSaved] = useState(initialSaved)
  const [savedId, setSavedId] = useState(initialSavedId)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const toggle = async () => {
    if (!isLoggedIn) {
      router.push(`/login?next=/inventory/${vehicleId}`)
      return
    }
    setLoading(true)
    const supabase = createClient()
    if (saved && savedId) {
      await supabase.from('saved_vehicles').delete().eq('id', savedId)
      setSaved(false)
      setSavedId(null)
    } else {
      const { data } = await supabase
        .from('saved_vehicles')
        .insert({ vehicle_id: vehicleId })
        .select('id')
        .single()
      setSaved(true)
      if (data) setSavedId(data.id)
    }
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={saved ? 'Remove from saved' : 'Save vehicle'}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border transition-colors duration-200 cursor-pointer disabled:opacity-60 ${
        saved
          ? 'bg-[#EE005A] text-white border-[#EE005A] hover:bg-[#c4004b]'
          : 'bg-white text-[#475569] border-[#e2e8f0] hover:border-[#EE005A] hover:text-[#EE005A]'
      }`}
    >
      <Heart size={16} className={saved ? 'fill-white' : ''} aria-hidden="true" />
      {saved ? 'Saved' : 'Save'}
    </button>
  )
}
