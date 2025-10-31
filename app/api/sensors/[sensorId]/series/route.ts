import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'
import { requireOrg } from '../../../../../lib/authz'

type Row = { ts: Date; value: unknown }

export async function GET(
  _req: Request,
  { params }: { params: { sensorId: string } }
) {
  const { orgId } = await requireOrg()

  const rows = await prisma.reading.findMany({
    where: { sensorId: params.sensorId, sensor: { organizationId: orgId } },
    orderBy: { ts: 'asc' },
    select: { ts: true, value: true },
    take: 2000,
  })

  return NextResponse.json(
    (rows as Row[]).map((r) => ({
      ts: r.ts.toISOString(),
      value: Number((r as Row).value),
    }))
  )
}
