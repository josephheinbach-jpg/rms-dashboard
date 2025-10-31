// app/dashboard/page.tsx  (or src/app/dashboard/page.tsx)
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { prisma } from '../../lib/prisma'
import { cookies } from 'next/headers'

export default async function Dashboard() {
  const c = cookies()
  const cookieOrgId = c.get('orgId')?.value ?? null

  // 1) Pick active org (cookie → fallback to first)
  let activeOrg: any = null
  try {
    if (cookieOrgId) {
      activeOrg = await prisma.organization.findUnique({
        where: { id: cookieOrgId },
      })
    }
    if (!activeOrg) {
      activeOrg = await prisma.organization.findFirst({
        orderBy: { name: 'asc' },
      })
    }
  } catch (e) {
    console.error('Org query failed', e)
    activeOrg = null
  }

  // 2) Load sensors for that org
  let sensors: any[] = []
  if (activeOrg) {
    try {
      sensors = await prisma.sensor.findMany({
        where: { orgId: activeOrg.id }, // Prisma field is camelCase
        orderBy: { ts: 'desc' },
        take: 50,
      })
    } catch (e) {
      console.error('Sensor query failed', e)
      sensors = []
    }
  }

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
                <th className="px-4 py-2 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {sensors.map((s) => (
                <tr key={
