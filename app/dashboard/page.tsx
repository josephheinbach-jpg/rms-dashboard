// app/dashboard/page.tsx
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { prisma } from '../../lib/prisma'

type OrgRow = { id: string; name: string }
type SensorRow = {
  id: string
  sensorName: string | null
  status: string | null
  temperature: number | null
  humidity: number | null
  battery: number | null
  ts: string
}

export default async function Dashboard() {
  // 1) First org
  let org: OrgRow | null = null
  try {
    const rows = await prisma.$queryRaw<OrgRow[]>`
      select id, name
      from public.organization
      order by name asc
      limit 1
    `
    org = rows[0] ?? null
  } catch (e) {
    console.error('Org query failed', e)
  }

  // 2) Sensors for that org
  let sensors: SensorRow[] = []
  if (org) {
    try {
      const rows = await prisma.$queryRaw<SensorRow[]>`
        select
          id,
          sensor_name as "sensorName",
          status,
          temperature::float as temperature,
          humidity::float as humidity,
          battery::float as battery,
          to_char(ts, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as ts
        from public.sensor
        where org_id = ${org.id}
        order by ts desc
        limit 50
      `
      sensors = rows
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

