const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Orgs
  const orgA = await prisma.organization.upsert({
    where: { slug: 'home-leasing' },
    update: {},
    create: { name: 'Home Leasing', slug: 'home-leasing' }
  })
  const orgB = await prisma.organization.upsert({
    where: { slug: 'acme-apartments' },
    update: {},
    create: { name: 'Acme Apartments', slug: 'acme-apartments' }
  })

  // Devices & Sensors for orgA
  const devA1 = await prisma.device.upsert({
    where: { monnitId: 'MONNIT-D-1' },
    update: { organizationId: orgA.id },
    create: { organizationId: orgA.id, monnitId: 'MONNIT-D-1', name: 'Boiler Room Gateway', lastSeenAt: new Date() }
  })
  const sTemp = await prisma.sensor.upsert({
    where: { monnitId: 'MONNIT-S-1' },
    update: { organizationId: orgA.id, deviceId: devA1.id },
    create: { organizationId: orgA.id, deviceId: devA1.id, monnitId: 'MONNIT-S-1', type: 'temperature', unit: '°F', name: 'Boiler Temp' }
  })
  const sLeak = await prisma.sensor.upsert({
    where: { monnitId: 'MONNIT-S-2' },
    update: { organizationId: orgA.id, deviceId: devA1.id },
    create: { organizationId: orgA.id, deviceId: devA1.id, monnitId: 'MONNIT-S-2', type: 'water-leak', unit: '', name: 'Basement Leak' }
  })

  // 24h of readings for temp every 15 minutes
  const readings = []
  const now = new Date()
  for (let i = 96; i >= 0; i--) {
    const ts = new Date(now.getTime() - i * 15 * 60 * 1000)
    const val = 68 + Math.sin(i/10) * 5 + Math.random() * 0.8
    readings.push({ sensorId: sTemp.id, ts, value: Number(val.toFixed(2)) })
  }
  if (readings.length) await prisma.reading.createMany({ data: readings })

  // Leak "ok" reading
  await prisma.reading.create({
    data: { sensorId: sLeak.id, ts: new Date(now.getTime() - 60 * 60 * 1000), value: 0 }
  })

  // Devices & Sensors for orgB
  const devB1 = await prisma.device.upsert({
    where: { monnitId: 'MONNIT-D-9' },
    update: { organizationId: orgB.id },
    create: { organizationId: orgB.id, monnitId: 'MONNIT-D-9', name: 'Roof Gateway', lastSeenAt: new Date() }
  })
  const sHum = await prisma.sensor.upsert({
    where: { monnitId: 'MONNIT-S-9' },
    update: { organizationId: orgB.id, deviceId: devB1.id },
    create: { organizationId: orgB.id, deviceId: devB1.id, monnitId: 'MONNIT-S-9', type: 'humidity', unit: '%', name: 'Attic Humidity' }
  })

  const readingsHum = []
  for (let i = 96; i >= 0; i--) {
    const ts = new Date(now.getTime() - i * 15 * 60 * 1000)
    const val = 45 + Math.cos(i/8) * 10 + Math.random() * 1.2
    readingsHum.push({ sensorId: sHum.id, ts, value: Number(val.toFixed(2)) })
  }
  if (readingsHum.length) await prisma.reading.createMany({ data: readingsHum })

  console.log('Seed complete. Orgs:', orgA.name, orgB.name)
}

main().then(() => process.exit(0)).catch(e => {
  console.error(e)
  process.exit(1)
})
