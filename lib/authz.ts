import { cookies } from 'next/headers'
import { prisma } from './prisma'

export async function requireOrg() {
  const c = await cookies()
  const orgId = c.get('orgId')?.value
  if (!orgId) {
    throw new Error('No organization selected. In DEMO mode, pick one on the home page.')
  }
  const org = await prisma.organization.findUnique({ where: { id: orgId } })
  if (!org) throw new Error('Organization not found.')
  return { orgId, org }
}
