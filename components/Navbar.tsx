'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, User, ChevronDown, LogOut, LayoutDashboard } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const links = [
  { href: '/', label: 'Home' },
  { href: '/inventory', label: 'Inventory' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [authUser, setAuthUser] = useState<{ email: string } | null>(null)
  const [accountOpen, setAccountOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setAuthUser(user ? { email: user.email ?? '' } : null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setAuthUser(session?.user ? { email: session.user.email ?? '' } : null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAccountOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setAccountOpen(false)
    router.push('/')
    router.refresh()
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#012641] shadow-lg' : 'bg-[#012641]/95 backdrop-blur-sm'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" aria-label="Ezer Auto home">
            <Image
              src="/EzerAutoLogo.png"
              alt="Ezer Auto logo"
              width={44}
              height={44}
              className="h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <span className="text-white font-bold text-xl tracking-tight">
              Ezer <span className="text-[#EE005A]">Auto</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer ${
                  pathname === href
                    ? 'bg-[#EE005A] text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/services"
              className="ml-3 px-5 py-2 bg-[#EE005A] text-white text-sm font-semibold rounded-lg hover:bg-[#c4004b] transition-colors duration-200 cursor-pointer"
            >
              Book Service
            </Link>

            {/* Auth button */}
            {authUser ? (
              <div className="relative ml-2" ref={dropdownRef}>
                <button
                  onClick={() => setAccountOpen((o) => !o)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white/10 text-white text-sm font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-colors duration-200 cursor-pointer"
                >
                  <User size={15} aria-hidden="true" />
                  My Account
                  <ChevronDown size={13} aria-hidden="true" />
                </button>
                {accountOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#e2e8f0] overflow-hidden z-50">
                    <p className="px-4 py-2.5 text-xs text-[#94a3b8] truncate border-b border-[#e2e8f0]">{authUser.email}</p>
                    <Link
                      href="/dashboard"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-[#012641] hover:bg-[#f8fafc] transition-colors cursor-pointer"
                    >
                      <LayoutDashboard size={15} aria-hidden="true" /> Dashboard
                    </Link>
                    <button
                      onClick={signOut}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer border-t border-[#e2e8f0]"
                    >
                      <LogOut size={15} aria-hidden="true" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="ml-2 px-4 py-2 bg-white/10 text-white text-sm font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-colors duration-200 cursor-pointer"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 border-t border-white/10 mt-1">
            <div className="flex flex-col gap-1 pt-3">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    pathname === href
                      ? 'bg-[#EE005A] text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/services"
                onClick={() => setOpen(false)}
                className="mt-2 px-4 py-3 bg-[#EE005A] text-white text-sm font-semibold rounded-lg hover:bg-[#c4004b] transition-colors duration-200 cursor-pointer text-center"
              >
                Book Service
              </Link>
              {authUser ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <LayoutDashboard size={15} aria-hidden="true" /> Dashboard
                  </Link>
                  <button
                    onClick={() => { setOpen(false); signOut() }}
                    className="px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-white/10 rounded-md transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <LogOut size={15} aria-hidden="true" /> Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 bg-white/10 text-white text-sm font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-colors cursor-pointer text-center"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
