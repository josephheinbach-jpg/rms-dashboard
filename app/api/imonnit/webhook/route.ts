// app/api/imonnit/webhook/route.ts
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { verifyMonnitSignature } from '../../../../lib/imonnit-verify'

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

  // TEMPORARY: no DB writes — just acknowledge
  const count = Array.isArray(payload.readings) ? payload.readings.length : 0
  // Optional: log a tiny summary for debugging (Vercel logs)
  console.log('Monnit webhook received', { count })

  return NextResponse.json({ ok: true, received: count })
}
