import type { Metadata } from 'next'
import ContactForm from './ContactForm'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Ezer Auto. Visit us at 3224 N 30th Street Omaha NE, call 720-208-5580, or send us a message.',
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  name: 'Ezer Auto',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '3224 N 30th Street',
    addressLocality: 'Omaha',
    addressRegion: 'NE',
    postalCode: '68111',
    addressCountry: 'US',
  },
  telephone: '+17202085580',
  email: 'Contact@theezerkenegdo.com',
}

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <div className="min-h-screen bg-[#f8fafc]">
        <div className="bg-[#012641] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Contact Us</h1>
            <p className="text-white/70">We&apos;d love to hear from you</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-[#012641] mb-5">Send Us a Message</h2>
              <ContactForm />
            </div>

            {/* Info */}
            <div className="space-y-5">
              <div className="bg-[#012641] rounded-xl p-6 text-white">
                <h3 className="font-semibold mb-4">Get In Touch</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <MapPin size={18} className="text-[#EE005A] mt-0.5 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-sm">Address</p>
                      <p className="text-white/70 text-sm">3224 N 30th Street<br />Omaha, NE 68111</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone size={18} className="text-[#EE005A] mt-0.5 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-sm">Phone</p>
                      <a href="tel:7202085580" className="text-white/70 text-sm hover:text-white transition-colors cursor-pointer">720-208-5580</a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Mail size={18} className="text-[#EE005A] mt-0.5 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-sm">Email</p>
                      <a href="mailto:Contact@theezerkenegdo.com" className="text-white/70 text-sm hover:text-white transition-colors cursor-pointer break-all">Contact@theezerkenegdo.com</a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock size={18} className="text-[#EE005A] mt-0.5 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-sm">Hours</p>
                      <div className="text-white/70 text-sm space-y-0.5">
                        <p>Mon–Fri: 9am–6pm</p>
                        <p>Sat: 10am–4pm</p>
                        <p>Sun: Closed</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Map */}
              <div className="rounded-xl overflow-hidden border border-[#e2e8f0] h-56">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2994.3!2d-95.9726!3d41.2834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s3224+N+30th+Street%2C+Omaha%2C+NE+68111!5e0!3m2!1sen!2sus!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ezer Auto location map"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
