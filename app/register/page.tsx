import type { Metadata } from 'next'
import RegisterForm from './RegisterForm'
import Link from 'next/link'
import { Car } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create an Ezer Auto account to save vehicles and manage your service appointments.',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#012641] rounded-xl mb-4">
            <Car size={24} className="text-white" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-[#012641]">Create your account</h1>
          <p className="text-[#475569] mt-1">Save vehicles and manage your appointments</p>
        </div>
        <RegisterForm />
        <p className="text-center mt-5 text-sm text-[#475569]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#EE005A] font-semibold hover:underline cursor-pointer">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
