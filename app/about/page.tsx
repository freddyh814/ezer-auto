import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ExternalLink, MapPin, Users, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Ezer Auto — Omaha\'s trusted neighborhood dealership and its connection to EzerCarros.com and the Honduras vehicle export pipeline.',
}

const team = [
  { name: 'Dom', role: 'CEO & Founder', bio: 'Leads the Ezer Kenegdo vision across both the Omaha and Honduras operations.' },
  { name: 'Will', role: 'Sales', bio: 'Helps customers find the right vehicle and guides them through the buying process.' },
  { name: 'Jeremy', role: 'Compliance', bio: 'Ensures every transaction meets legal and regulatory standards.' },
  { name: 'Thomas', role: 'Foreign Relations', bio: 'Manages international partnerships and the Honduras pipeline.' },
  { name: 'Freddy', role: 'Logistics', bio: 'Coordinates vehicle transport, inventory management, and operations.' },
  { name: 'Tanner', role: 'Social Media', bio: 'Builds Ezer Auto\'s presence and connects with the community online.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[#012641] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">About Ezer Auto</h1>
          <p className="text-white/70">Rooted in Omaha. Connected to the world.</p>
        </div>
      </div>

      {/* Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#EE005A]/10 rounded-full px-3 py-1 mb-5">
              <Heart size={14} className="text-[#EE005A]" aria-hidden="true" />
              <span className="text-[#EE005A] text-sm font-medium">Our Story</span>
            </div>
            <h2 className="text-3xl font-bold text-[#012641] mb-5">Built for the Omaha Community</h2>
            <div className="space-y-4 text-[#475569] leading-relaxed">
              <p>
                Ezer Auto was founded on a simple belief: every family deserves access to a reliable vehicle at an honest price. We started on North 30th Street in Omaha, Nebraska — right in the heart of the community we serve.
              </p>
              <p>
                We carefully inspect every vehicle before it hits our lot. No surprises, no pressure — just transparent deals and vehicles you can trust. Our team lives and works in this community, and your satisfaction is personal to us.
              </p>
              <p>
                &quot;Ezer Kenegdo&quot; is a Hebrew phrase meaning &quot;a helper who is a counterpart&quot; — a suitable partner for the journey. That&apos;s the standard we hold ourselves to with every customer and every car.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Honduras Connection */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#012641]/10 rounded-full px-3 py-1 mb-5">
                <MapPin size={14} className="text-[#012641]" aria-hidden="true" />
                <span className="text-[#012641] text-sm font-medium">Honduras Pipeline</span>
              </div>
              <h2 className="text-3xl font-bold text-[#012641] mb-4">The Honduras Connection</h2>
              <p className="text-[#475569] leading-relaxed mb-4">
                Ezer Auto is the US operations arm of a larger vehicle pipeline connecting Omaha to Honduras through our sister company, EzerCarros.com.
              </p>
              <p className="text-[#475569] leading-relaxed mb-6">
                We source, inspect, and prepare vehicles in Omaha — some go to American families right here in Nebraska, and others travel through our pipeline to buyers in Central America who want quality, rust-free American cars.
              </p>
              <a
                href="https://ezercarros.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#012641] text-white font-semibold rounded-lg hover:bg-[#023a61] transition-colors duration-200 cursor-pointer"
              >
                Visit EzerCarros.com <ExternalLink size={16} aria-hidden="true" />
              </a>
            </div>
            <div className="bg-[#012641] rounded-2xl p-8 text-white">
              <h3 className="font-bold text-lg mb-5">The Ezer Kenegdo Network</h3>
              <div className="space-y-4">
                {[
                  { city: 'Omaha, Nebraska', desc: 'Vehicle sourcing, inspection, sales & service', tag: 'Ezer Auto' },
                  { city: 'Honduras', desc: 'International vehicle export & delivery', tag: 'EzerCarros.com' },
                ].map(({ city, desc, tag }) => (
                  <div key={city} className="flex items-start gap-3 p-4 bg-white/10 rounded-xl">
                    <MapPin size={18} className="text-[#EE005A] mt-0.5 shrink-0" aria-hidden="true" />
                    <div>
                      <div className="font-semibold">{city}</div>
                      <div className="text-sm text-white/60 mt-0.5">{desc}</div>
                      <div className="mt-2 text-xs font-medium text-[#EE005A]">{tag}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#EE005A]/10 rounded-full px-3 py-1 mb-3">
                <Users size={14} className="text-[#EE005A]" aria-hidden="true" />
                <span className="text-[#EE005A] text-sm font-medium">Our Team</span>
              </div>
              <h2 className="text-3xl font-bold text-[#012641]">The People Behind Ezer Auto</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {team.map(({ name, role, bio }) => (
              <div key={name} className="bg-[#f8fafc] rounded-xl p-6 border border-[#e2e8f0]">
                <div className="w-12 h-12 bg-[#012641] rounded-full flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-lg">{name[0]}</span>
                </div>
                <h3 className="font-bold text-[#012641]">{name}</h3>
                <p className="text-sm font-medium text-[#EE005A] mb-2">{role}</p>
                <p className="text-sm text-[#475569] leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#012641]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to find your next car?</h2>
          <p className="text-white/70 mb-6">Browse our inventory or stop by 3224 N 30th Street in Omaha.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/inventory" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#EE005A] text-white font-semibold rounded-lg hover:bg-[#c4004b] transition-colors duration-200 cursor-pointer">
              Browse Inventory <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-colors duration-200 cursor-pointer">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
