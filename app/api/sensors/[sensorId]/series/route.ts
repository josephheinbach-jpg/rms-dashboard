// app/api/sensors/[sensorId]/series/route.ts
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
// import { prisma } from '../../../../../lib/prisma' // TEMP: not used

type Point = { ts: string; value: number }

export async function GET() {
  // TEMP: return an empty series until Prisma models are added
  const data: Point[] = []
  return NextResponse.json({ ok: true, data })
}
