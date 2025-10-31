// app/dashboard/sensors/[id]/page.tsx
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import React from 'react'

type Params = { params: { id: string } }

export default function SensorDetail({ params }: Params) {
  return (
    <main className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Sensor Detail</h2>
      <div className="rounded-xl border bg-white p-4 text-gray-700">
        Sensor ID: <span className="font-mono">{params.id}</span>
      </div>
      <div className="rounded-xl border bg-white p-4 text-gray-700">
        (Temporarily stubbed — wiring to Prisma will be added after build is green.)
      </div>
    </main>
  )
}

