import type { Metadata } from 'next'
import StaffLoginForm from './StaffLoginForm'

export const metadata: Metadata = {
  title: 'Staff Login — Ezer Auto',
}

export default function StaffLoginPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-[#012641]">Staff Portal</h1>
          <p className="text-sm text-[#475569] mt-1">Ezer Auto internal access</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-sm">
          <StaffLoginForm />
        </div>
      </div>
    </div>
  )
}
