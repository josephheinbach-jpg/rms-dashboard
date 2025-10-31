// app/dashboard/page.tsx (or src/app/dashboard/page.tsx)
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { prisma } from '../../lib/prisma'
import { cookies } from 'next/headers'

type Org = { id: string; name: string }
type Sensor = {
  id: string
  orgId: string
  sensorName: string | null
  status: string | null
  temperature: number | null
  humidity: number | null
  battery: number | null
  ts: Date
}

export default async function Dashboard() {
  const c = cookies()
  const cookieOrgId = c.get('orgId')?.value ?? null

  // pick active org (cookie or first)
  let activeOrg: Org | null = null
  if (cookieOrgId) {
    activeOrg = (await prisma.organization.findUnique({ where: { id: cookieOrgId } })) as Org | null
  }
  if (!activeOrg) {
    activeOrg = (await prisma.organization.findFirst({ orderBy: { name: 'asc' } })) as Org | null
  }

  // load sensors for that org
  const sensors: Sensor[] = activeOrg
    ? ((await prisma.sensor.findMany({
        where: { orgId: activeOrg.id }, // NOTE: orgId (camelCase) in Prisma
        orderBy: { ts: 'desc' },
        take: 50,
      })) as unknown as Sensor[])
    : []

  return (
    <main className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">
        Dashboard {activeOrg ? `– ${activeOrg.name}` : ''}
      </h2>

      {sensors.length === 0 ? (
        <div className="text-gray-600">No sensor data yet.</div>
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

