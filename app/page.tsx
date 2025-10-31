import { prisma } from '../lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

type Org = { id: string; name: string }

async function setOrg(formData: FormData) {
  'use server'
  const orgId = String(formData.get('orgId') || '')
  if (!orgId) return
  const c = cookies() // cookies() is synchronous
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
  let orgs: Org[] = []

  // Avoid failing the whole render if DB is unreachable
  try {
    orgs = (await prisma.organization.findMany({
      orderBy: { name: 'asc' },
      // If you want to be extra safe with pooling limits:
      // take: 100,
    })) as Org[]
  } catch (err) {
    console.error('Failed to load organizations', err)
    orgs = []
  }

  return (
    <main className="p-6">
      <h2 className="text-xl font-semibold mb-4">Choose an Organization (Demo)</h2>

      {orgs.length === 0 ? (
        <div className="rounded-xl border p-4 text-gray-600 bg-white">
          <div className="font-medium mb-1">No organizations found.</div>
          <div className="text-sm">
            Seed the database first, then refresh this page.
          </div>
        </div>
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
