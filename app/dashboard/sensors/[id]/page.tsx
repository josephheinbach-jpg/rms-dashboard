import { prisma } from '@/lib/prisma'
import { requireOrg } from '@/lib/authz'
import TemperatureTrend from '@/components/widgets/TemperatureTrend'

export default async function SensorDetail({ params }: { params: { id: string }}) {
  const { orgId } = await requireOrg()
  const sensor = await prisma.sensor.findFirst({
    where: { id: params.id, organizationId: orgId }
  })
  if (!sensor) return <div className="text-red-600">Sensor not found</div>
  const rows = await prisma.reading.findMany({
    where: { sensorId: sensor.id },
    orderBy: { ts: 'asc' },
    take: 2000
  })
  const data = rows.map(r => ({ ts: r.ts.toISOString(), value: r.value }))
  return (
    <main>
      <h2 className="text-xl font-semibold mb-2">{sensor.name} · 24h Trend</h2>
      <TemperatureTrend data={data} />
    </main>
  )
}
