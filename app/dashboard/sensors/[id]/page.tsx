import Link from 'next/link'
import { requireOrg } from '../../../../lib/authz'
import { prisma } from '../../../../lib/prisma'

type Row = { ts: Date; value: unknown }

export default async function SensorDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { orgId } = await requireOrg()

  const sensor = await prisma.sensor.findFirst({
    where: { id: params.id, organizationId: orgId },
    select: { id: true, name: true, type: true, unit: true },
  })
  if (!sensor) {
    return (
      <main>
        <h2 className="text-xl font-semibold mb-2">Sensor not found</h2>
        <Link className="underline" href="/dashboard">
          ← Back to Dashboard
        </Link>
      </main>
    )
  }

  const rows = await prisma.reading.findMany({
    where: { sensorId: params.id, sensor: { organizationId: orgId } },
    orderBy: { ts: 'asc' },
    select: { ts: true, value: true },
    take: 2000,
  })

  const data = (rows as Row[]).map((r: Row) => ({
    ts: r.ts.toISOString(),
    value: Number(r.value as number),
  }))

  return (
    <main>
      <h2 className="text-xl font-semibold mb-2">
        {sensor.name} · 24h Trend
      </h2>

      {/* Minimal readout so the page renders even before you wire charts */}
      <div className="rounded-xl border bg-white p-4">
        <div className="text-sm text-gray-600">
          {sensor.type} {sensor.unit ? `(${sensor.unit})` : ''}
        </div>
        <div className="text-xs text-gray-500 mb-2">
          {data.length} points
        </div>

        <div className="max-h-64 overflow-auto text-sm">
          {data.slice(-20).map((p, i) => (
            <div key={i} className="flex justify-between border-b py-1">
              <span>{new Date(p.ts).toLocaleString()}</span>
              <span>{Number.isNaN(p.value) ? '—' : p.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <Link className="underline" href="/dashboard">
          ← Back to Dashboard
        </Link>
      </div>
    </main>
  )
}
