import { requireOrg } from '../../lib/authz'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function DashboardPage() {
  const { orgId, org } = await requireOrg()
  const sensors = await prisma.sensor.findMany({
    where: { organizationId: orgId },
    include: { readings: { orderBy: { ts: 'desc' }, take: 1 } },
    orderBy: { name: 'asc' }
  })

  return (
    <main>
      <h2 className="text-xl font-semibold mb-2">{org.name} · Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sensors.length === 0 ? (
          <div className="text-gray-500">No sensors yet.</div>
        ) : (
          sensors.map((s: any) => {
            const current = s.readings?.[0]
            return (
              <div key={s.id} className="rounded-xl border bg-white p-4">
                <div className="text-sm text-gray-600">
                  {s.type} {s.unit ? `(${s.unit})` : ''}
                </div>
                <div className="text-lg font-bold">{s.name}</div>
                <div className="mt-2 text-2xl">
