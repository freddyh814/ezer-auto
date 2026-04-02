import { requireAdmin } from '@/lib/staff'
import CreateStaffForm from './CreateStaffForm'

export default async function CreateStaffPage() {
  await requireAdmin()

  return (
    <main className="max-w-lg mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-[#012641] mb-2">Create Staff Account</h1>
      <p className="text-[#475569] mb-8 text-sm">
        New staff members can log in immediately with the credentials you set.
      </p>
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-sm">
        <CreateStaffForm />
      </div>
    </main>
  )
}
