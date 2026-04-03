import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, Car, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#012641] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-[#EE005A] rounded-lg flex items-center justify-center">
                <Car size={20} className="text-white" aria-hidden="true" />
              </div>
              <span className="font-bold text-xl">Ezer <span className="text-[#EE005A]">Auto</span></span>
            </div>
            <div className="mt-1 rounded-lg overflow-hidden border border-white/10">
              <iframe
                src="https://www.google.com/maps?q=3224+N+30th+Street,+Omaha,+NE+68111&output=embed"
                width="100%"
                height="150"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ezer Auto location"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-widest text-[#EE005A] mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: '/inventory', label: 'Browse Inventory' },
                { href: '/services', label: 'Service Center' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
                { href: '/login', label: 'Customer Login' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-white/70 hover:text-white text-sm transition-colors duration-200 cursor-pointer"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-widest text-[#EE005A] mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/70">
                <MapPin size={15} className="mt-0.5 shrink-0 text-[#EE005A]" aria-hidden="true" />
                <span>3224 N 30th Street<br />Omaha, NE 68111</span>
              </li>
              <li>
                <a
                  href="tel:7202085580"
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  <Phone size={15} className="text-[#EE005A]" aria-hidden="true" />
                  720-208-5580
                </a>
              </li>
              <li>
                <a
                  href="mailto:Frederick@theezerkenegdo.com"
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  <Mail size={15} className="text-[#EE005A]" aria-hidden="true" />
                  Frederick@theezerkenegdo.com
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-widest text-[#EE005A] mb-4">Hours</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <Clock size={15} className="mt-0.5 text-[#EE005A]" aria-hidden="true" />
                <div>
                  <div>Mon – Sun: 8am – 7pm</div>
                </div>
              </li>
            </ul>
            <a
              href="https://ezercarros.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex items-center gap-1.5 text-sm font-medium text-[#EE005A] hover:text-white transition-colors cursor-pointer"
            >
              <ExternalLink size={14} aria-hidden="true" />
              EzerCarros.com — Honduras
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/50 text-xs">© {new Date().getFullYear()} Ezer Auto. All rights reserved.</p>
          <p className="text-white/40 text-xs">3224 N 30th St, Omaha, NE 68111</p>
        </div>
      </div>
    </footer>
  )
}
