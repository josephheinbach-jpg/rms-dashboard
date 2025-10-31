import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

async function setOrg(orgId: string) {
  'use server'
  const c = await cookies()
  c.set('orgId', orgId, { path: '/', httpOnly: false })
}

export default async function Home() {
  const orgs = await prisma.organization.findMany({ orderBy: { name: 'asc' } })
  return (
    <main>
      <h2 className="text-xl font-semibold mb-4">Choose an Organization (Demo)</h2>
      <form action={setOrg}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {orgs.map(o => (
            <button
              key={o.id}
              formAction={async () => setOrg(o.id)}
              className="p-4 rounded-xl border bg-white hover:bg-gray-50 text-left"
            >
              <div className="font-medium">{o.name}</div>
              <div className="text-xs text-gray-500">{o.slug}</div>
            </button>
          ))}
        </div>
      </form>
      <p className="mt-4 text-sm text-gray-600">After selecting, click <a className="underline" href="/dashboard">Dashboard</a>.</p>
    </main>
  )
}
