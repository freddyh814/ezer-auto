import type { Metadata } from 'next'
import LoginForm from './LoginForm'
import Link from 'next/link'
import { Car } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Customer Login',
  description: 'Log in to your Ezer Auto account to manage saved vehicles and service appointments.',
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#012641] rounded-xl mb-4">
            <Car size={24} className="text-white" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-[#012641]">Welcome back</h1>
          <p className="text-[#475569] mt-1">Sign in to your Ezer Auto account</p>
        </div>
        <LoginForm next={next} />
        <p className="text-center mt-5 text-sm text-[#475569]">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-[#EE005A] font-semibold hover:underline cursor-pointer">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
