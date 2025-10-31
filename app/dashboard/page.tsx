// app/dashboard/page.tsx
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { prisma } from '../../lib/prisma'

export default async function Dashboard() {
  // 1) Pick the first org
  let org: any = null
  try {
    org = await prisma.organization.findFirst({ orderBy: { name: 'asc' } })
  } catch (e) {
    console.error('Org query failed', e)
  }

  // 2) Load recent sensors for that org
  let sensors: any[] = []
  if (org) {
    try {
      sensors = await prisma.sensor.findMany({
        where: { orgId: org.id },           // matches Prisma field (orgId)
        orderBy: { ts: 'desc' },
        take: 50,
      })
    } catch (e) {
      console.error('Sensor query failed', e)
    }
  }

  return (
    <main className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">
        Dashboard {org ? `– ${org.name}` : ''}
      </h2>

      {!org ? (
        <div className="rounded-xl border bg-white p-4 text-gray-700">
          No organizations found. Seed the DB, then refresh.
        </div>
      ) : sensors.length === 0 ? (
        <div className="rounded-xl border bg-white p-4 text-gray-700">
          No sensor data yet for {org.name}.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Sensor</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Temp</th>
                <th className="px-4 py-2 text-left">Humidity</th>
                <th className="px-4 py-2 text-left">Battery</th>
                <th className="px-4 py-2 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {sensors.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="px-4 py-2">{s.sensorName ?? '—'}</td>
                  <td className="px-4 py-2">{s.status ?? '—'}</td>
                  <td className="px-4 py-2">{s.temperature ?? '—'}</td>
                  <td className="px-4 py-2">{s.humidity ?? '—'}</td>
                  <td className="px-4 py-2">{s.battery ?? '—'}%</td>
                  <td className="px-4 py-2">{new Date(s.ts).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
