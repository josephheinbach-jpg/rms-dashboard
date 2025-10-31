import { prisma } from '@/lib/prisma'
import { requireOrg } from '@/lib/authz'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { sensorId: string }}) {
  const { orgId } = await requireOrg()
  const rows = await prisma.reading.findMany({
    where: { sensorId: params.sensorId, sensor: { organizationId: orgId } },
    orderBy: { ts: 'asc' },
    take: 2000
  })
  return NextResponse.json(rows.map(r => ({ ts: r.ts.toISOString(), value: Number(r.value) })))
}
