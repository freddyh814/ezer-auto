import { requireStaff } from '@/lib/staff'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const { user, profile } = await requireStaff()

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-[#012641] mb-2">Dashboard</h1>
      <p className="text-[#475569] mb-8">Welcome back, {profile.name}.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <p className="text-sm text-[#475569] mb-1">Signed in as</p>
          <p className="font-semibold text-[#012641]">{user.email}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <p className="text-sm text-[#475569] mb-1">Role</p>
          <p className="font-semibold text-[#012641] capitalize">{profile.role}</p>
        </div>
        <Link href="/admin/bookings" className="bg-white rounded-xl border border-[#e2e8f0] p-6 hover:border-[#EE005A]/30 hover:shadow-md transition-all duration-200">
          <p className="text-sm text-[#475569] mb-1">Service Bookings</p>
          <p className="font-semibold text-[#012641]">View Appointments →</p>
        </Link>
        <Link href="/admin/inventory" className="bg-white rounded-xl border border-[#e2e8f0] p-6 hover:border-[#EE005A]/30 hover:shadow-md transition-all duration-200">
          <p className="text-sm text-[#475569] mb-1">Inventory</p>
          <p className="font-semibold text-[#012641]">Manage Vehicles →</p>
        </Link>
        {profile.role === 'admin' && (
          <Link href="/admin/staff/new" className="bg-white rounded-xl border border-[#e2e8f0] p-6 hover:border-[#EE005A]/30 hover:shadow-md transition-all duration-200">
            <p className="text-sm text-[#475569] mb-1">Admin</p>
            <p className="font-semibold text-[#012641]">Create Staff Account →</p>
          </Link>
        )}
      </div>
    </main>
  )
}
