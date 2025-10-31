export const dynamic = 'force-dynamic'
export const revalidate = 0

import { prisma } from '../lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

type Org = { id: string; name: string }

async function setOrg(formData: FormData) {
  'use server'
  const orgId = String(formData.get('orgId') || '')
  if (!orgId) return
  const c = await cookies()
  c.set('orgId', orgId, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
  redirect('/dashboard')
}

export default async function HomePage() {
  const orgs = (await prisma.organization.findMany({
    orderBy: { name: 'asc' },
  })) as Org[]

  return (
    <main>
      <h2 className="text-xl font-semibold mb-4">Choose an Organization (Demo)</h2>

      {orgs.length === 0 ? (
        <div className="text-gray-500">No organizations yet. Seed the database first.</div>
      ) : (
        <form action={setOrg}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {orgs.map((o: Org) => (
              <button
                key={o.id}
                type="submit"
                name="orgId"
                value={o.id}
                className="rounded-xl border bg-white p-4 text-left hover:bg-gray-50"
              >
                <div className="text-lg font-semibold">{o.name}</div>
                <div className="text-sm text-gray-500">Select →</div>
              </button>
            ))}
          </div>
        </form>
      )}
    </main>
  )
}
