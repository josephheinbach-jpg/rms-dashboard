import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RMS Dashboard',
  description: 'Multi-tenant IoT client portal'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <div className="max-w-6xl mx-auto p-6">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">RMS Dashboard</h1>
            <nav className="text-sm">
              <a className="underline" href="/">Home</a>
              <span className="mx-2">·</span>
              <a className="underline" href="/dashboard">Dashboard</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
