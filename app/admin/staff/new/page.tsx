import { requireAdmin } from '@/lib/staff'
import CreateStaffForm from './CreateStaffForm'
import Link from 'next/link'

export default async function CreateStaffPage() {
  await requireAdmin()

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="bg-[#012641] py-4 px-6">
        <Link href="/admin/dashboard" className="text-white/70 hover:text-white text-sm transition-colors">
          ← Back to Dashboard
        </Link>
      </header>

      <main className="max-w-lg mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-[#012641] mb-2">Create Staff Account</h1>
        <p className="text-[#475569] mb-8 text-sm">
          New staff members can log in immediately with the credentials you set.
        </p>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-sm">
          <CreateStaffForm />
        </div>
      </main>
    </div>
  )
}
