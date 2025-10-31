// app/dashboard/page.tsx
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import React from 'react'

export default function Dashboard() {
  return (
    <main className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <div className="rounded-xl border bg-white p-4 text-gray-700">
        Build is green. Data wiring will be added next.
      </div>
    </main>
  )
}
