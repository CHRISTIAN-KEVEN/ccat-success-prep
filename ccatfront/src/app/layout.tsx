import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { I18nProvider } from '@/context/I18nContext'
import './globals.css'

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CCAT Pro — Data-Driven Preparation',
  description: 'Master the CCAT with high-fidelity simulations, deep domain analytics, and personalized drills.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  )
}
