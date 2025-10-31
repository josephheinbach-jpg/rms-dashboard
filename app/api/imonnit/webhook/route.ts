import { prisma } from '../../../../lib/prisma'
import { verifyMonnitSignature } from '../../../../lib/imonnit-verify'


import { verifyMonnitSignature } from '@/lib/imonnit-verify'

type ReadingPayload = {
  readings: Array<{
    sensorId: string
    deviceId: string
    ts: string
    value: number
    type: string
    unit?: string
    accountId: string
  }>
}

async function mapAccount(_accountId: string) {
  // TODO: Implement your real Monnit Account → Organization mapping.
  const org = await prisma.organization.findFirst({ orderBy: { createdAt: 'asc' } })
  return org?.id
}

export async function POST(req: NextRequest) {
  const raw = await req.text()
  if (!verifyMonnitSignature(req.headers, raw)) {
    return NextResponse.json({ ok: false, error: 'invalid signature' }, { status: 401 })
  }
  let payload: ReadingPayload
  try {
    payload = JSON.parse(raw)
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 })
  }

  for (const r of payload.readings ?? []) {
    const orgId = await mapAccount(r.accountId)
    if (!orgId) continue

    const device = await prisma.device.upsert({
      where: { monnitId: r.deviceId },
      update: { lastSeenAt: new Date(r.ts), organizationId: orgId },
      create: {
        monnitId: r.deviceId,
        organizationId: orgId,
        name: `Device ${r.deviceId}`,
        lastSeenAt: new Date(r.ts)
      }
    })

    const sensor = await prisma.sensor.upsert({
      where: { monnitId: r.sensorId },
      update: { type: r.type, unit: r.unit ?? null, name: `Sensor ${r.sensorId}`, deviceId: device.id, organizationId: orgId },
      create: {
        monnitId: r.sensorId,
        organizationId: orgId,
        deviceId: device.id,
        type: r.type,
        unit: r.unit ?? null,
        name: `Sensor ${r.sensorId}`
      }
    })

    await prisma.reading.create({
      data: { sensorId: sensor.id, ts: new Date(r.ts), value: r.value }
    })
  }

  return NextResponse.json({ ok: true })
}
