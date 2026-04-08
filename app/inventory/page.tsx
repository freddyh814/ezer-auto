import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import type { Vehicle } from '@/types'
import { parseImages } from '@/lib/parseImages'
import InventoryClient from './InventoryClient'

export const metadata: Metadata = {
  title: 'Inventory — Browse Used Cars',
  description: 'Browse our selection of quality used vehicles in Omaha, NE. Filter by make, year, and price to find your perfect car.',
}

export default async function InventoryPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false })

  const vehicles = (data ?? []).map(v => ({ ...v, images: parseImages(v.images as string[]) })) as Vehicle[]
  const makes = [...new Set(vehicles.map((v) => v.make))].sort()

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="bg-[#012641] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Our Inventory</h1>
          <p className="text-white/70">Every vehicle inspected and ready to drive</p>
        </div>
      </div>
      <InventoryClient vehicles={vehicles} makes={makes} />
    </div>
  )
}
