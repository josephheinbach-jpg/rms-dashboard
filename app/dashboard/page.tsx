import { requireOrg } from '../../lib/authz'
import { prisma } from '../../lib/prisma'
import Link from 'next/link'

type Reading = { ts: Date; value: unknown }
type SensorWithReading = {
  id: string
  name: string
  type: string
  unit: string | null
  readings: Reading[]
}

export default async function DashboardPage() {
  const { orgId, org } = await requireOrg()

  const sensors = (await prisma.sensor.findMany({
    where: { organizationId: orgId },
    include: { readings: { orderBy: { ts: 'desc' }, take: 1 } },
    orderBy: { name: 'asc' }
  })) as unknown as SensorWithReading[]

  return (
    <main>
      <h2 className="text-xl font-semibold mb-2">{org.name} · Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sensors.length === 0 ? (
          <div className="text-gray-500">No sensors yet.</div>
        ) : (
          sensors.map((s) => {
            const current = s.readings?.[0]
            const value =
              current !== undefined ? Number((current as any).value) : null

            return (
              <div key={s.id} className="rounded-xl border bg-white p-4">
                <div className="text-sm text-gray-600">
                  {s.type} {s.unit ? `(${s.unit})` : ''}
                </div>
                <div className="text-lg font-bold">{s.name}</div>
                <div className="mt-2 text-2xl">
                  {value !== null && !Number.isNaN(value)
                    ? value.toFixed(2)
                    : '—'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {current
                    ? new Date((current as any).ts).toLocaleString()
                    : 'No data'}
                </div>
                <div className="mt-3">
                  <Link
                    className="underline text-sm"
                    href={`/dashboard/sensors/${s.id}`}
                  >
                    View 24h trend →
                  </Link>
                </div>
              </div>
            )
          })
        )}
      </div>
    </main>
  )
}

