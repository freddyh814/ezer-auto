# Staff Authentication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add secure staff login, account creation, session checking, and role-based access control for internal admin use — separate from the existing customer auth flow.

**Architecture:** Staff users are Supabase Auth users with a corresponding `staff_profiles` row that stores their name, role, and active status. The login form does a client-side profile check after `signInWithPassword` and signs out immediately if no active staff record is found. All `/admin` pages (except login) call `requireStaff()` server-side and redirect to `/admin/login` if the check fails. The admin-only account creation page uses a service-role Supabase client to create auth users without email confirmation.

**Tech Stack:** Next.js 16 App Router, Supabase SSR (`@supabase/ssr`), Supabase Admin API (service role), TypeScript, Tailwind CSS

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `supabase/migrations/002_staff_auth.sql` | Create | `staff_profiles` table, RLS policy |
| `types/index.ts` | Modify | Add `StaffRole`, `StaffProfile` types |
| `lib/supabase/admin.ts` | Create | Service-role Supabase client (server-only) |
| `lib/staff.ts` | Create | `getStaffUser()`, `requireStaff()`, `requireAdmin()` helpers |
| `app/admin/login/page.tsx` | Create | Staff login page (server, unprotected) |
| `app/admin/login/StaffLoginForm.tsx` | Create | Client login form — signs in, checks staff profile, redirects or shows error |
| `app/admin/dashboard/page.tsx` | Create | Protected staff dashboard — calls `requireStaff()` |
| `app/admin/staff/new/page.tsx` | Create | Admin-only page — calls `requireAdmin()` |
| `app/admin/staff/new/CreateStaffForm.tsx` | Create | Client form — POSTs to server action to create staff account |
| `app/actions/staff.ts` | Create | `createStaffAccount` server action — uses admin client |

---

## Task 1: Database Migration

**Files:**
- Create: `supabase/migrations/002_staff_auth.sql`

- [ ] **Step 1: Write the migration**

```sql
-- supabase/migrations/002_staff_auth.sql

CREATE TYPE staff_role AS ENUM ('admin', 'manager', 'sales');

CREATE TABLE staff_profiles (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  role       staff_role NOT NULL DEFAULT 'sales',
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;

-- Staff can only read their own profile via the anon key.
-- Admin operations (listing all staff, creating staff) use the service role, which bypasses RLS.
CREATE POLICY "staff_read_own"
  ON staff_profiles
  FOR SELECT
  USING (auth.uid() = user_id);
```

- [ ] **Step 2: Apply the migration via Supabase MCP**

Run in MCP (`mcp__supabase__apply_migration`):
- project_id: `khgfkwjretjdiopjgazd`
- name: `staff_auth`
- query: contents of the file above

Expected: migration applied with no errors, `staff_profiles` table visible in Supabase dashboard.

- [ ] **Step 3: Verify table exists**

```sql
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'staff_profiles'
ORDER BY ordinal_position;
```

Expected columns: `id`, `user_id`, `name`, `role`, `is_active`, `created_at`

- [ ] **Step 4: Commit**

```bash
cd /Users/freddy/Projects/ezer-auto
git add supabase/migrations/002_staff_auth.sql
git commit -m "feat(db): add staff_profiles table with role enum and RLS"
```

---

## Task 2: Types

**Files:**
- Modify: `types/index.ts`

- [ ] **Step 1: Add StaffRole and StaffProfile types**

Append to the end of `types/index.ts`:

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/freddy/Projects/ezer-auto
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add types/index.ts
git commit -m "feat(types): add StaffRole, StaffProfile, StaffUser types"
```

---

## Task 3: Admin Supabase Client

**Files:**
- Create: `lib/supabase/admin.ts`

- [ ] **Step 1: Add service-role env var**

In `.env.local`, set the real value:
```
SUPABASE_SERVICE_ROLE_KEY=<paste the service role key from Supabase dashboard → Settings → API>
```

**Important:** This key bypasses all RLS. Never expose it to the browser. Only import `lib/supabase/admin.ts` in server components, server actions, or API routes.

- [ ] **Step 2: Create the admin client**

```typescript
// lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing Supabase admin env vars')
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/supabase/admin.ts .env.local
git commit -m "feat(supabase): add service-role admin client"
```

Note: `.env.local` contains secrets — only commit if your repo is private and you intend to track it. Otherwise just commit `admin.ts`.

---

## Task 4: Staff Auth Helpers

**Files:**
- Create: `lib/staff.ts`

- [ ] **Step 1: Create the helper module**

```typescript
// lib/staff.ts
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { StaffUser } from '@/types'

/**
 * Returns the authenticated staff user with their profile,
 * or null if the user is not authenticated or has no active staff record.
 * Call this in server components.
 */
export async function getStaffUser(): Promise<StaffUser | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('staff_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!profile || !profile.is_active) return null

  return {
    user: { id: user.id, email: user.email! },
    profile,
  }
}

/**
 * Asserts the current request is from an authenticated active staff member.
 * Redirects to /admin/login if not. Use at the top of protected server pages.
 */
export async function requireStaff(): Promise<StaffUser> {
  const staff = await getStaffUser()
  if (!staff) redirect('/admin/login')
  return staff
}

/**
 * Asserts the current request is from an admin staff member.
 * Redirects to /admin/dashboard if authenticated but not admin.
 */
export async function requireAdmin(): Promise<StaffUser> {
  const staff = await requireStaff()
  if (staff.profile.role !== 'admin') redirect('/admin/dashboard')
  return staff
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/staff.ts
git commit -m "feat(auth): add getStaffUser, requireStaff, requireAdmin helpers"
```

---

## Task 5: Server Action — Create Staff Account

**Files:**
- Create: `app/actions/staff.ts`

- [ ] **Step 1: Create the server action**

```typescript
// app/actions/staff.ts
'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { getStaffUser } from '@/lib/staff'
import type { StaffRole } from '@/types'

interface CreateStaffInput {
  name: string
  email: string
  password: string
  role: StaffRole
}

interface CreateStaffResult {
  error?: string
  success?: boolean
}

export async function createStaffAccount(
  input: CreateStaffInput
): Promise<CreateStaffResult> {
  // Verify the caller is an active admin
  const caller = await getStaffUser()
  if (!caller || caller.profile.role !== 'admin') {
    return { error: 'Unauthorized.' }
  }

  const { name, email, password, role } = input

  // Basic validation
  if (!name.trim() || !email.trim() || !password || !role) {
    return { error: 'All fields are required.' }
  }
  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' }
  }
  if (!['admin', 'manager', 'sales'].includes(role)) {
    return { error: 'Invalid role.' }
  }

  const admin = createAdminClient()

  // Create the Supabase auth user (no email confirmation required)
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // skip confirmation email
  })

  if (authError) {
    if (authError.message.includes('already registered')) {
      return { error: 'An account with this email already exists.' }
    }
    return { error: 'Failed to create account. Please try again.' }
  }

  // Create the staff profile
  const { error: profileError } = await admin
    .from('staff_profiles')
    .insert({
      user_id: authData.user.id,
      name: name.trim(),
      role,
      is_active: true,
    })

  if (profileError) {
    // Roll back the auth user if profile creation fails
    await admin.auth.admin.deleteUser(authData.user.id)
    return { error: 'Failed to create staff profile. Please try again.' }
  }

  return { success: true }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/actions/staff.ts
git commit -m "feat(actions): add createStaffAccount server action"
```

---

## Task 6: Staff Login Page

**Files:**
- Create: `app/admin/login/StaffLoginForm.tsx`
- Create: `app/admin/login/page.tsx`

- [ ] **Step 1: Create the client login form**

```typescript
// app/admin/login/StaffLoginForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function StaffLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()

    // Sign in with Supabase Auth
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError || !data.user) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    // Check staff profile exists and is active
    const { data: profile, error: profileError } = await supabase
      .from('staff_profiles')
      .select('id, role, is_active')
      .eq('user_id', data.user.id)
      .single()

    if (profileError || !profile) {
      await supabase.auth.signOut()
      setError('No staff account found for this email.')
      setLoading(false)
      return
    }

    if (!profile.is_active) {
      await supabase.auth.signOut()
      setError('Your account has been deactivated. Contact your administrator.')
      setLoading(false)
      return
    }

    router.push('/admin/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#012641] mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#012641]/20 focus:border-[#012641]"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[#012641] mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#012641]/20 focus:border-[#012641]"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-[#012641] text-white text-sm font-semibold rounded-lg hover:bg-[#023a61] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  )
}
```

- [ ] **Step 2: Create the login page**

```typescript
// app/admin/login/page.tsx
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
```

- [ ] **Step 3: Start dev server and verify the login page renders**

```bash
npm run dev
```

Visit `http://localhost:3000/admin/login`. Expected: centered card with "Staff Portal" heading, email + password fields, Sign In button.

- [ ] **Step 4: Commit**

```bash
git add app/admin/login/
git commit -m "feat(admin): add staff login page"
```

---

## Task 7: Staff Dashboard Page

**Files:**
- Create: `app/admin/dashboard/page.tsx`

- [ ] **Step 1: Create the protected dashboard**

```typescript
// app/admin/dashboard/page.tsx
import { requireStaff } from '@/lib/staff'
import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboardPage() {
  const { user, profile } = await requireStaff()

  // Sign-out action
  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    // redirect is handled client-side via router.refresh() after form submit
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
```

- [ ] **Step 2: Verify the redirect works**

Visit `http://localhost:3000/admin/dashboard` while NOT logged in. Expected: redirected to `http://localhost:3000/admin/login`.

- [ ] **Step 3: Commit**

```bash
git add app/admin/dashboard/page.tsx
git commit -m "feat(admin): add protected staff dashboard"
```

---

## Task 8: Create Staff Account Page

**Files:**
- Create: `app/admin/staff/new/CreateStaffForm.tsx`
- Create: `app/admin/staff/new/page.tsx`

- [ ] **Step 1: Create the client form**

```typescript
// app/admin/staff/new/CreateStaffForm.tsx
'use client'

import { useState } from 'react'
import { createStaffAccount } from '@/app/actions/staff'
import type { StaffRole } from '@/types'

export default function CreateStaffForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<StaffRole>('sales')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    const result = await createStaffAccount({ name, email, password, role })

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    setSuccess(true)
    setName('')
    setEmail('')
    setPassword('')
    setRole('sales')
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
          Staff account created successfully.
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[#012641] mb-1">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#012641]/20 focus:border-[#012641]"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#012641] mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#012641]/20 focus:border-[#012641]"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[#012641] mb-1">
          Temporary Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#012641]/20 focus:border-[#012641]"
        />
        <p className="text-xs text-[#94a3b8] mt-1">Minimum 8 characters</p>
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-[#012641] mb-1">
          Role
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as StaffRole)}
          className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#012641]/20 focus:border-[#012641]"
        >
          <option value="sales">Sales</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-[#012641] text-white text-sm font-semibold rounded-lg hover:bg-[#023a61] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? 'Creating…' : 'Create Account'}
      </button>
    </form>
  )
}
```

- [ ] **Step 2: Create the page**

```typescript
// app/admin/staff/new/page.tsx
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
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/admin/staff/ app/actions/staff.ts
git commit -m "feat(admin): add create staff account page and server action"
```

---

## Task 9: Wire Up Sign Out

The dashboard uses a server action form for sign out. Verify it works end-to-end.

- [ ] **Step 1: Verify sign-out redirects properly**

The `signOut()` server action in `app/admin/dashboard/page.tsx` calls `supabase.auth.signOut()`. After the form submits, the page re-renders. Since `requireStaff()` will now return null, it redirects to `/admin/login`.

This works because Next.js server action form submission triggers a server re-render. No client-side code needed.

- [ ] **Step 2: Manual test**

1. Log in at `/admin/login`
2. On dashboard, click "Sign Out"
3. Expected: redirected to `/admin/login`, session cleared

- [ ] **Step 3: Commit (no code change needed if sign-out already works)**

---

## Task 10: Seed the First Admin Account

You need at least one admin to use the staff creation page. Create it directly via Supabase MCP.

- [ ] **Step 1: Create the auth user via MCP**

Use `mcp__supabase__execute_sql` with the service role (or use Supabase dashboard → Authentication → Users → Add User):

```sql
-- Run this via Supabase Dashboard → SQL Editor, or use the admin API directly
-- The password must be set via the Supabase Auth admin API (not SQL)
-- Use Supabase Dashboard: Authentication → Users → Invite User
-- OR run via the MCP createStaffAccount action once the service role key is set
```

**Easiest path:** Use Supabase dashboard:
1. Go to Authentication → Users → Add User
2. Enter email + password (e.g. `admin@ezerauto.com` / strong password)
3. Copy the user's UUID from the users list
4. Run the following SQL to create the staff profile:

```sql
INSERT INTO staff_profiles (user_id, name, role, is_active)
VALUES (
  '<paste-user-uuid-here>',
  'Admin',
  'admin',
  true
);
```

- [ ] **Step 2: Verify login works end-to-end**

1. Visit `http://localhost:3000/admin/login`
2. Enter the admin email + password
3. Expected: redirect to `/admin/dashboard` showing name "Admin" and role "admin"
4. Expected: "Create Staff Account" card is visible

---

## Manual Testing Checklist

### Auth Flows

| Test | Expected |
|---|---|
| Visit `/admin/dashboard` while logged out | Redirect to `/admin/login` |
| Visit `/admin/staff/new` while logged out | Redirect to `/admin/login` |
| Login with wrong password | Error: "Invalid email or password." |
| Login with non-staff email (customer account) | Error: "No staff account found for this email." |
| Login with deactivated staff account | Error: "Your account has been deactivated." |
| Login with valid admin credentials | Redirect to `/admin/dashboard`, see name + "admin" role |
| Login with valid sales credentials | Redirect to `/admin/dashboard`, "Create Staff Account" card NOT visible |
| Visit `/admin/staff/new` as non-admin staff | Redirect to `/admin/dashboard` |
| Create staff account with duplicate email | Error: "An account with this email already exists." |
| Create staff account with password < 8 chars | Error: "Password must be at least 8 characters." |
| Create valid staff account | Success message, form resets |
| Log in as newly created staff | Works immediately |
| Sign out | Redirect to `/admin/login`, session cleared |

### Testing Deactivated Account

```sql
-- Deactivate a staff member
UPDATE staff_profiles SET is_active = false WHERE user_id = '<uuid>';
-- Try to log in — expect "deactivated" error
-- Re-activate
UPDATE staff_profiles SET is_active = true WHERE user_id = '<uuid>';
```

---

## Notes for Future Extension

- **Password reset:** Add `/admin/forgot-password` page calling `supabase.auth.resetPasswordForEmail()` — no schema changes needed
- **Staff list page:** Add `/admin/staff` page using `createAdminClient()` to query all staff profiles
- **Edit staff role/status:** Add server action `updateStaffAccount(userId, { role, is_active })` using admin client
- **Middleware protection:** If the `/admin` section grows, consider adding admin route matching to `middleware.ts` alongside `updateSession()` for an early redirect before server components run
