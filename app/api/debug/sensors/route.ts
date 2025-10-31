export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET() {
  try {
    // Fetch first organization
    const org = await prisma.$queryRaw<{ id: string }[]>`
      select id from public.organization order by name asc limit 1
    `
    if (!org[0]) {
      return NextResponse.json({ ok: false, reason: 'no org found' })
    }

    // Fetch sensors linked to that org
    const rows = await prisma.$queryRaw<any[]>`
      select id, sensor_name, status, temperature, humidity, battery, ts
      from public.sensor
      where org_id = ${org[0].id}
      order by ts desc
      limit 10
    `

    return NextResponse.json({ ok: true, count: rows.length, rows })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ ok: false, error: e.message })
  }
}
