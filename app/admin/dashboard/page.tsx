import { requireStaff } from '@/lib/staff'
import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboardPage() {
  const { user, profile } = await requireStaff()

  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="bg-[#012641] py-4 px-6 flex items-center justify-between">
        <div>
          <span className="text-white font-bold text-lg">Ezer Auto</span>
          <span className="text-white/50 text-sm ml-2">Staff Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/70 text-sm">
            {profile.name} &middot;{' '}
            <span className="capitalize text-white">{profile.role}</span>
          </span>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm px-3 py-1.5 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </form>
        </div>
      </header>

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
          {profile.role === 'admin' && (
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 flex flex-col justify-between">
              <p className="text-sm text-[#475569] mb-3">Admin Actions</p>
              <a
                href="/admin/staff/new"
                className="inline-flex items-center justify-center px-4 py-2 bg-[#012641] text-white text-sm font-semibold rounded-lg hover:bg-[#023a61] transition-colors"
              >
                Create Staff Account
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
