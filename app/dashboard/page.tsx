// app/dashboard/page.tsx  (or src/app/dashboard/page.tsx)
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

  // 1) Pick active org (cookie → fallback to first)
  let activeOrg: Org | null = null
  try {
    if (cookieOrgId) {
      activeOrg = (await prisma.organization.findUnique({
        where: { id: cookieOrgId },
      })) as Org | null
    }
    if (!activeOrg) {
      activeOrg = (await prisma.organization.findFirst({
        orderBy: { name: 'asc' },
      })) as Org | null
    }
  }
