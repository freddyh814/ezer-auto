'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Car } from 'lucide-react'

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
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

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
            <div className="w-9 h-9 bg-[#EE005A] rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <Car size={20} className="text-white" aria-hidden="true" />
            </div>
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
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
