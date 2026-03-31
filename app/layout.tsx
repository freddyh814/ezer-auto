import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  metadataBase: new URL('https://ezerauto.com'),
  title: {
    default: 'Ezer Auto — Used Cars & Service Center in Omaha, NE',
    template: '%s | Ezer Auto Omaha',
  },
  description:
    'Ezer Auto is Omaha\'s trusted used car dealership and service center located at 3224 N 30th Street. Browse quality vehicles, book service, and more.',
  keywords: ['used cars omaha', 'car dealership omaha nebraska', 'auto service omaha', 'ezer auto'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ezerauto.com',
    siteName: 'Ezer Auto',
    title: 'Ezer Auto — Used Cars & Service Center in Omaha, NE',
    description: 'Quality used vehicles and expert service in Omaha, Nebraska.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ezer Auto — Used Cars & Service Center in Omaha, NE',
    description: 'Quality used vehicles and expert service in Omaha, Nebraska.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-[#0f172a]">
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
